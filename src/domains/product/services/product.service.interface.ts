import {
    CreateProductMutation,
    DeleteProductByIdMutation,
} from "./graphql/mutation";
import { UpdateProductMutation } from "./graphql/mutation/updateProductById.mutation";
import {
    GetAllProductsQuery,
    GetProductOneByIdQuery,
    GetProductsQuery,
} from "./graphql";

// [ 제품 생성 ]
export namespace ICreateProduct {
    export interface IInput extends CreateProductMutation.IVariable {}
    export interface IOutput extends CreateProductMutation.IResponse {}
}

// [ 전체 제품 조회 ]
export namespace IGetallProducts {
    export interface IInput extends GetAllProductsQuery.IVariable {}
    // export interface IOutput extends GetAllProductsQuery.IResponse {}
    export interface IOutput
        extends Array<
            | {
                  id: number;
                  name: string;
                  //   edition: string;
                  price: string;
                  type: {
                      category: string;
                      code: number;
                      value: string;
                      is_used: boolean;
                  };
                  purpose: {
                      category: string;
                      code: number;
                      value: string;
                      is_used: boolean;
                  };
                  class: {
                      category: string;
                      code: number;
                      value: string;
                      is_used: boolean;
                  };
                  unit: {
                      category: string;
                      code: number;
                      value: string;
                      is_used: boolean;
                  };
                  note: string;
                  updated_at: Date;
                  deleted_at: Date;
              }
            | undefined
        > {}
}
export namespace IGetProducts {
    export interface IInput extends GetProductsQuery.IVariable {}
    export interface IOutput extends GetProductsQuery.IResponse {}
}

// [ 제품 조회: id ]
export namespace IGetProductOneById {
    export interface IInput extends GetProductOneByIdQuery.IVariable {}
    export interface IOutput extends GetProductOneByIdQuery.IResponse {}
}

// [ 제품 삭제: id ( soft delete ) ]
export namespace IDeleteProductById {
    export interface IInput extends DeleteProductByIdMutation.IVariable {}
    export interface IOutput extends DeleteProductByIdMutation.IResponse {}
}

// [ 제품 수정: id ]
export namespace IUpdateProductById {
    export interface IInput extends UpdateProductMutation.IVariable {}
    export interface IOutput extends UpdateProductMutation.IResponse {}
}

export interface IProductService {
    // [ 제품 생성 ]
    createProduct(args: ICreateProduct.IInput): Promise<ICreateProduct.IOutput>;

    // [ 전체 제품 조회 ]
    getAllProducts(
        args: IGetallProducts.IInput
    ): Promise<IGetallProducts.IOutput>;

    getProducts(args: IGetProducts.IInput): Promise<IGetProducts.IOutput>;

    // [ 제품 조회: id ]
    getProductOneById(
        args: IGetProductOneById.IInput
    ): Promise<IGetProductOneById.IOutput>;

    // [ 제품 삭제: id ( soft delete ) ]
    deletedProductById(
        args: IDeleteProductById.IInput
    ): Promise<IDeleteProductById.IOutput>;

    // [ 제품 수정: id ]
    updateProductById(
        args: IUpdateProductById.IInput
    ): Promise<IUpdateProductById.IOutput>;
}
