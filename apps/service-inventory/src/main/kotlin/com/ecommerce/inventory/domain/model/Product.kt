/**
 * Domain Layer - Product Entity
 *
 * DDDにおけるエンティティです。
 * ビジネスロジックとドメイン知識をカプセル化します。
 *
 * Clean Architectureの原則:
 * - インフラストラクチャに依存しない
 * - ビジネスルールを表現する
 * - 不変性を重視する
 */

package com.ecommerce.inventory.domain.model

import java.time.Instant
import java.util.UUID

/**
 * 商品エンティティ
 *
 * E-Commerceの中心的なドメインオブジェクトです。
 * 商品の状態とビジネスルールを管理します。
 */
data class Product(
    val id: ProductId,
    val tenantId: TenantId,
    val name: String,
    val description: String,
    val price: Price,
    val stockQuantity: Int,
    val categoryId: String?,
    val sku: String,
    val status: ProductStatus,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    init {
        require(name.isNotBlank()) { "商品名は必須です" }
        require(sku.isNotBlank()) { "SKUは必須です" }
        require(stockQuantity >= 0) { "在庫数は0以上である必要があります" }
    }

    /**
     * 在庫を引き当てる
     *
     * @param quantity 引き当て数量
     * @param clock テスト可能にするための時刻提供オブジェクト
     * @return 在庫引き当て後の新しいProductインスタンス
     * @throws IllegalArgumentException 在庫不足の場合
     */
    fun allocateStock(quantity: Int, clock: java.time.Clock = java.time.Clock.systemUTC()): Product {
        require(quantity > 0) { "引き当て数量は1以上である必要があります" }
        require(canAllocate(quantity)) { "在庫が不足しています。必要: $quantity, 利用可能: $stockQuantity" }

        return copy(
            stockQuantity = stockQuantity - quantity,
            updatedAt = Instant.now(clock)
        )
    }

    /**
     * 在庫を補充する
     *
     * @param quantity 補充数量
     * @param clock テスト可能にするための時刻提供オブジェクト
     * @return 在庫補充後の新しいProductインスタンス
     */
    fun replenishStock(quantity: Int, clock: java.time.Clock = java.time.Clock.systemUTC()): Product {
        require(quantity > 0) { "補充数量は1以上である必要があります" }

        return copy(
            stockQuantity = stockQuantity + quantity,
            updatedAt = Instant.now(clock)
        )
    }

    /**
     * 指定数量を引き当て可能かチェック
     */
    fun canAllocate(quantity: Int): Boolean {
        return status == ProductStatus.ACTIVE && stockQuantity >= quantity
    }

    /**
     * 商品が販売可能かチェック
     */
    fun isAvailable(): Boolean {
        return status == ProductStatus.ACTIVE && stockQuantity > 0
    }
}

/**
 * 商品ID（Value Object）
 *
 * UUIDを使用した一意な識別子です。
 */
@JvmInline
value class ProductId(val value: String) {
    init {
        require(value.isNotBlank()) { "商品IDは必須です" }
    }

    companion object {
        fun generate(): ProductId = ProductId(UUID.randomUUID().toString())
        fun from(value: String): ProductId = ProductId(value)
    }
}

/**
 * テナントID（Value Object）
 */
@JvmInline
value class TenantId(val value: String) {
    init {
        require(value.isNotBlank()) { "テナントIDは必須です" }
        require(value.matches(Regex("^[a-zA-Z0-9-]+$"))) { "テナントIDは英数字とハイフンのみ使用できます" }
    }
}

/**
 * 価格（Value Object）
 *
 * 金額を表現するドメインオブジェクトです。
 * ビジネスルールをカプセル化します。
 */
@JvmInline
value class Price(val amount: Long) {
    init {
        require(amount >= 0) { "価格は0以上である必要があります" }
        require(amount <= 10_000_000_000) { "価格が上限を超えています" }
    }

    /**
     * 税込価格を計算（消費税10%）
     */
    fun withTax(taxRate: Double = 0.10): Price {
        return Price((amount * (1 + taxRate)).toLong())
    }

    /**
     * 割引価格を計算
     */
    fun applyDiscount(discountRate: Double): Price {
        require(discountRate in 0.0..1.0) { "割引率は0.0〜1.0の範囲である必要があります" }
        return Price((amount * (1 - discountRate)).toLong())
    }
}

/**
 * 商品ステータス列挙型
 *
 * 商品のライフサイクルを表現します。
 */
enum class ProductStatus {
    /** 下書き（公開前） */
    DRAFT,

    /** 公開中（販売可能） */
    ACTIVE,

    /** 非公開（一時的に販売停止） */
    INACTIVE,

    /** アーカイブ済み（完全に販売終了） */
    ARCHIVED;

    companion object {
        fun fromProtoStatus(protoStatus: Int): ProductStatus {
            return when (protoStatus) {
                1 -> DRAFT
                2 -> ACTIVE
                3 -> INACTIVE
                4 -> ARCHIVED
                else -> DRAFT
            }
        }
    }

    fun toProtoStatus(): Int {
        return when (this) {
            DRAFT -> 1
            ACTIVE -> 2
            INACTIVE -> 3
            ARCHIVED -> 4
        }
    }
}
