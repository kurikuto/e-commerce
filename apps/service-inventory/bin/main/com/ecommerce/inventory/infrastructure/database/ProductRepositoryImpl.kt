/**
 * Infrastructure Layer - Product Repository Implementation
 * 
 * リポジトリインターフェースの実装です。
 * Exposed ORMを使用してデータベース操作を行います。
 */

package com.ecommerce.inventory.infrastructure.database

import com.ecommerce.inventory.domain.model.*
import com.ecommerce.inventory.domain.repository.PaginatedResult
import com.ecommerce.inventory.domain.repository.ProductRepository
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

/**
 * Productリポジトリ実装
 * 
 * Exposed DSLを使用した型安全なデータベース操作を提供します。
 */
class ProductRepositoryImpl : ProductRepository {
    
    override suspend fun save(product: Product): Product = dbQuery {
        val existing = ProductTable.select { 
            (ProductTable.id eq product.id.value) and 
            (ProductTable.tenantId eq product.tenantId.value)
        }.singleOrNull()
        
        if (existing == null) {
            // Insert
            ProductTable.insert {
                it[id] = product.id.value
                it[tenantId] = product.tenantId.value
                it[name] = product.name
                it[description] = product.description
                it[price] = product.price.amount
                it[stockQuantity] = product.stockQuantity
                it[categoryId] = product.categoryId
                it[sku] = product.sku
                it[status] = product.status.toProtoStatus()
                it[createdAt] = product.createdAt
                it[updatedAt] = product.updatedAt
            }
            logger.info { "商品を挿入しました: id=${product.id.value}" }
        } else {
            // Update
            ProductTable.update({ 
                (ProductTable.id eq product.id.value) and 
                (ProductTable.tenantId eq product.tenantId.value)
            }) {
                it[name] = product.name
                it[description] = product.description
                it[price] = product.price.amount
                it[stockQuantity] = product.stockQuantity
                it[categoryId] = product.categoryId
                it[sku] = product.sku
                it[status] = product.status.toProtoStatus()
                it[updatedAt] = product.updatedAt
            }
            logger.info { "商品を更新しました: id=${product.id.value}" }
        }
        
        product
    }
    
    override suspend fun findById(id: ProductId, tenantId: TenantId): Product? = dbQuery {
        ProductTable.select { 
            (ProductTable.id eq id.value) and 
            (ProductTable.tenantId eq tenantId.value)
        }
            .map { it.toProduct() }
            .singleOrNull()
    }
    
    override suspend fun findBySku(sku: String, tenantId: TenantId): Product? = dbQuery {
        ProductTable.select { 
            (ProductTable.sku eq sku) and 
            (ProductTable.tenantId eq tenantId.value)
        }
            .map { it.toProduct() }
            .singleOrNull()
    }
    
    override suspend fun findAll(
        tenantId: TenantId,
        page: Int,
        pageSize: Int
    ): PaginatedResult<Product> = dbQuery {
        val offset = (page - 1) * pageSize.toLong()
        
        // 総件数を取得
        val totalCount = ProductTable
            .select { ProductTable.tenantId eq tenantId.value }
            .count()
            .toInt()
        
        // ページネーション付きでデータを取得
        val items = ProductTable
            .select { ProductTable.tenantId eq tenantId.value }
            .orderBy(ProductTable.createdAt to SortOrder.DESC)
            .limit(pageSize, offset)
            .map { it.toProduct() }
        
        PaginatedResult(
            items = items,
            totalCount = totalCount,
            currentPage = page,
            pageSize = pageSize
        )
    }
    
    override suspend fun delete(id: ProductId, tenantId: TenantId): Boolean = dbQuery {
        val deletedCount = ProductTable.deleteWhere { 
            (ProductTable.id eq id.value) and 
            (ProductTable.tenantId eq tenantId.value)
        }
        deletedCount > 0
    }
    
    override suspend fun searchByName(name: String, tenantId: TenantId): List<Product> = dbQuery {
        ProductTable
            .select { 
                (ProductTable.tenantId eq tenantId.value) and
                (ProductTable.name like "%$name%")
            }
            .map { it.toProduct() }
    }
    
    /**
     * データベースクエリのラッパー
     * 
     * コルーチン対応のトランザクション処理を提供します。
     */
    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction { block() }
}

/**
 * ResultRowからProductドメインモデルへの変換
 */
private fun ResultRow.toProduct() = Product(
    id = ProductId.from(this[ProductTable.id]),
    tenantId = TenantId(this[ProductTable.tenantId]),
    name = this[ProductTable.name],
    description = this[ProductTable.description],
    price = Price(this[ProductTable.price]),
    stockQuantity = this[ProductTable.stockQuantity],
    categoryId = this[ProductTable.categoryId],
    sku = this[ProductTable.sku],
    status = ProductStatus.fromProtoStatus(this[ProductTable.status]),
    createdAt = this[ProductTable.createdAt],
    updatedAt = this[ProductTable.updatedAt]
)
