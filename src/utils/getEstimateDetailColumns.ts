import { EditTextareaCell } from "@common/components";
import codeService from "@common/services/code/code.service";
import { IGetCommonCode } from "@common/services/code/code.service.interface";
import productService from "@domains/product/services/product.service";
import { IGetProducts } from "@domains/product/services/product.service.interface";
import { EstimateDetailsOptionTypeEnum } from "@enums";
import { GridColDef, GridPreProcessEditCellProps } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import React from "react";
import { MutableRefObject } from "react";
import { UseFormGetValues } from "react-hook-form";
import { useQuery, UseQueryResult } from "react-query";
import { IOrder_By } from "src/codegen/graphql";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";
import moneyToNumber from "./moneyToNumber";

const getEstimateDetailColumns = (props: {
    estimateType: CommonType;
    apiRef: MutableRefObject<GridApiCommunity>;
    getValues: UseFormGetValues<any>;
    purposeOptions: UseQueryResult<IGetCommonCode.IOutput, unknown>;
    classOptions: UseQueryResult<IGetCommonCode.IOutput, unknown>;
    products: UseQueryResult<IGetProducts.IOutput, unknown>;
}): GridColDef[] => {
    const {
        estimateType,
        purposeOptions,
        classOptions,
        products,
        apiRef,
        getValues,
    } = props;

    let columns: GridColDef[] = [];

    switch (estimateType) {
        case CommonType.LICENSE:
        case CommonType.TECHSUPPPORT:
        case CommonType.CUSTOMIZE:
            columns = [
                {
                    field: EstimateDetailsOptionTypeEnum.TYPE,
                    headerName: "구분",
                    width: 180,
                    type: "singleSelect",
                    valueOptions: [
                        "선택해주세요",
                        `JOB-PaSS ${CommonType.LICENSE}`,
                        `JOB-PaSS ${CommonType.TECHSUPPPORT}`,
                        `JOB-PaSS ${CommonType.CUSTOMIZE}`,
                    ],
                },
                {
                    field: EstimateDetailsOptionTypeEnum.PURPOSE,
                    headerName: "용도",
                    width: 160,
                    type: "singleSelect",
                    valueOptions: [
                        "선택해주세요",
                        ...(purposeOptions.data?.common_code?.map(
                            item => item.value
                        ) ?? []),
                    ],
                    valueSetter(params) {
                        const { value, row } = params;

                        const productType = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.TYPE
                        );
                        const productClass = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.CLASS
                        );
                        const product = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.PRODUCT
                        );
                        const productOptions =
                            products.data?.product
                                ?.filter(
                                    ele =>
                                        ele?.purpose.value === value &&
                                        ele?.class.value === productClass &&
                                        `JOB-PaSS ${ele.type.value}` ===
                                            productType
                                )
                                .map(product => product?.name) || [];

                        return {
                            ...row,
                            [EstimateDetailsOptionTypeEnum.PURPOSE]: value,
                            [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                                productOptions.includes(product)
                                    ? product.type.value
                                    : "",
                            [EstimateDetailsOptionTypeEnum.PRODUCT]:
                                productOptions.includes(product)
                                    ? product
                                    : "선택해주세요",
                        };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.CLASS,
                    headerName: "Class",
                    width: 160,
                    type: "singleSelect",
                    valueOptions: [
                        "선택해주세요",
                        ...(classOptions.data?.common_code?.map(
                            item => item.value
                        ) ?? []),
                    ],
                    valueSetter(params) {
                        const { value, row } = params;

                        const purpose = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.PURPOSE
                        );
                        const product = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.PRODUCT
                        );
                        const productOptions =
                            products.data?.product
                                ?.filter(
                                    ele =>
                                        ele?.purpose.value === purpose &&
                                        ele?.class.value === value
                                )
                                .map(product => product?.name) || [];

                        return {
                            ...row,
                            [EstimateDetailsOptionTypeEnum.CLASS]: value,
                            [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                                productOptions.includes(product)
                                    ? product.type.value
                                    : "",
                            [EstimateDetailsOptionTypeEnum.PRODUCT]:
                                productOptions.includes(product)
                                    ? product
                                    : "선택해주세요",
                        };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.PRODUCT,
                    headerName: "품목",
                    width: 240,
                    type: "singleSelect",
                    valueOptions: params => {
                        const { id } = params.row;
                        const purpose = apiRef.current.getCellValue(
                            id,
                            EstimateDetailsOptionTypeEnum.PURPOSE
                        );
                        const productClass = apiRef.current.getCellValue(
                            id,
                            EstimateDetailsOptionTypeEnum.CLASS
                        );
                        return [
                            "선택해주세요",
                            ...(products.data?.product
                                ?.filter(
                                    ele =>
                                        ele?.purpose.value === purpose &&
                                        ele?.class.value === productClass
                                )
                                .map(product => product!.name) || []),
                        ];
                    },
                    valueSetter(params) {
                        const { value, row } = params;

                        const product = products.data?.product.find(
                            item => item?.name === value
                        );

                        return {
                            ...row,
                            [EstimateDetailsOptionTypeEnum.PRODUCT]: value,
                            [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                                product?.type.value,
                            [EstimateDetailsOptionTypeEnum.UNIT]:
                                product?.unit.value,
                            [EstimateDetailsOptionTypeEnum.PRICE]:
                                moneyToNumber(product?.price || "0"),
                            [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                                1 * moneyToNumber(product?.price || "0"),
                            [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                                !!getValues("discount_rate")
                                    ? (1 - getValues("discount_rate") / 100) *
                                      1 *
                                      moneyToNumber(product?.price || "0")
                                    : 1 * moneyToNumber(product?.price || "0"),
                        };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.DETAILS,
                    headerName: "세부내역",
                    width: 280,
                    type: "string",
                    renderEditCell: params =>
                        React.createElement(EditTextareaCell, params),
                },
                {
                    field: EstimateDetailsOptionTypeEnum.UNIT,
                    headerName: "단위",
                    width: 160,
                },
                {
                    field: EstimateDetailsOptionTypeEnum.AMOUNT,
                    headerName: "수량",
                    width: 120,
                    type: "number",
                    valueSetter(params) {
                        const { value, row } = params;

                        const price = apiRef.current.getCellValue(
                            row.id,
                            EstimateDetailsOptionTypeEnum.PRICE
                        );

                        return {
                            ...row,
                            [EstimateDetailsOptionTypeEnum.AMOUNT]: value,
                            [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                                value * price,
                            [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                                !!getValues("discount_rate")
                                    ? (1 - getValues("discount_rate") / 100) *
                                      value *
                                      price
                                    : value * price,
                        };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.PRICE,
                    headerName: "단가",
                    width: 200,
                    type: "number",
                    // valueParser: (value: string) => parseInt(value, 10),
                    // preProcessEditCellProps: (
                    //     params: GridPreProcessEditCellProps
                    // ) => {
                    //     const hasError =
                    //         isNaN(params.props.value) ||
                    //         !Number.isInteger(params.props.value);
                    //     return { ...params.props, error: hasError };
                    // },
                    valueParser: (value: string) => {
                        const parsedValue = parseInt(value, 10);
                        return isNaN(parsedValue) ? 0 : Math.abs(parsedValue);
                    },
                    preProcessEditCellProps: (
                        params: GridPreProcessEditCellProps
                    ) => {
                        const hasError =
                            !Number.isInteger(params.props.value) ||
                            params.props.value < 0;
                        return { ...params.props, error: hasError };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.STANDARD_PRICE,
                    headerName: "기준금액",
                    width: 200,
                    type: "number",
                    // renderEditCell: params => <IntOnlyEditInputCell {...params} />,
                    // valueFormatter({ id, value }) {
                    //     return !!value ? numberToMoney(value) : value;
                    // },
                    valueParser: (value: string) => {
                        const parsedValue = parseInt(value, 10);
                        return isNaN(parsedValue) ? 0 : Math.abs(parsedValue);
                    },
                    preProcessEditCellProps: (
                        params: GridPreProcessEditCellProps
                    ) => {
                        const hasError =
                            !Number.isInteger(params.props.value) ||
                            params.props.value < 0;
                        return { ...params.props, error: hasError };
                    },
                    // valueSetter(params) {
                    //     const { value, row } = params;
                    //     return {
                    //         ...row,
                    //         [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]: value,
                    //         [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: !!getValues(
                    //             "discount_rate"
                    //         )
                    //             ? (1 - getValues("discount_rate") / 100) * value
                    //             : value,
                    //     };
                    // },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.SUPPLY_PRICE,
                    headerName: "공급금액",
                    width: 200,
                    type: "number",
                    // // 여기 추가
                    // // editable: true,
                    // renderEditCell: params => <IntOnlyEditInputCell {...params} />,
                    // //
                    // valueFormatter({ id, value }) {
                    //     return !!value ? numberToMoney(parseInt(value)) : value;
                    // },
                    valueParser: (value: string) => {
                        const parsedValue = parseInt(value, 10);
                        return isNaN(parsedValue) ? 0 : Math.abs(parsedValue);
                    },
                    preProcessEditCellProps: (
                        params: GridPreProcessEditCellProps
                    ) => {
                        const hasError =
                            !Number.isInteger(params.props.value) ||
                            params.props.value < 0;
                        return { ...params.props, error: hasError };
                    },
                },
                {
                    field: EstimateDetailsOptionTypeEnum.NOTE,
                    headerName: "비고",
                    width: 280,
                    type: "string",
                    renderEditCell: params =>
                        React.createElement(EditTextareaCell, params),
                },
            ];
            break;
        case CommonType.REPAIR:
            columns = [
                {
                    field: EstimateDetailsOptionTypeEnum.TYPE,
                    headerName: "구분",
                    width: 180,
                    type: "singleSelect",
                    valueOptions: [
                        "선택해주세요",
                        `JOB-PaSS ${CommonType.LICENSE}`,
                        `JOB-PaSS ${CommonType.CUSTOMIZE}`,
                    ],
                },
            ];
            break;
        default:
            break;
    }
    return columns;
};

export default getEstimateDetailColumns;
