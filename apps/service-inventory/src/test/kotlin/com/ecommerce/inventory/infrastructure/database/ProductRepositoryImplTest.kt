/**
 * Infrastructure Layer - Product Repository Tests
 *
 * データベースアクセス層のテストです。
 * H2インメモリデータベースを使用してテストします。
 */

package com.ecommerce.inventory.infrastructure.database

import com.ecommerce.inventory.domain.model.*
import com.ecommerce.inventory.domain.repository.ProductRepository
import kotlinx.coroutines.test.runTest
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ProductRepositoryImplTest {

    private lateinit var database: Database
    private lateinit var repository: ProductRepository

    @BeforeEach
    fun setup() {
        // H2インメモリデータベースを設定
        database = Database.connect(
            url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )

        // テーブル作成
        transaction(database) {
            SchemaUtils.create(ProductTable)
        }

        repository = ProductRepositoryImpl()
    }

    @AfterEach
    fun teardown() {
        transaction(database) {
            SchemaUtils.drop(ProductTable)
        }
    }

    private fun createTestProduct(
        id: String = "550e8400-e29b-41d4-a716-446655440000",
        tenantId: String = "test-tenant",
        sku: String = "TEST-001"
    ): Product {
        return Product(
            id = ProductId.from(id),
            tenantId = TenantId(tenantId),
            name = "テスト商品",
            description = "テスト用の商品です",
            price = Price(1000),
            stockQuantity = 100,
            categoryId = "cat-001",
            sku = sku,
            status = ProductStatus.ACTIVE,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
    }

    @Test
    fun `save - 新しい商品を正常に保存できる`() = runTest {
        val product = createTestProduct()

        val saved = repository.save(product)

        assertNotNull(saved)
        assertEquals(product.id, saved.id)
        assertEquals(product.name, saved.name)
        assertEquals(product.sku, saved.sku)
    }

    @Test
    fun `save - 既存の商品を更新できる`() = runTest {
        val product = createTestProduct()
        repository.save(product)

        val updated = product.copy(
            name = "更新された商品名",
            stockQuantity = 200
        )
        val saved = repository.save(updated)

        assertEquals("更新された商品名", saved.name)
        assertEquals(200, saved.stockQuantity)
    }

    @Test
    fun `findById - IDとテナントIDで商品を取得できる`() = runTest {
        val product = createTestProduct()
        repository.save(product)

        val found = repository.findById(
            ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
            TenantId("test-tenant")
        )

        assertNotNull(found)
        assertEquals(product.id, found.id)
        assertEquals(product.name, found.name)
    }

    @Test
    fun `findById - 存在しない商品の場合はnullを返す`() = runTest {
        val found = repository.findById(
            ProductId.from("non-existent-id"),
            TenantId("test-tenant")
        )

        assertNull(found)
    }

    @Test
    fun `findById - 異なるテナントの商品は取得できない`() = runTest {
        val product = createTestProduct(tenantId = "tenant-a")
        repository.save(product)

        val found = repository.findById(
            ProductId.from("550e8400-e29b-41d4-a716-446655440000"),
            TenantId("tenant-b")
        )

        assertNull(found)
    }

    @Test
    fun `findBySku - SKUとテナントIDで商品を取得できる`() = runTest {
        val product = createTestProduct(sku = "UNIQUE-SKU-001")
        repository.save(product)

        val found = repository.findBySku(
            sku = "UNIQUE-SKU-001",
            tenantId = TenantId("test-tenant")
        )

        assertNotNull(found)
        assertEquals("UNIQUE-SKU-001", found.sku)
    }

    @Test
    fun `findBySku - 存在しないSKUの場合はnullを返す`() = runTest {
        val found = repository.findBySku(
            sku = "NON-EXISTENT-SKU",
            tenantId = TenantId("test-tenant")
        )

        assertNull(found)
    }

    @Test
    fun `findAll - テナントの全商品を取得できる`() = runTest {
        // 3つの商品を保存
        repository.save(createTestProduct(
            id = "550e8400-e29b-41d4-a716-446655440001",
            sku = "TEST-001"
        ))
        repository.save(createTestProduct(
            id = "550e8400-e29b-41d4-a716-446655440002",
            sku = "TEST-002"
        ))
        repository.save(createTestProduct(
            id = "550e8400-e29b-41d4-a716-446655440003",
            sku = "TEST-003"
        ))

        val result = repository.findAll(
            tenantId = TenantId("test-tenant"),
            page = 1,
            pageSize = 20
        )

        assertEquals(3, result.items.size)
        assertEquals(3, result.totalCount)
        assertEquals(1, result.currentPage)
    }

    @Test
    fun `findAll - ページネーションが正常に動作する`() = runTest {
        // 5つの商品を保存
        for (i in 1..5) {
            repository.save(createTestProduct(
                id = "550e8400-e29b-41d4-a716-44665544000$i",
                sku = "TEST-00$i"
            ))
        }

        // 1ページ目（2件）
        val page1 = repository.findAll(
            tenantId = TenantId("test-tenant"),
            page = 1,
            pageSize = 2
        )
        assertEquals(2, page1.items.size)
        assertEquals(5, page1.totalCount)

        // 2ページ目（2件）
        val page2 = repository.findAll(
            tenantId = TenantId("test-tenant"),
            page = 2,
            pageSize = 2
        )
        assertEquals(2, page2.items.size)
        assertEquals(5, page2.totalCount)

        // 3ページ目（1件）
        val page3 = repository.findAll(
            tenantId = TenantId("test-tenant"),
            page = 3,
            pageSize = 2
        )
        assertEquals(1, page3.items.size)
        assertEquals(5, page3.totalCount)
    }

    @Test
    fun `findAll - 異なるテナントの商品は含まれない`() = runTest {
        repository.save(createTestProduct(
            id = "550e8400-e29b-41d4-a716-446655440001",
            tenantId = "tenant-a",
            sku = "TEST-001"
        ))
        repository.save(createTestProduct(
            id = "550e8400-e29b-41d4-a716-446655440002",
            tenantId = "tenant-b",
            sku = "TEST-002"
        ))

        val result = repository.findAll(
            tenantId = TenantId("tenant-a"),
            page = 1,
            pageSize = 20
        )

        assertEquals(1, result.items.size)
        assertTrue(result.items.all { it.tenantId.value == "tenant-a" })
    }

    @Test
    fun `findAll - 商品が存在しない場合は空のリストを返す`() = runTest {
        val result = repository.findAll(
            tenantId = TenantId("empty-tenant"),
            page = 1,
            pageSize = 20
        )

        assertEquals(0, result.items.size)
        assertEquals(0, result.totalCount)
    }
}
