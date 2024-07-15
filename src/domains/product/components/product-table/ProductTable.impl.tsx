import { IProductTable } from "./ProductTable.interface";
import VProductTable from "./ProductTable.view";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import productService from "../../services/product.service";
import PATH from "@constants/path";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { useForm } from "react-hook-form";
import { Permission, ProductType } from "@enums";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";

const ProductTable: React.FC<IProductTable.IProps> = props => {
    const router = useRouter();

    const { getValues, watch, control } = useForm<IProductTable.IFilter>({});

    const [loginUser, setLoginUser] = useRecoilState(loginState);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ D E L E T E  F I L T E R ] ---------------------------------
    const [showDeleted, setShowDeleted] = useState<boolean>(false);

    const handleShowDeleted = (newState: boolean) => {
        setShowDeleted(newState);
    };

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ]-------------------------------------------

    var [allProducts, setAllProducts] = useState<GridRowsProp>([]);

    // 전체 제품 조회
    const {} = useQuery(
        ["getAllProducts", watch("type"), showDeleted],
        () =>
            productService.getAllProducts({
                where: {
                    deleted_at: showDeleted ? {} : { _is_null: true },
                    type: {
                        value: {
                            _in:
                                getValues("type") === "all" ||
                                getValues("type") === "default"
                                    ? [
                                          ProductType.LICENSE,
                                          ProductType.SERVICE,
                                          ProductType.CUSTOMIZE,
                                      ]
                                    : [getValues("type")],
                        },
                    },
                },
            }),
        {
            onSuccess(data) {
                const products = data.map((product, idx) => {
                    return {
                        id: idx + 1,
                        pk: product?.id,
                        type: product?.type.value,
                        name: product?.name,
                        unit: product?.unit.value,
                        // edition: product?.edition,
                        updated_at: dayjs(product?.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: product?.deleted_at
                            ? dayjs(product?.deleted_at).format("YYYY/MM/DD")
                            : product?.deleted_at,
                    };
                });

                setAllProducts(products);
            },
        }
    );

    // TYPE OPTIONS
    const typeOptions: { label: string; value: string }[] = [
        { label: "전체", value: "all" },
        { label: ProductType.LICENSE, value: ProductType.LICENSE },
        { label: ProductType.SERVICE, value: ProductType.SERVICE },
        { label: ProductType.CUSTOMIZE, value: ProductType.CUSTOMIZE },
    ];

    const header: GridColDef[] = [
        { width: 60, headerName: "No.", field: "id" },
        { flex: 2, headerName: "구분", field: "type" },
        {
            flex: 3,
            headerName: "품목명",
            field: "name",
        },
        { flex: 1, headerName: "단위", field: "unit" },
        // { flex: 1.5, headerName: "에디션", field: "edition" },
        { width: 160, headerName: "최근 수정일", field: "updated_at" },
        {
            field: "tag",
            headerName: "삭제일",
            width: 120,
            renderCell({ id, row }) {
                return (
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {!!row.deleted_at && (
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: Colors.wildStrawberry,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {row.deleted_at}
                            </Typography>
                        )}
                    </Box>
                );
            },
        },
    ];

    const onClickRow = (id: number) => {
        router.push(`${PATH.PRODUCT.MAIN}/${id}`);
    };

    return (
        <VProductTable
            header={header
                .filter(item => {
                    if (
                        loginUser.permission === Permission.ADMIN &&
                        showDeleted
                    ) {
                        return true;
                    }
                    return item.field !== "tag";
                })
                .map(item => {
                    return {
                        ...item,
                        field: item.field,
                        headerName: item.headerName,
                        flex: item.flex,
                        sortable: true,
                        align: "center",
                        headerAlign: "center",
                    };
                })}
            typeOptions={typeOptions}
            control={control}
            onClickRow={onClickRow}
            productsData={allProducts}
            showDeleted={showDeleted}
            handleShowDeleted={handleShowDeleted}
            {...props}
        />
    );
};

export default ProductTable;
