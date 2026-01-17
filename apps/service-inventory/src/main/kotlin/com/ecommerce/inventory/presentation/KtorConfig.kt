/**
 * Presentation Layer - Ktor Configuration
 * 
 * HTTPサーバー（ヘルスチェック用）の設定を行います。
 */

package com.ecommerce.inventory.presentation

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

/**
 * コンテンツネゴシエーションの設定
 * 
 * JSON形式でのリクエスト/レスポンスをサポートします。
 * Ktor 3.3で推奨される設定を適用しています。
 */
fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
            ignoreUnknownKeys = true
            encodeDefaults = true
            explicitNulls = false
        })
    }
}

/**
 * エラーハンドリングの設定
 * 
 * 統一されたエラーレスポンスを返します。
 */
fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse(
                    code = "INTERNAL_ERROR",
                    message = cause.message ?: "An unexpected error occurred"
                )
            )
        }
    }
}

/**
 * ルーティングの設定
 * 
 * ヘルスチェックエンドポイントを提供します。
 */
fun Application.configureRouting() {
    routing {
        /**
         * ヘルスチェックエンドポイント
         * 
         * Kubernetesのliveness/readiness probeで使用します。
         */
        get("/health") {
            call.respond(
                HealthCheckResponse(
                    status = "healthy",
                    service = "inventory-service",
                    version = "1.0.0",
                    timestamp = System.currentTimeMillis()
                )
            )
        }
        
        /**
         * メトリクスエンドポイント（簡易版）
         */
        get("/metrics") {
            call.respond(
                mapOf(
                    "service" to "inventory-service",
                    "uptime" to System.currentTimeMillis()
                )
            )
        }
    }
}

@Serializable
data class HealthCheckResponse(
    val status: String,
    val service: String,
    val version: String,
    val timestamp: Long
)

@Serializable
data class ErrorResponse(
    val code: String,
    val message: String
)
