/**
 * Infrastructure Layer - Redis Factory
 * 
 * Redisクライアントの初期化と管理を行います。
 * 分散ロック機能で在庫の競合制御に使用します。
 */

package com.ecommerce.inventory.infrastructure.redis

import io.lettuce.core.RedisClient
import io.lettuce.core.RedisURI
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.coroutines
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

/**
 * Redisファクトリ
 * 
 * シングルトンパターンでRedis接続を管理します。
 */
object RedisFactory {
    private lateinit var client: RedisClient
    private lateinit var connection: StatefulRedisConnection<String, String>
    
    /**
     * Redis初期化
     * 
     * 環境変数から接続情報を取得し、Redisに接続します。
     */
    fun init() {
        val redisHost = System.getenv("REDIS_HOST") ?: "localhost"
        val redisPort = System.getenv("REDIS_PORT")?.toInt() ?: 6379
        val redisPassword = System.getenv("REDIS_PASSWORD")
        
        val uriBuilder = RedisURI.builder()
            .withHost(redisHost)
            .withPort(redisPort)
        
        if (redisPassword != null) {
            uriBuilder.withPassword(redisPassword.toCharArray())
        }
        
        val uri = uriBuilder.build()
        client = RedisClient.create(uri)
        connection = client.connect()
        
        logger.info { "Redisに接続しました: $redisHost:$redisPort" }
    }
    
    /**
     * コルーチン対応のRedisコマンドAPIを取得
     */
    fun getCoroutinesApi() = connection.coroutines()
    
    /**
     * クリーンアップ
     */
    fun close() {
        if (::connection.isInitialized) {
            connection.close()
        }
        if (::client.isInitialized) {
            client.shutdown()
        }
        logger.info { "Redis接続をクローズしました" }
    }
}
