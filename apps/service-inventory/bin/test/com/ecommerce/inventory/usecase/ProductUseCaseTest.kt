/**
 * Use Case Layer - Product Use Cases Tests
 *
 * ビジネスロジックの動作をテストします。
 */

package com.ecommerce.inventory.usecase

import com.ecommerce.inventory.domain.model.*
import com.ecommerce.inventory.domain.repository.PaginatedResult
import com.ecommerce.inventory.domain.repository.ProductRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class GetProductUseCaseTest {

    private val productRepository = mockk<ProductRepository>()
    private val useCase = GetProductUseCase(productRepository)

    private fun createTestProduct(): Product {
        return Product(
            id = ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
            tenantId = TenantId("test-tenant"),
            name = "テスト商品",
            description = "テスト用の商品です",
            price = Price(1000),
            stockQuantity = 100,
            categoryId = "cat-001",
            sku = "TEST-001",
            status = ProductStatus.ACTIVE,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
    }

    @Test
    fun `execute - 商品が存在する場合は正常に取得できる`() = runTest {
        val product = createTestProduct()
        coEvery {
            productRepository.findById(any(), any())
        } returns product

        val result = useCase.execute(
            productId = "550e8400-e29b-41d4-a716-446655440000",
            tenantId = "test-tenant"
        )

        assertEquals(product, result)
        coVerify {
            productRepository.findById(
                ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
                TenantId("test-tenant")
            )
        }
    }

    @Test
    fun `execute - 商品が存在しない場合はnullを返す`() = runTest {
        coEvery {
            productRepository.findById(any(), any())
        } returns null

        val result = useCase.execute(
            productId = "non-existent-id",
            tenantId = "test-tenant"
        )

        assertNull(result)
    }
}

class ListProductsUseCaseTest {

    private val productRepository = mockk<ProductRepository>()
    private val useCase = ListProductsUseCase(productRepository)

    private fun createTestProduct(id: String, name: String): Product {
        return Product(
            id = ProductId.from(id),
            tenantId = TenantId("test-tenant"),
            name = name,
            description = "説明",
            price = Price(1000),
            stockQuantity = 100,
            categoryId = "cat-001",
            sku = "TEST-$id",
            status = ProductStatus.ACTIVE,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
    }

    @Test
    fun `execute - 商品一覧を正常に取得できる`() = runTest {
        val products = listOf(
            createTestProduct("550e8400-e29b-41d4-a716-446655440001", "商品1"),
            createTestProduct("550e8400-e29b-41d4-a716-446655440002", "商品2")
        )
        val paginatedResult = PaginatedResult(
            items = products,
            totalCount = 2,
            currentPage = 1,
            pageSize = 20
        )

        coEvery {
            productRepository.findAll(any(), any(), any())
        } returns paginatedResult

        val result = useCase.execute(
            tenantId = "test-tenant",
            page = 1,
            pageSize = 20
        )

        assertEquals(2, result.items.size)
        assertEquals(2, result.totalCount)
        assertEquals(1, result.currentPage)
    }

    @Test
    fun `execute - ページ番号が0以下の場合は例外が発生する`() = runTest {
        assertFailsWith<IllegalArgumentException> {
            useCase.execute(
                tenantId = "test-tenant",
                page = 0,
                pageSize = 20
            )
        }
    }

    @Test
    fun `execute - ページサイズが1未満の場合は例外が発生する`() = runTest {
        assertFailsWith<IllegalArgumentException> {
            useCase.execute(
                tenantId = "test-tenant",
                page = 1,
                pageSize = 0
            )
        }
    }

    @Test
    fun `execute - ページサイズが100を超える場合は例外が発生する`() = runTest {
        assertFailsWith<IllegalArgumentException> {
            useCase.execute(
                tenantId = "test-tenant",
                page = 1,
                pageSize = 101
            )
        }
    }

    @Test
    fun `execute - 空のリストを正常に取得できる`() = runTest {
        val paginatedResult = PaginatedResult<Product>(
            items = emptyList(),
            totalCount = 0,
            currentPage = 1,
            pageSize = 20
        )

        coEvery {
            productRepository.findAll(any(), any(), any())
        } returns paginatedResult

        val result = useCase.execute(
            tenantId = "test-tenant",
            page = 1,
            pageSize = 20
        )

        assertEquals(0, result.items.size)
        assertEquals(0, result.totalCount)
    }
}

class CreateProductUseCaseTest {

    private val productRepository = mockk<ProductRepository>()
    private val useCase = CreateProductUseCase(productRepository)

    @Test
    fun `execute - 新しい商品を正常に作成できる`() = runTest {
        val productId = ProductId.generate()
        val product = Product(
            id = productId,
            tenantId = TenantId("test-tenant"),
            name = "新商品",
            description = "新商品の説明",
            price = Price(2000),
            stockQuantity = 50,
            categoryId = "cat-001",
            sku = "NEW-001",
            status = ProductStatus.ACTIVE,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )

        coEvery { productRepository.findBySku(any(), any()) } returns null
        coEvery { productRepository.save(any()) } returns product

        val result = useCase.execute(
            CreateProductRequest(
                tenantId = "test-tenant",
                name = "新商品",
                description = "新商品の説明",
                price = 2000,
                stockQuantity = 50,
                categoryId = "cat-001",
                sku = "NEW-001"
            )
        )

        assertEquals("新商品", result.name)
        assertEquals(2000, result.price.amount)
        coVerify { productRepository.save(any()) }
    }

    @Test
    fun `execute - SKUが重複している場合は例外が発生する`() = runTest {
        val existingProduct = Product(
            id = ProductId.generate(),
            tenantId = TenantId("test-tenant"),
            name = "既存商品",
            description = "説明",
            price = Price(1000),
            stockQuantity = 100,
            categoryId = "cat-001",
            sku = "DUPLICATE-001",
            status = ProductStatus.ACTIVE,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )

        coEvery {
            productRepository.findBySku("DUPLICATE-001", TenantId("test-tenant"))
        } returns existingProduct

        assertFailsWith<IllegalArgumentException> {
            useCase.execute(
                CreateProductRequest(
                    tenantId = "test-tenant",
                    name = "新商品",
                    description = "説明",
                    price = 1000,
                    stockQuantity = 50,
                    categoryId = "cat-001",
                    sku = "DUPLICATE-001"
                )
            )
        }
    }
}
