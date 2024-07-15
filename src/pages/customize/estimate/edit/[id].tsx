import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { CustomizeEstimateForm } from "@domains/estimate/components";
import { ICustomizeEstimateForm } from "@domains/estimate/components/customize-estimate-form/CustomizeEstimateForm.interface";
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

const CustomizeEstimateEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    const {
        register,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ICustomizeEstimateForm.IForm>();

    const detailsApiRef = useGridApiRef();

    const [rows, setRows] = useState<GridRowsProp>([]);

    //  COMMON CODE ( 커스터마이징 개발 )
    const { data: customizeCode } = useQuery(
        ["get customizing dev type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: CommonType.CUSTOMIZE },
                },
            })
    );

    // 자동 입력 ( 기본값, 계산 등 ) 활성 여부
    const [isAutoCompleteActivated, setIsAutoCompleteActivated] =
        useState<boolean>(true);

    // const [isOriginal, setIsOriginal] = useState<boolean>(false);

    // // 고객사 재선택할 경우, 연관된 필드들 초기화
    // useEffect(() => {
    //     if (isOriginal) {
    //         setValue("project_id", {
    //             label: "선택해주세요",
    //             value: "default",
    //         });
    //         setValue("selected_employee", {
    //             label: "선택해주세요",
    //             value: "default",
    //         });
    //         setValue("employee_name", "");
    //         setValue("employee_email", "");
    //         setValue("employee_contact", "");
    //         setValue("employee_phone", "");
    //         setValue("doc_num", "");
    //         setValue("case_name", "");
    //     }
    // }, [watch("selected_client")]);

    // // 사업 재선택할 경우, 연관된 필드들 초기화
    // useEffect(() => {
    //     if (isOriginal) {
    //         setValue("selected_employee", {
    //             label: "선택해주세요",
    //             value: "default",
    //         });
    //         setValue("employee_name", "");
    //         setValue("employee_email", "");
    //         setValue("employee_contact", "");
    //         setValue("employee_phone", "");
    //     }
    // }, [watch("project_id")]);

    // -------------------------------------------------
    // 기존 견적 조회
    // -------------------------------------------------
    const {
        data: estimateData,
        refetch: fetchOriginalEstimate,
        remove: removeOriginalEstimateDataCache,
    } = useQuery(
        [`get customize dev estimate data of ${id}`],
        () => estimateService.getEstimateByPk({ id }),
        {
            enabled: false,
            onSuccess(data) {
                if (!!data.estimate_by_pk) {
                    const {
                        project,
                        employee_name,
                        employee_email,
                        employee_contact,
                        employee_phone,
                        destination,
                        doc_num,
                        case_name,
                        estimate_date,
                        validity,
                        estimate_price,
                        vat_include,
                        discount_rate,
                        total_price,
                        add_special_discount,
                        special_discount_price,
                        total_price_vat,
                        tail,
                        details,
                    } = data.estimate_by_pk;

                    // /***** 다른 필드 값에 영향을 받아 채워지는 필드들은 아래에서 SET *****/
                    // 고객사
                    if (!!project) {
                        setValue("selected_client", {
                            label: project.client.name,
                            value: project.client.id,
                        });
                    }

                    // 문서 번호
                    setValue("doc_num", doc_num);
                    // 견적일자
                    setValue("estimate_date", dayjs(estimate_date).utc(true));
                    // 세부내역
                    const initialRows = details
                        .sort((a, b) => a.row_index - b.row_index)
                        .map((row, idx) => ({
                            id: idx + 1,
                            type: row.type,
                            purpose: row.purpose,
                            class: row.class,
                            product_type: row.product_type,
                            product: row.product,
                            details: row.details,
                            unit: row.unit,
                            amount: row.amount,
                            price: moneyToNumber(row.price),
                            standard_price: moneyToNumber(
                                row.standard_price || ""
                            ),
                            supply_price: moneyToNumber(row.supply_price),
                            note: row.note,
                        }));
                    setRows(initialRows);

                    setValue("discount_rate", discount_rate);
                    setValue(
                        "special_discount_price",
                        numberToMoney(moneyToNumber(special_discount_price))
                    );
                    setValue("tail", tail);
                    // 견적 불러온 직후 > 자동 입력 비활성화
                    setIsAutoCompleteActivated(false);
                }
            },
        }
    );

    useEffect(() => {
        if (!!id) {
            fetchOriginalEstimate();
        }
    }, []);

    // useEffect(() => {
    //     if (!!estimateData?.estimate_by_pk) {
    //         const { project, employee_name } = estimateData.estimate_by_pk;

    //         const employee = project.employees.find(
    //             emp => emp.employee.name === employee_name
    //         );
    //         if (
    //             getValues("project_id.value") === project.id &&
    //             getValues("selected_client.value") === project.client.id &&
    //             getValues("selected_employee.value") ===
    //                 employee?.employee.id &&
    //             getValues("selected_employee.label") ===
    //                 `${employee?.employee.name} ( ${employee?.role.value} )`
    //         ) {
    //             setIsOriginal(true);
    //         }
    //     }
    // }, [
    //     estimateData,
    //     watch("project_id"),
    //     watch("selected_client"),
    //     watch("selected_employee"),
    // ]);
    // -------------------------------------------------
    // 견적 수정
    // -------------------------------------------------
    const { data: editedData, mutate: editEstiamteMutate } = useMutation(
        [`edit customize dev estimate of ID ${id}`],
        () =>
            estimateService.editEstimate({
                estimate_id: id,
                updated_by: loginUser.id!,
                type_code: customizeCode!.common_code[0].code,
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
                        supply_price: row.supply_price || 0,
                        standard_price: row.standard_price || 0,
                        note: row.note || "",
                    })),
            }),
        {
            onSuccess(data, variables, context) {
                router.push(
                    `${PATH.CUSTOMIZE.ESTIMATE.MAIN}/${data.editEstimate.estimate.id}`
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
        // console.log(getValues("estimate_price"));
        // console.log(getValues("vat_include"));
        // console.log(getValues("discount_rate"));
        // console.log(moneyToNumber(getValues("total_price")));
        // console.log(getValues("total_price_vat"));
        // console.log(getValues("tail"));
        // console.log(rows);
        editEstiamteMutate();
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="커스터마이징 개발 견적 수정"
                isVisible={false}
                path={`${PATH.CUSTOMIZE.ESTIMATE.MAIN}/${id}`}
            />
            <CustomizeEstimateForm
                register={register}
                control={control}
                errors={errors}
                watch={watch}
                getValues={getValues}
                setValue={setValue}
                onClickSubmit={handleSubmit(onClickSubmit)}
                rows={rows}
                setRows={setRows}
                detailsApiRef={detailsApiRef}
                originalEstimateData={estimateData}
                removeOriginalEstimateDataCache={
                    removeOriginalEstimateDataCache
                }
                isAutoCompleteActivated={isAutoCompleteActivated}
                setIsAutoCompleteActivated={setIsAutoCompleteActivated}
            />
        </BasicTemplate>
    );
};

export default CustomizeEstimateEdit;
