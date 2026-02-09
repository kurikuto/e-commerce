/**
 * Presentation Layer - gRPC Service Implementation
 *
 * gRPCサービスの実装です。
 * Protocol Buffersで定義されたサービスを実装し、
 * ユースケースを呼び出します。
 */

package com.ecommerce.inventory.presentation.grpc

import com.ecommerce.catalog.proto.*
import com.ecommerce.inventory.domain.model.Product
import com.ecommerce.inventory.infrastructure.database.ProductRepositoryImpl
import com.ecommerce.inventory.usecase.*
import io.grpc.Status
import io.grpc.StatusException
import mu.KotlinLogging

// gRPC型とユースケース型の名前衝突を避けるため型エイリアスを使用
import com.ecommerce.inventory.usecase.CreateProductRequest as UseCaseCreateProductRequest

private val logger = KotlinLogging.logger {}

/**
 * カタログサービスのgRPC実装
 *
 * プレゼンテーション層として、外部からのリクエストを受け取り、
 * ユースケースに委譲します。
 */
class CatalogGrpcService : CatalogServiceGrpcKt.CatalogServiceCoroutineImplBase() {

    // 依存性の注入（本番環境ではDIコンテナを使用）
    private val productRepository = ProductRepositoryImpl()
    private val getProductUseCase = GetProductUseCase(productRepository)
    private val listProductsUseCase = ListProductsUseCase(productRepository)
    private val createProductUseCase = CreateProductUseCase(productRepository)

    /**
     * 商品一覧を取得
     *
     * gRPCリクエストをドメインロジックに変換し、
     * 結果をgRPCレスポンスに変換して返します。
     */
    override suspend fun listProducts(request: ListProductsRequest): ListProductsResponse {
        return try {
            logger.info { "gRPC: ListProducts - tenantId=${request.tenantId}" }

            // バリデーション
            if (request.tenantId.isBlank()) {
                throw StatusException(Status.INVALID_ARGUMENT.withDescription("テナントIDは必須です"))
            }

            // ユースケース実行
            val result = listProductsUseCase.execute(
                tenantId = request.tenantId,
                page = if (request.page > 0) request.page else 1,
                pageSize = if (request.pageSize > 0) request.pageSize else 20
            )

            // gRPCレスポンスに変換
            ListProductsResponse.newBuilder()
                .addAllProducts(result.items.map { it.toProto() })
                .setTotalCount(result.totalCount)
                .setCurrentPage(result.currentPage)
                .setTotalPages(result.totalPages)
                .build()
                .also {
                    logger.info { "gRPC: ListProducts成功 - 件数=${result.items.size}" }
                }

        } catch (e: StatusException) {
            throw e
        } catch (e: Exception) {
            logger.error(e) { "gRPC: ListProducts失敗" }
            throw StatusException(Status.INTERNAL.withDescription(e.message).withCause(e))
        }
    }

    /**
     * 商品詳細を取得
     */
    override suspend fun getProduct(request: GetProductRequest): GetProductResponse {
        return try {
            logger.info { "gRPC: GetProduct - id=${request.id}, tenantId=${request.tenantId}" }

            // バリデーション
            if (request.id.isBlank() || request.tenantId.isBlank()) {
                throw StatusException(Status.INVALID_ARGUMENT.withDescription("IDとテナントIDは必須です"))
            }

            // ユースケース実行
            val product = getProductUseCase.execute(
                productId = request.id,
                tenantId = request.tenantId
            ) ?: throw StatusException(Status.NOT_FOUND.withDescription("商品が見つかりません"))

            // gRPCレスポンスに変換
            GetProductResponse.newBuilder()
                .setProduct(product.toProto())
                .build()
                .also {
                    logger.info { "gRPC: GetProduct成功 - name=${product.name}" }
                }

        } catch (e: StatusException) {
            throw e
        } catch (e: Exception) {
            logger.error(e) { "gRPC: GetProduct失敗" }
            throw StatusException(Status.INTERNAL.withDescription(e.message).withCause(e))
        }
    }

    /**
     * 商品を作成
     */
    override suspend fun createProduct(request: CreateProductRequest): CreateProductResponse {
        return try {
            logger.info { "gRPC: CreateProduct - name=${request.name}, tenantId=${request.tenantId}" }

            // ユースケース実行
            val product = createProductUseCase.execute(
                UseCaseCreateProductRequest(
                    tenantId = request.tenantId,
                    name = request.name,
                    description = request.description,
                    price = request.price,
                    stockQuantity = request.stockQuantity,
                    categoryId = request.categoryId.takeIf { it.isNotBlank() },
                    sku = request.sku
                )
            )

            // gRPCレスポンスに変換
            CreateProductResponse.newBuilder()
                .setProduct(product.toProto())
                .build()
                .also {
                    logger.info { "gRPC: CreateProduct成功 - id=${product.id.value}" }
                }

        } catch (e: IllegalArgumentException) {
            logger.warn(e) { "gRPC: CreateProduct バリデーションエラー" }
            throw StatusException(Status.INVALID_ARGUMENT.withDescription(e.message).withCause(e))
        } catch (e: Exception) {
            logger.error(e) { "gRPC: CreateProduct失敗" }
            throw StatusException(Status.INTERNAL.withDescription(e.message).withCause(e))
        }
    }

    /**
     * 商品を更新（簡易実装）
     */
    override suspend fun updateProduct(request: UpdateProductRequest): UpdateProductResponse {
        return try {
            logger.info { "gRPC: UpdateProduct - id=${request.id}" }

            // TODO: UpdateProductUseCaseの実装
            throw StatusException(Status.UNIMPLEMENTED.withDescription("UpdateProductは未実装です"))

        } catch (e: StatusException) {
            throw e
        } catch (e: Exception) {
            logger.error(e) { "gRPC: UpdateProduct失敗" }
            throw StatusException(Status.INTERNAL.withDescription(e.message).withCause(e))
        }
    }
}

/**
 * ドメインモデルからProtocol Buffersメッセージへの変換
 */
private fun Product.toProto(): com.ecommerce.catalog.proto.Product {
    return com.ecommerce.catalog.proto.Product.newBuilder()
        .setId(id.value)
        .setTenantId(tenantId.value)
        .setName(name)
        .setDescription(description)
        .setPrice(price.amount)
        .setStockQuantity(stockQuantity)
        .setCategoryId(categoryId ?: "")
        .setSku(sku)
        .setStatus(ProductStatus.forNumber(status.toProtoStatus()))
        .setCreatedAt(createdAt.toEpochMilli())
        .setUpdatedAt(updatedAt.toEpochMilli())
        .build()
}
