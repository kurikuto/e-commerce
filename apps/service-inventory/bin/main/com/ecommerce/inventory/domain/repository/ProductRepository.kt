/**
 * Domain Layer - Product Repository Interface
 * 
 * リポジトリの抽象定義です。
 * Clean Architectureの依存性逆転の原則（DIP）により、
 * ドメイン層はインフラ層の実装に依存しません。
 */

package com.ecommerce.inventory.domain.repository

import com.ecommerce.inventory.domain.model.Product
import com.ecommerce.inventory.domain.model.ProductId
import com.ecommerce.inventory.domain.model.TenantId

/**
 * 商品リポジトリインターフェース
 * 
 * 永続化の詳細を隠蔽し、ドメインモデルの操作に集中します。
 * 実装はインフラストラクチャ層で行います。
 */
interface ProductRepository {
    /**
     * 商品を保存
     * 
     * 新規作成または更新を行います。
     * 
     * @param product 保存する商品
     * @return 保存された商品
     */
    suspend fun save(product: Product): Product
    
    /**
     * 商品IDで検索
     * 
     * @param id 商品ID
     * @param tenantId テナントID（マルチテナント対応）
     * @return 商品（存在しない場合はnull）
     */
    suspend fun findById(id: ProductId, tenantId: TenantId): Product?
    
    /**
     * SKUで検索
     * 
     * @param sku SKU
     * @param tenantId テナントID
     * @return 商品（存在しない場合はnull）
     */
    suspend fun findBySku(sku: String, tenantId: TenantId): Product?
    
    /**
     * 商品一覧を取得
     * 
     * @param tenantId テナントID
     * @param page ページ番号（1始まり）
     * @param pageSize 1ページあたりの件数
     * @return 商品リストとページネーション情報
     */
    suspend fun findAll(
        tenantId: TenantId,
        page: Int = 1,
        pageSize: Int = 20
    ): PaginatedResult<Product>
    
    /**
     * 商品を削除
     * 
     * @param id 商品ID
     * @param tenantId テナントID
     * @return 削除成功した場合true
     */
    suspend fun delete(id: ProductId, tenantId: TenantId): Boolean
    
    /**
     * 商品名で検索
     * 
     * @param name 商品名（部分一致）
     * @param tenantId テナントID
     * @return 商品リスト
     */
    suspend fun searchByName(name: String, tenantId: TenantId): List<Product>
}

/**
 * ページネーション結果
 * 
 * @param T アイテムの型
 */
data class PaginatedResult<T>(
    val items: List<T>,
    val totalCount: Int,
    val currentPage: Int,
    val pageSize: Int
) {
    val totalPages: Int
        get() = if (totalCount == 0) 0 else (totalCount + pageSize - 1) / pageSize
}
