import { GraphQLClient } from "graphql-request";

import {
    ICreateProduct,
    IDeleteProductById,
    IGetProductOneById,
    IGetallProducts,
    IGetProducts,
    IProductService,
    IUpdateProductById,
} from "./product.service.interface";
import {
    GetAllProductsQuery,
    GetProductOneByIdQuery,
    GetProductsQuery,
} from "./graphql/query";
import { CreateProductMutation } from "./graphql/mutation/registerProduct.mutation";
import { DeleteProductByIdMutation } from "./graphql/mutation";
import { UpdateProductMutation } from "./graphql/mutation/updateProductById.mutation";

class ProductService implements IProductService {
    private static instance: ProductService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): ProductService {
        return this.instance || (this.instance = new this());
    }

    // ------------------------------------ [ 제품 등록 ] -------------------------------------------
    public async createProduct(
        args: ICreateProduct.IInput
    ): Promise<ICreateProduct.IOutput> {
        try {
            const { insert_product_one } = await this.client.request<
                CreateProductMutation.IResponse,
                CreateProductMutation.IVariable
            >(CreateProductMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { insert_product_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // --------------------------------- [ 전체 제품 조회 ] -----------------------------------------
    public async getAllProducts(
        where: IGetallProducts.IInput
    ): Promise<IGetallProducts.IOutput> {
        try {
            const { product } = await this.client.request<
                GetAllProductsQuery.IResponse,
                GetAllProductsQuery.IVariable
            >(GetAllProductsQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return product;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getProducts(
        where: IGetProducts.IInput
    ): Promise<IGetProducts.IOutput> {
        try {
            const { product } = await this.client.request<
                GetProductsQuery.IResponse,
                GetProductsQuery.IVariable
            >(GetProductsQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { product };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ 제품 조회: id ] -----------------------------------------
    public async getProductOneById(
        args: IGetProductOneById.IInput
    ): Promise<IGetProductOneById.IOutput> {
        try {
            const { product_by_pk } = await this.client.request<
                GetProductOneByIdQuery.IResponse,
                GetProductOneByIdQuery.IVariable
            >(GetProductOneByIdQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { product_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------- [ 제품 삭제: id ( soft delete ) ] ----------------------------------
    public async deletedProductById(
        args: IDeleteProductById.IInput
    ): Promise<IDeleteProductById.IOutput> {
        try {
            const { update_product_by_pk } = await this.client.request<
                DeleteProductByIdMutation.IResponse,
                DeleteProductByIdMutation.IVariable
            >(DeleteProductByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_product_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ 제품 수정: id ] -----------------------------------------
    public async updateProductById(
        args: IUpdateProductById.IInput
    ): Promise<IUpdateProductById.IOutput> {
        try {
            const { update_product_by_pk } = await this.client.request<
                UpdateProductMutation.IResponse,
                UpdateProductMutation.IVariable
            >(UpdateProductMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_product_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default ProductService.Instance;
