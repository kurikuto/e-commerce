package com.ecommerce.catalog.proto

import com.ecommerce.catalog.proto.CatalogServiceGrpc.getServiceDescriptor
import io.grpc.CallOptions
import io.grpc.CallOptions.DEFAULT
import io.grpc.Channel
import io.grpc.Metadata
import io.grpc.MethodDescriptor
import io.grpc.ServerServiceDefinition
import io.grpc.ServerServiceDefinition.builder
import io.grpc.ServiceDescriptor
import io.grpc.Status.UNIMPLEMENTED
import io.grpc.StatusException
import io.grpc.kotlin.AbstractCoroutineServerImpl
import io.grpc.kotlin.AbstractCoroutineStub
import io.grpc.kotlin.ClientCalls.unaryRpc
import io.grpc.kotlin.ServerCalls.unaryServerMethodDefinition
import io.grpc.kotlin.StubFor
import kotlin.String
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.jvm.JvmOverloads
import kotlin.jvm.JvmStatic

/**
 * Holder for Kotlin coroutine-based client and server APIs for ecommerce.catalog.CatalogService.
 */
public object CatalogServiceGrpcKt {
  public const val SERVICE_NAME: String = CatalogServiceGrpc.SERVICE_NAME

  @JvmStatic
  public val serviceDescriptor: ServiceDescriptor
    get() = getServiceDescriptor()

  public val listProductsMethod: MethodDescriptor<ListProductsRequest, ListProductsResponse>
    @JvmStatic
    get() = CatalogServiceGrpc.getListProductsMethod()

  public val getProductMethod: MethodDescriptor<GetProductRequest, GetProductResponse>
    @JvmStatic
    get() = CatalogServiceGrpc.getGetProductMethod()

  public val createProductMethod: MethodDescriptor<CreateProductRequest, CreateProductResponse>
    @JvmStatic
    get() = CatalogServiceGrpc.getCreateProductMethod()

  public val updateProductMethod: MethodDescriptor<UpdateProductRequest, UpdateProductResponse>
    @JvmStatic
    get() = CatalogServiceGrpc.getUpdateProductMethod()

  /**
   * A stub for issuing RPCs to a(n) ecommerce.catalog.CatalogService service as suspending
   * coroutines.
   */
  @StubFor(CatalogServiceGrpc::class)
  public class CatalogServiceCoroutineStub @JvmOverloads constructor(
    channel: Channel,
    callOptions: CallOptions = DEFAULT,
  ) : AbstractCoroutineStub<CatalogServiceCoroutineStub>(channel, callOptions) {
    override fun build(channel: Channel, callOptions: CallOptions): CatalogServiceCoroutineStub =
        CatalogServiceCoroutineStub(channel, callOptions)

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun listProducts(request: ListProductsRequest, headers: Metadata = Metadata()):
        ListProductsResponse = unaryRpc(
      channel,
      CatalogServiceGrpc.getListProductsMethod(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun getProduct(request: GetProductRequest, headers: Metadata = Metadata()):
        GetProductResponse = unaryRpc(
      channel,
      CatalogServiceGrpc.getGetProductMethod(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun createProduct(request: CreateProductRequest, headers: Metadata = Metadata()):
        CreateProductResponse = unaryRpc(
      channel,
      CatalogServiceGrpc.getCreateProductMethod(),
      request,
      callOptions,
      headers
    )

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes
     * with [`Status.OK`][io.grpc.Status].  If the RPC completes with another status, a
     * corresponding
     * [StatusException] is thrown.  If this coroutine is cancelled, the RPC is also cancelled
     * with the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request.  Most users will not need this.
     *
     * @return The single response from the server.
     */
    public suspend fun updateProduct(request: UpdateProductRequest, headers: Metadata = Metadata()):
        UpdateProductResponse = unaryRpc(
      channel,
      CatalogServiceGrpc.getUpdateProductMethod(),
      request,
      callOptions,
      headers
    )
  }

  /**
   * Skeletal implementation of the ecommerce.catalog.CatalogService service based on Kotlin
   * coroutines.
   */
  public abstract class CatalogServiceCoroutineImplBase(
    coroutineContext: CoroutineContext = EmptyCoroutineContext,
  ) : AbstractCoroutineServerImpl(coroutineContext) {
    /**
     * Returns the response to an RPC for ecommerce.catalog.CatalogService.ListProducts.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun listProducts(request: ListProductsRequest): ListProductsResponse = throw
        StatusException(UNIMPLEMENTED.withDescription("Method ecommerce.catalog.CatalogService.ListProducts is unimplemented"))

    /**
     * Returns the response to an RPC for ecommerce.catalog.CatalogService.GetProduct.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun getProduct(request: GetProductRequest): GetProductResponse = throw
        StatusException(UNIMPLEMENTED.withDescription("Method ecommerce.catalog.CatalogService.GetProduct is unimplemented"))

    /**
     * Returns the response to an RPC for ecommerce.catalog.CatalogService.CreateProduct.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun createProduct(request: CreateProductRequest): CreateProductResponse =
        throw
        StatusException(UNIMPLEMENTED.withDescription("Method ecommerce.catalog.CatalogService.CreateProduct is unimplemented"))

    /**
     * Returns the response to an RPC for ecommerce.catalog.CatalogService.UpdateProduct.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [io.grpc.Status].  If this method fails with a [java.util.concurrent.CancellationException],
     * the RPC will fail
     * with status `Status.CANCELLED`.  If this method fails for any other reason, the RPC will
     * fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    public open suspend fun updateProduct(request: UpdateProductRequest): UpdateProductResponse =
        throw
        StatusException(UNIMPLEMENTED.withDescription("Method ecommerce.catalog.CatalogService.UpdateProduct is unimplemented"))

    final override fun bindService(): ServerServiceDefinition = builder(getServiceDescriptor())
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = CatalogServiceGrpc.getListProductsMethod(),
      implementation = ::listProducts
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = CatalogServiceGrpc.getGetProductMethod(),
      implementation = ::getProduct
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = CatalogServiceGrpc.getCreateProductMethod(),
      implementation = ::createProduct
    ))
      .addMethod(unaryServerMethodDefinition(
      context = this.context,
      descriptor = CatalogServiceGrpc.getUpdateProductMethod(),
      implementation = ::updateProduct
    )).build()
  }
}
