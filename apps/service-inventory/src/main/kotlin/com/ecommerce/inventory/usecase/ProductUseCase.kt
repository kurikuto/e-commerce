/**
 * Use Case Layer - Get Product Use Case
 * 
 * アプリケーションのビジネスロジックを表現します。
 * Clean Architectureにおけるユースケース層です。
 * 
 * 責務:
 * - ビジネスフローの制御
 * - トランザクション境界の定義
 * - ドメインモデルの操作
 */

package com.ecommerce.inventory.usecase

import com.ecommerce.inventory.domain.model.Product
import com.ecommerce.inventory.domain.model.ProductId
import com.ecommerce.inventory.domain.model.TenantId
import com.ecommerce.inventory.domain.repository.ProductRepository
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

/**
 * 商品取得ユースケース
 * 
 * 商品の詳細情報を取得します。
 */
class GetProductUseCase(
    private val productRepository: ProductRepository
) {
    /**
     * 商品を取得
     * 
     * @param productId 商品ID
     * @param tenantId テナントID
     * @return 商品（存在しない場合はnull）
     */
    suspend fun execute(productId: String, tenantId: String): Product? {
        logger.info { "商品取得: productId=$productId, tenantId=$tenantId" }
        
        val product = productRepository.findById(
            ProductId.from(productId),
            TenantId(tenantId)
        )
        
        if (product == null) {
            logger.warn { "商品が見つかりません: productId=$productId, tenantId=$tenantId" }
        } else {
            logger.info { "商品を取得しました: ${product.name}" }
        }
        
        return product
    }
}

/**
 * 商品一覧取得ユースケース
 * 
 * ページネーションをサポートした商品一覧を取得します。
 */
class ListProductsUseCase(
    private val productRepository: ProductRepository
) {
    /**
     * 商品一覧を取得
     * 
     * @param tenantId テナントID
     * @param page ページ番号（1始まり）
     * @param pageSize 1ページあたりの件数
     * @return ページネーション付き商品リスト
     */
    suspend fun execute(
        tenantId: String,
        page: Int = 1,
        pageSize: Int = 20
    ): com.ecommerce.inventory.domain.repository.PaginatedResult<Product> {
        logger.info { "商品一覧取得: tenantId=$tenantId, page=$page, pageSize=$pageSize" }
        
        require(page >= 1) { "ページ番号は1以上である必要があります" }
        require(pageSize in 1..100) { "ページサイズは1〜100の範囲である必要があります" }
        
        val result = productRepository.findAll(
            TenantId(tenantId),
            page,
            pageSize
        )
        
        logger.info { "商品一覧を取得しました: 件数=${result.items.size}, 総数=${result.totalCount}" }
        
        return result
    }
}

/**
 * 商品作成ユースケース
 * 
 * 新しい商品を作成します。
 */
class CreateProductUseCase(
    private val productRepository: ProductRepository
) {
    /**
     * 商品を作成
     * 
     * @param request 商品作成リクエスト
     * @return 作成された商品
     */
    suspend fun execute(request: CreateProductRequest): Product {
        logger.info { "商品作成: name=${request.name}, tenantId=${request.tenantId}" }
        
        // ビジネスルールのバリデーション
        require(request.name.isNotBlank()) { "商品名は必須です" }
        require(request.price >= 0) { "価格は0以上である必要があります" }
        require(request.stockQuantity >= 0) { "在庫数は0以上である必要があります" }
        
        // SKUの重複チェック
        val existingProduct = productRepository.findBySku(request.sku, TenantId(request.tenantId))
        require(existingProduct == null) { "SKU '${request.sku}' は既に使用されています" }
        
        // ドメインモデルの構築
        val now = java.time.Instant.now()
        val product = Product(
            id = ProductId.generate(),
            tenantId = TenantId(request.tenantId),
            name = request.name,
            description = request.description,
            price = com.ecommerce.inventory.domain.model.Price(request.price),
            stockQuantity = request.stockQuantity,
            categoryId = request.categoryId,
            sku = request.sku,
            status = com.ecommerce.inventory.domain.model.ProductStatus.DRAFT,
            createdAt = now,
            updatedAt = now
        )
        
        // 永続化
        val savedProduct = productRepository.save(product)
        
        logger.info { "商品を作成しました: id=${savedProduct.id.value}, name=${savedProduct.name}" }
        
        return savedProduct
    }
}

/**
 * 商品作成リクエスト
 */
data class CreateProductRequest(
    val tenantId: String,
    val name: String,
    val description: String,
    val price: Long,
    val stockQuantity: Int,
    val categoryId: String?,
    val sku: String
)
