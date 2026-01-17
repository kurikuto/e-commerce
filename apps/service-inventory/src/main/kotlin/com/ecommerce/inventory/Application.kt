/**
 * アプリケーションエントリーポイント
 * 
 * KtorサーバーとgRPCサーバーを起動します。
 * Clean Architectureの原則に従い、依存関係の注入を行います。
 */

package com.ecommerce.inventory

import com.ecommerce.inventory.infrastructure.database.DatabaseFactory
import com.ecommerce.inventory.infrastructure.grpc.CatalogGrpcService
import com.ecommerce.inventory.infrastructure.redis.RedisFactory
import com.ecommerce.inventory.presentation.configureRouting
import com.ecommerce.inventory.presentation.configureSerialization
import com.ecommerce.inventory.presentation.configureStatusPages
import io.grpc.ServerBuilder
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

/**
 * メイン関数
 * 
 * アプリケーションの起動処理を行います。
 * - データベース接続の初期化
 * - Redis接続の初期化
 * - gRPCサーバーの起動
 * - HTTPサーバー（ヘルスチェック用）の起動
 */
fun main() {
    logger.info { "🚀 Starting E-Commerce Inventory Service..." }
    
    runBlocking {
        try {
            // データベース初期化
            logger.info { "📊 Initializing database connection..." }
            DatabaseFactory.init()
            logger.info { "✅ Database initialized successfully" }
            
            // Redis初期化
            logger.info { "🔴 Initializing Redis connection..." }
            RedisFactory.init()
            logger.info { "✅ Redis initialized successfully" }
            
            // gRPCサーバー起動
            val grpcPort = System.getenv("GRPC_PORT")?.toInt() ?: 50051
            logger.info { "🔧 Starting gRPC server on port $grpcPort..." }
            startGrpcServer(grpcPort)
            
            // HTTPサーバー起動（ヘルスチェック用）
            val httpPort = System.getenv("HTTP_PORT")?.toInt() ?: 8080
            logger.info { "🌐 Starting HTTP server on port $httpPort..." }
            startHttpServer(httpPort)
            
        } catch (e: Exception) {
            logger.error(e) { "❌ Failed to start application" }
            throw e
        }
    }
}

/**
 * gRPCサーバーを起動
 * 
 * @param port ポート番号
 */
private fun startGrpcServer(port: Int) {
    val server = ServerBuilder
        .forPort(port)
        .addService(CatalogGrpcService())
        .build()
        .start()
    
    logger.info { "✅ gRPC server started on port $port" }
    
    // シャットダウンフック
    Runtime.getRuntime().addShutdownHook(Thread {
        logger.info { "🛑 Shutting down gRPC server..." }
        server.shutdown()
        logger.info { "✅ gRPC server shut down successfully" }
    })
    
    server.awaitTermination()
}

/**
 * HTTPサーバーを起動（ヘルスチェック用）
 * 
 * @param port ポート番号
 */
private fun startHttpServer(port: Int) {
    embeddedServer(Netty, port = port, module = Application::module)
        .start(wait = false)
    
    logger.info { "✅ HTTP server started on port $port" }
}

/**
 * Ktorモジュール設定
 * 
 * プラグインやルーティングを設定します。
 */
fun Application.module() {
    configureSerialization()
    configureStatusPages()
    configureRouting()
}
