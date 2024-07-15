import { useQuery } from "react-query";
import codeService from "@common/services/code/code.service";
import productService from "@domains/product/services/product.service";
import { IGetCommonCode } from "@common/services/code/code.service.interface";
import { IGetProducts } from "@domains/product/services/product.service.interface";

export const useGetTypeCodes = (where: IGetCommonCode.IInput) => {
    return useQuery(["get type code by ", where], () =>
        codeService.getCommonCode(where)
    );
};

export const useGetProducts = (where: IGetProducts.IInput) => {
    return useQuery(["get products by type for license estimate", where], () =>
        productService.getProducts(where)
    );
};
