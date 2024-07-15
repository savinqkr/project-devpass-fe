import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { RepairEstimateForm } from "@domains/estimate/components";
import { IRepairEstimateForm } from "@domains/estimate/components/repair-estimate-form/RepairEstimateForm.interface";
import estimateService from "@domains/estimate/services/estimate.service";
import projectService from "@domains/project/service/project.service";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import repairDetailsEstimateModalState from "@recoils/repair-estimate-detail-modal-state.atom";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const RepairEstimateEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    // 라이선스 도입 사업 RECOIL
    const [repairDetailsEstimateModal, setRepairDetailsEstimateModal] =
        useRecoilState(repairDetailsEstimateModalState);

    const resetRepairDetailsEstimateModal = useResetRecoilState(
        repairDetailsEstimateModalState
    );

    const {
        register,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IRepairEstimateForm.IForm>();

    const detailsApiRef = useGridApiRef();

    const [rows, setRows] = useState<GridRowsProp>([]);

    //  COMMON CODE ( 유지보수 )
    const { data: repairCode } = useQuery(["get repair type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.REPAIR },
            },
        })
    );

    // 자동 입력 ( 기본값, 계산 등 ) 활성 여부
    const [isAutoCompleteActivated, setIsAutoCompleteActivated] =
        useState<boolean>(true);

    // -------------------------------------------------
    // 기존 견적 조회
    // -------------------------------------------------
    const {
        data: originalEstimateData,
        refetch: fetchOriginalEstimate,
        remove: removeOriginalEstimateDataCache,
    } = useQuery(
        [`get original repair estimate data of ${id}`],
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
                        head_employee_name,
                        head_employee_email,
                        head_employee_contact,
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
                            license_project_name: row.license_project_name,
                            year: row.year,
                            type: row.type,
                            purpose: row.purpose,
                            class: row.class,
                            product_type: row.product_type,
                            product: row.product,
                            details: row.details,
                            unit: row.unit,
                            amount: row.amount,
                            price: moneyToNumber(row.price),
                            supply_price: moneyToNumber(row.supply_price),
                            monthly_repair_price: moneyToNumber(
                                row.monthly_repair_price || "0"
                            ),
                            total_repair_price: moneyToNumber(
                                row.total_repair_price || "0"
                            ),
                            start_date: row.start_date,
                            end_date: row.end_date,
                            license_contract_id: row.license_contract_id,
                            // note: row.note,
                        }));
                    setRows(initialRows);

                    const licenseContractIds: number[] = initialRows
                        .map(ele => ele.license_contract_id)
                        .filter((id): id is number => !!id);

                    setRepairDetailsEstimateModal(prev => ({
                        ...prev,
                        selectedClientId:
                            data?.estimate_by_pk.project.client.id,
                        selectedRepairProjectId:
                            data?.estimate_by_pk.project.id,
                        appliedLicenseContractId: licenseContractIds,
                        registeredLicenseContractId: licenseContractIds,
                        selectedLicenseContractId: licenseContractIds,
                    }));
                    // console.log(
                    //     project.license_contract?.map(ele => ele.contract.id)
                    // );
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

    // -------------------------------------------------
    // 기존 라이선스 도입 사업 조회
    // -------------------------------------------------
    // const { data: registeredLicenseContracts } = useQuery(
    //     [`get registered license contract data of repair project ${id}`],
    //     () =>
    //         projectService.getProjectByPk({
    //             id: originalEstimateData?.estimate_by_pk.project.id!,
    //         }),
    //     {
    //         enabled: !!originalEstimateData?.estimate_by_pk.project.id,
    //         onSuccess(data) {
    //             const licenseContractedIds =
    //                 data.project_by_pk.license_contracts.map(
    //                     ele => ele.contract.id
    //                 );
    //             console.log(licenseContractedIds);
    //             // setRepairDetailsEstimateModal(prev => ({
    //             //     ...prev,
    //             //     registeredLicenseContractId: licenseContractedIds,
    //             // }));
    //             setRepairDetailsEstimateModal(prev => ({
    //                 ...prev,
    //                 selectedClientId:
    //                     originalEstimateData?.estimate_by_pk.project.client.id,
    //                 selectedRepairProjectId:
    //                     originalEstimateData?.estimate_by_pk.project.id,
    //                 appliedLicenseContractId: licenseContractedIds,
    //                 registeredLicenseContractId: licenseContractedIds,
    //                 selectedLicenseContractId: licenseContractedIds,
    //             }));
    //         },
    //     }
    // );

    // -------------------------------------------------
    // 견적 수정
    // -------------------------------------------------
    const { data: editedData, mutate: editEstiamteMutate } = useMutation(
        [`edit license estimate of ID ${id}`],
        () =>
            estimateService.editEstimate({
                estimate_id: id,
                updated_by: loginUser.id!,
                type_code: repairCode!.common_code[0].code,
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
                license_contracts:
                    repairDetailsEstimateModal.appliedLicenseContractId
                        ?.filter((id): id is number => typeof id === "number")
                        .filter(
                            (value, index, self) =>
                                self.indexOf(value) === index
                        ),
                details: [...rows]
                    .sort((a, b) => a.id - b.id)
                    .map(row => ({
                        row_index: row.id,
                        license_project_name: row.license_project_name,
                        year: dayjs(row.year).toDate(),
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
                        monthly_repair_price: row.monthly_repair_price || 0,
                        total_repair_price: row.total_repair_price || 0,
                        start_date: dayjs(row.start_date).toDate(),
                        end_date: dayjs(row.end_date).toDate(),
                        license_contract_id: row.license_contract_id,
                        // note: row.note || "",
                    })),
            }),
        {
            onSuccess(data, variables, context) {
                resetRepairDetailsEstimateModal();
                router.push(
                    `${PATH.REPAIR.ESTIMATE.MAIN}/${data.editEstimate.estimate.id}`
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
        // console.log([...rows].sort((a, b) => a.id - b.id));
        // console.log(repairDetailsEstimateModal);
        // console.log("================================");
        // console.log(
        //     repairDetailsEstimateModal.appliedLicenseContractId
        //         ?.filter((id): id is number => typeof id === "number")
        //         .filter((value, index, self) => self.indexOf(value) === index)
        // );
        editEstiamteMutate();
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="유지보수 견적 수정"
                isVisible={false}
                path={`${PATH.REPAIR.ESTIMATE.MAIN}/${id}`}
            />
            <RepairEstimateForm
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
                originalEstimateData={originalEstimateData}
                removeOriginalEstimateDataCache={
                    removeOriginalEstimateDataCache
                }
                isAutoCompleteActivated={isAutoCompleteActivated}
                setIsAutoCompleteActivated={setIsAutoCompleteActivated}
            />
        </BasicTemplate>
    );
};

export default RepairEstimateEdit;
