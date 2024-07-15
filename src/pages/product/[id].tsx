import PageTitle from "@common/components/page-title/PageTitle.impl";
import { Colors } from "@configs/colors";
import { css } from "@emotion/react";
import { IconButton, useMediaQuery } from "@mui/material";
import type { NextPage } from "next";
import ProductDetailTable from "@domains/product/components/product-detail-table/ProductDetailTable.impl";
import BasicTemplate from "@common/components/templates/basic-template";
import PATH from "@constants/path";
import { ScreenType } from "@enums";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import productService from "@domains/product/services/product.service";
import { IProductDetailTable } from "@domains/product/components/product-detail-table/ProductDetailTable.interface";
import { useState } from "react";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";

const ProductDetails: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const [productData, setProductData] =
        useState<IProductDetailTable.IProduct>();

    // 기존 제품 정보 조회 ( QUERY )
    const { refetch: fetchProduct } = useQuery(
        ["getProductOneByIdQuery"],
        () => productService.getProductOneById({ id: parseInt(id) }),
        {
            enabled: !!id,
            onSuccess(data) {
                setProductData({
                    type: data.product_by_pk.type.value,
                    purpose: data.product_by_pk.purpose.value,
                    class: data.product_by_pk.class.value,
                    name: data?.product_by_pk.name,
                    // edition: data.product_by_pk.edition,
                    note: data.product_by_pk.note,
                    unit: data.product_by_pk.unit?.value,
                    price: removeCurrencyOfMoney(data.product_by_pk.price),
                    created_at: data.product_by_pk.created_at,
                    updated_at: data.product_by_pk.updated_at,
                    deleted_at: data.product_by_pk.deleted_at,
                });
            },
        }
    );

    // 제품 삭제 ( MUTATION )
    const { mutate: deleteProductByIdMutation } = useMutation(
        ["deleteProductByIdMutation"],
        () =>
            productService.deletedProductById({
                id: parseInt(id),
            }),
        {
            onSuccess() {
                router.push(PATH.PRODUCT.MAIN);
            },
        }
    );

    const onClickDelete = () => {
        if (window.confirm("제품을 삭제하시겠습니까?")) {
            deleteProductByIdMutation();
        }
    };

    return (
        <BasicTemplate>
            <div css={rootStyle(isMedium)}>
                <PageTitle
                    title="제품 상세"
                    isVisible={true}
                    path={PATH.PRODUCT.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"제품 > 제품 > 전체 제품 > "}
                        <span css={{ color: Colors.oceanBlue }}>제품 상세</span>
                    </p>
                    {!productData?.deleted_at && (
                        <div className="btn-group">
                            <IconButton
                                color="wildStrawberry"
                                onClick={onClickDelete}
                            >
                                <MdOutlineDelete size={20} />
                            </IconButton>
                            <div className="space" />
                            <IconButton
                                color="oceanBlue"
                                onClick={() =>
                                    router.push(`${PATH.PRODUCT.EDIT}/${id}`)
                                }
                            >
                                <MdOutlineEdit size={20} />
                            </IconButton>
                        </div>
                    )}
                </div>
                <ProductDetailTable productData={productData} />
            </div>
        </BasicTemplate>
    );
};

const rootStyle = (isMedium: boolean) => css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }

    .menu-info {
        color: ${Colors.gray};
    }

    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }

    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 120px;
    }
    .btn-group {
        width: 80px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        .space {
            width: 16px;
        }
    }
`;

export default ProductDetails;
