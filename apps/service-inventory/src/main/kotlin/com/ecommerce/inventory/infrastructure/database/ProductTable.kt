/**
 * Infrastructure Layer - Product Table Definition
 * 
 * Exposed ORMによるテーブル定義です。
 * ドメインモデルとデータベーステーブルのマッピングを行います。
 */

package com.ecommerce.inventory.infrastructure.database

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp

/**
 * 商品テーブル定義
 * 
 * Exposed DSLを使用したテーブル定義です。
 * 型安全なクエリビルダーを提供します。
 */
object ProductTable : Table("products") {
    // 主キー
    val id = varchar("id", 36)
    
    // マルチテナント対応
    val tenantId = varchar("tenant_id", 50)
    
    // 商品情報
    val name = varchar("name", 200)
    val description = text("description")
    val price = long("price")
    val stockQuantity = integer("stock_quantity")
    val categoryId = varchar("category_id", 36).nullable()
    val sku = varchar("sku", 100)
    val status = integer("status").default(1) // 1=DRAFT, 2=ACTIVE, 3=INACTIVE, 4=ARCHIVED
    
    // タイムスタンプ
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    
    // 主キー定義
    override val primaryKey = PrimaryKey(id)
    
    // インデックス
    init {
        // テナントIDでのフィルタリングを高速化
        index(false, tenantId)
        
        // SKUでの検索を高速化（テナント内で一意）
        uniqueIndex(tenantId, sku)
        
        // 作成日時での並び替えを高速化
        index(false, tenantId, createdAt)
    }
}
