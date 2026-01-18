/**
 * Domain Layer - Product Entity Tests
 *
 * Productエンティティのビジネスロジックをテストします。
 */

package com.ecommerce.inventory.domain.model

import org.junit.Test
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

class ProductTest {

    private fun createTestProduct(
        stockQuantity: Int = 100,
        status: ProductStatus = ProductStatus.ACTIVE
    ): Product {
        return Product(
            id = ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
            tenantId = TenantId("test-tenant"),
            name = "テスト商品",
            description = "テスト用の商品です",
            price = Price(1000),
            stockQuantity = stockQuantity,
            categoryId = "cat-001",
            sku = "TEST-001",
            status = status,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
    }

    @Test
    fun `商品の作成時、名前が空の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            Product(
                id = ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
                tenantId = TenantId("test-tenant"),
                name = "",
                description = "説明",
                price = Price(1000),
                stockQuantity = 100,
                categoryId = null,
                sku = "TEST-001",
                status = ProductStatus.ACTIVE,
                createdAt = Instant.now(),
                updatedAt = Instant.now()
            )
        }
    }

    @Test
    fun `商品の作成時、SKUが空の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            Product(
                id = ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
                tenantId = TenantId("test-tenant"),
                name = "商品名",
                description = "説明",
                price = Price(1000),
                stockQuantity = 100,
                categoryId = null,
                sku = "",
                status = ProductStatus.ACTIVE,
                createdAt = Instant.now(),
                updatedAt = Instant.now()
            )
        }
    }

    @Test
    fun `商品の作成時、在庫数が負の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            Product(
                id = ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
                tenantId = TenantId("test-tenant"),
                name = "商品名",
                description = "説明",
                price = Price(1000),
                stockQuantity = -1,
                categoryId = null,
                sku = "TEST-001",
                status = ProductStatus.ACTIVE,
                createdAt = Instant.now(),
                updatedAt = Instant.now()
            )
        }
    }

    @Test
    fun `allocateStock - 在庫を正常に引き当てできる`() {
        val product = createTestProduct(stockQuantity = 100)

        val updated = product.allocateStock(10)

        assertEquals(90, updated.stockQuantity)
        assertTrue(updated.updatedAt.isAfter(product.updatedAt))
    }

    @Test
    fun `allocateStock - 在庫不足の場合は例外が発生する`() {
        val product = createTestProduct(stockQuantity = 5)

        assertFailsWith<IllegalArgumentException> {
            product.allocateStock(10)
        }
    }

    @Test
    fun `allocateStock - 引き当て数量が0以下の場合は例外が発生する`() {
        val product = createTestProduct()

        assertFailsWith<IllegalArgumentException> {
            product.allocateStock(0)
        }

        assertFailsWith<IllegalArgumentException> {
            product.allocateStock(-1)
        }
    }

    @Test
    fun `replenishStock - 在庫を正常に補充できる`() {
        val product = createTestProduct(stockQuantity = 50)

        val updated = product.replenishStock(30)

        assertEquals(80, updated.stockQuantity)
        assertTrue(updated.updatedAt.isAfter(product.updatedAt))
    }

    @Test
    fun `replenishStock - 補充数量が0以下の場合は例外が発生する`() {
        val product = createTestProduct()

        assertFailsWith<IllegalArgumentException> {
            product.replenishStock(0)
        }

        assertFailsWith<IllegalArgumentException> {
            product.replenishStock(-1)
        }
    }

    @Test
    fun `canAllocate - 在庫が十分な場合はtrueを返す`() {
        val product = createTestProduct(stockQuantity = 100)

        assertTrue(product.canAllocate(50))
        assertTrue(product.canAllocate(100))
    }

    @Test
    fun `canAllocate - 在庫が不足している場合はfalseを返す`() {
        val product = createTestProduct(stockQuantity = 100)

        assertFalse(product.canAllocate(101))
        assertFalse(product.canAllocate(200))
    }

    @Test
    fun `canAllocate - ステータスがDRAFTの場合はfalseを返す`() {
        val product = createTestProduct(
            stockQuantity = 100,
            status = ProductStatus.DRAFT
        )

        assertFalse(product.canAllocate(10))
    }

    @Test
    fun `canAllocate - ステータスがINACTIVEの場合はfalseを返す`() {
        val product = createTestProduct(
            stockQuantity = 100,
            status = ProductStatus.INACTIVE
        )

        assertFalse(product.canAllocate(10))
    }

    @Test
    fun `canAllocate - ステータスがARCHIVEDの場合はfalseを返す`() {
        val product = createTestProduct(
            stockQuantity = 100,
            status = ProductStatus.ARCHIVED
        )

        assertFalse(product.canAllocate(10))
    }

    @Test
    fun `isAvailable - アクティブで在庫がある場合はtrueを返す`() {
        val product = createTestProduct(
            stockQuantity = 10,
            status = ProductStatus.ACTIVE
        )

        assertTrue(product.isAvailable())
    }

    @Test
    fun `isAvailable - 在庫が0の場合はfalseを返す`() {
        val product = createTestProduct(
            stockQuantity = 0,
            status = ProductStatus.ACTIVE
        )

        assertFalse(product.isAvailable())
    }

    @Test
    fun `isAvailable - ステータスがDRAFTの場合はfalseを返す`() {
        val product = createTestProduct(
            stockQuantity = 10,
            status = ProductStatus.DRAFT
        )

        assertFalse(product.isAvailable())
    }
}

class ProductIdTest {

    @Test
    fun `from - 正しいUUID文字列からProductIdを生成できる`() {
        val uuid = "550e8400-e29b-41d4-a716-446655440000"
        val productId = ProductId.from(uuid)

        assertEquals(uuid, productId.value)
    }

    @Test
    fun `from - 空文字列の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            ProductId.from("")
        }
    }

    @Test
    fun `generate - 新しいProductIdを生成できる`() {
        val productId1 = ProductId.generate()
        val productId2 = ProductId.generate()

        assertTrue(productId1.value.isNotBlank())
        assertTrue(productId2.value.isNotBlank())
        assertTrue(productId1 != productId2)
    }
}

class TenantIdTest {

    @Test
    fun `TenantIdを正常に作成できる`() {
        val tenantId = TenantId("test-tenant")
        assertEquals("test-tenant", tenantId.value)
    }

    @Test
    fun `空文字列の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            TenantId("")
        }
    }

    @Test
    fun `不正な文字が含まれる場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            TenantId("tenant@invalid")
        }
    }
}

class PriceTest {

    @Test
    fun `Priceを正常に作成できる`() {
        val price = Price(1000)
        assertEquals(1000, price.amount)
    }

    @Test
    fun `負の金額の場合は例外が発生する`() {
        assertFailsWith<IllegalArgumentException> {
            Price(-1)
        }
    }

    @Test
    fun `0円の場合は正常に作成できる`() {
        val price = Price(0)
        assertEquals(0, price.amount)
    }
}
