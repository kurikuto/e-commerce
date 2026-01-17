/**
 * Infrastructure Layer - Database Factory
 * 
 * データベース接続の初期化と管理を行います。
 * HikariCPによるコネクションプーリングを使用します。
 */

package com.ecommerce.inventory.infrastructure.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

/**
 * データベースファクトリ
 * 
 * シングルトンパターンでデータベース接続を管理します。
 */
object DatabaseFactory {
    /**
     * データベース初期化
     * 
     * 環境変数から接続情報を取得し、データベースに接続します。
     * テーブルが存在しない場合は自動作成します。
     */
    fun init() {
        val config = HikariConfig().apply {
            jdbcUrl = System.getenv("DB_URL") ?: "jdbc:postgresql://localhost:5432/ecommerce"
            driverClassName = "org.postgresql.Driver"
            username = System.getenv("DB_USER") ?: "postgres"
            password = System.getenv("DB_PASSWORD") ?: "postgres"
            maximumPoolSize = 10
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            
            // パフォーマンスチューニング
            addDataSourceProperty("cachePrepStmts", "true")
            addDataSourceProperty("prepStmtCacheSize", "250")
            addDataSourceProperty("prepStmtCacheSqlLimit", "2048")
            
            validate()
        }
        
        val dataSource = HikariDataSource(config)
        Database.connect(dataSource)
        
        logger.info { "データベースに接続しました: ${config.jdbcUrl}" }
        
        // テーブル作成
        transaction {
            SchemaUtils.create(ProductTable)
            logger.info { "テーブルスキーマを確認/作成しました" }
        }
    }
}
