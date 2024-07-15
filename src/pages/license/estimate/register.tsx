import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { LicenseEstimateForm } from "@domains/estimate/components";
import { ILicenseEstimateForm } from "@domains/estimate/components/license-estimate-form/LicenseEstimateForm.interface";
import generateEstimateDocNum from "@domains/estimate/hooks/getEstimateDocNum";
import estimateService from "@domains/estimate/services/estimate.service";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const LicenseContractRegister: NextPage = () => {
    const router = useRouter();
    const loginUser = useRecoilValue(loginState);

    const {
        register,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ILicenseEstimateForm.IForm>();

    const detailsApiRef = useGridApiRef();

    const [rows, setRows] = useState<GridRowsProp>([]);

    //  COMMON CODE ( 라이선스 )
    const { data: licenseCode } = useQuery(
        ["get license type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: CommonType.LICENSE },
                },
            })
    );

    // 자동 입력 ( 기본값, 계산 등 ) 활성 여부
    const [isAutoCompleteActivated, setIsAutoCompleteActivated] =
        useState<boolean>(true);

    // 첫 렌더링시, [ 부가세포함 / 견적금액 / 할인율 / 공급금액 / 특별할인금액 & 적용여부 / 공급금액 (VAT) & 활성 여부 ] 필드 초기화
    useEffect(() => {
        setValue("vat_include", false);
        setValue("add_special_discount", false);
        setValue("estimate_price", numberToMoney(0));
        setValue("discount_rate", 0);
        setValue("total_price", numberToMoney(0));
        setValue("special_discount_price", numberToMoney(0));
        setValue("total_price_vat", numberToMoney(0));
    }, []);

    // 견적일자 & 유효기간 초기화
    useEffect(() => {
        setValue("estimate_date", dayjs());
    }, []);

    // 문서번호 생성
    useQuery(
        ["get esitmate count by selected project"],
        () => estimateService.getEstimateCount(),
        {
            enabled:
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default",
            onSuccess(data) {
                setValue("doc_num", generateEstimateDocNum(data!.count));
            },
        }
    );

    // // 고객사 재선택할 경우, 연관된 필드들 초기화
    // useEffect(() => {
    //     setValue("project_id", {
    //         label: "선택해주세요",
    //         value: "default",
    //     });
    //     setValue("selected_employee", {
    //         label: "선택해주세요",
    //         value: "default",
    //     });
    //     setValue("employee_name", "");
    //     setValue("employee_email", "");
    //     setValue("employee_contact", "");
    //     setValue("employee_phone", "");
    //     setValue("doc_num", "");
    //     setValue("case_name", "");
    //     setValue("selected_head_employee", {
    //         label: "선택해주세요",
    //         value: "default",
    //     });
    //     setValue("head_employee_name", "");
    //     setValue("head_employee_email", "");
    //     setValue("head_employee_contact", "");
    // }, [watch("selected_client")]);

    // // 사업 재선택할 경우, 연관된 필드들 초기화
    // useEffect(() => {
    //     setValue("selected_employee", {
    //         label: "선택해주세요",
    //         value: "default",
    //     });
    //     setValue("employee_name", "");
    //     setValue("employee_email", "");
    //     setValue("employee_contact", "");
    //     setValue("employee_phone", "");

    //     setValue("selected_head_employee", {
    //         label: "선택해주세요",
    //         value: "default",
    //     });
    //     setValue("head_employee_name", "");
    //     setValue("head_employee_email", "");
    //     setValue("head_employee_contact", "");
    // }, [watch("project_id")]);

    // -----------------------------------------------------------------
    // 등록
    // -----------------------------------------------------------------
    const { data: registeredData, mutate: registerEstiamteMutate } =
        useMutation(
            ["register new license estimate"],
            () =>
                estimateService.registerEstimate({
                    created_by: loginUser.id!,
                    type_code: licenseCode!.common_code[0].code,
                    project_id: parseInt(
                        getValues("project_id.value") as string,
                        10
                    ),
                    employee_name: getValues("employee_name"),
                    employee_email: getValues("employee_email"),
                    employee_contact: getValues("employee_contact"),
                    employee_phone: getValues("employee_phone"),
                    head_employee_name: getValues("head_employee_name"),
                    head_employee_email: getValues("head_employee_email"),
                    head_employee_contact: getValues("head_employee_contact"),
                    destination: getValues("destination"),
                    doc_num: getValues("doc_num"),
                    case_name: getValues("case_name"),
                    estimate_date: getValues("estimate_date").toDate(),
                    validity: getValues("validity").toDate(),
                    estimate_price: moneyToNumber(getValues("estimate_price")),
                    discount_rate: parseFloat(`${getValues("discount_rate")}`),
                    total_price: moneyToNumber(getValues("total_price")),
                    add_special_discount: getValues("add_special_discount"),
                    special_discount_price: getValues("add_special_discount")
                        ? moneyToNumber(getValues("special_discount_price"))
                        : 0,
                    vat_include: getValues("vat_include"),
                    total_price_vat: getValues("vat_include")
                        ? moneyToNumber(getValues("total_price_vat"))
                        : 0,
                    tail: getValues("tail"),
                    is_final: false,
                    details: [...rows]
                        .sort((a, b) => a.id - b.id)
                        .map(row => ({
                            row_index: row.id,
                            type: row.type,
                            purpose: row.purpose || "",
                            class: row.class || "",
                            product_type: row.product_type || "",
                            product: row.product || "",
                            details: row.details || "",
                            unit: row.unit || "",
                            amount: row.amount || 0,
                            price: row.price || 0,
                            standard_price: row.standard_price || 0,
                            supply_price: row.supply_price || 0,
                            note: row.note || "",
                        })),
                }),
            {
                onSuccess(data, variables, context) {
                    router.push(
                        `${PATH.LICENSE.ESTIMATE.MAIN}/${data.registerEstimate.estimate.id}`
                    );
                },
            }
        );

    const onClickSubmit = () => {
        // console.log(getValues("project_id"));
        // console.log(getValues("employee_name"));
        // console.log(getValues("employee_email"));
        // console.log(getValues("employee_contact"));
        // console.log(getValues("employee_phone"));
        // console.log(getValues("destination"));
        // console.log(getValues("doc_num"));
        // console.log(getValues("case_name"));
        // console.log(getValues("estimate_date").toDate());
        // console.log(getValues("validity"));
        // console.log(getValues("vat_include"));
        // console.log(getValues("add_special_discount"));
        // console.log(getValues("discount_rate"));
        // console.log(moneyToNumber(getValues("total_price_vat")));
        // console.log(getValues("total_price_vat"));
        // console.log(getValues("tail"));
        // console.log(rows);
        registerEstiamteMutate();
    };

    return (
        <BasicTemplate>
            <PageTitle title="라이선스 견적 등록" isVisible={false} />
            <LicenseEstimateForm
                register={register}
                control={control}
                watch={watch}
                getValues={getValues}
                setValue={setValue}
                errors={errors}
                onClickSubmit={handleSubmit(onClickSubmit)}
                rows={rows}
                setRows={setRows}
                detailsApiRef={detailsApiRef}
                // isAutoCompleteActivated={isAutoCompleteActivated}
                // setIsAutoCompleteActivated={setIsAutoCompleteActivated}
            />
        </BasicTemplate>
    );
};

export default LicenseContractRegister;
