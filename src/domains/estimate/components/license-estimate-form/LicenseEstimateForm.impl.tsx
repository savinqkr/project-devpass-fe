import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { ILicenseEstimateForm } from "./LicenseEstimateForm.interface";
import { useQuery } from "react-query";
import codeService from "@common/services/code/code.service";
import { CodeCategory } from "src/enums/code_category.enum";
import productService from "@domains/product/services/product.service";
import { useEffect, useState } from "react";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import projectService from "@domains/project/service/project.service";
import tailService from "@domains/tail/services/tail.service";
import dayjs from "dayjs";
import VLicenseEstimateForm from "./LicenseEstimateForm.view";
import { EstimateDetailsOptionTypeEnum } from "src/enums/estimate_details_option.enum";
import moneyToNumber from "@utils/moneyToNumber";
import estimateService from "@domains/estimate/services/estimate.service";
import numberToMoney from "@utils/numberToMoney";
import { useRecoilState, useResetRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { EditTextareaCell, IntOnlyEditInputCell } from "@common/components";
import { CommonType } from "src/enums/common_type.enum";
import { IOrder_By } from "src/codegen/graphql";
import getEstimateDetailColumns from "@utils/getEstimateDetailColumns";
import { useGetProducts, useGetTypeCodes } from "@hooks/useEstimateDetailHooks";

const LicenseEstimateForm: React.FC<ILicenseEstimateForm.IProps> = props => {
    const {
        // originalEstimateData,
        rows,
        setRows,
        watch,
        getValues,
        setValue,
        detailsApiRef,
        // isAutoCompleteActivated,
        // setIsAutoCompleteActivated,
        // removeOriginalEstimateDataCache,
    } = props;

    // ---------------------------------------------------------------------
    // COMMON CODE
    // ---------------------------------------------------------------------
    // 라이선스
    const { data: licenseCode } = useQuery(["get license type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.LICENSE },
            },
        })
    );
    // 기술지원
    const { data: techSupportCode } = useQuery(
        ["get tech support type code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: CommonType.TECHSUPPPORT },
                },
            })
    );

    // ---------------------------------------------------------------------
    // OPTIONS
    // ---------------------------------------------------------------------
    // 고객사
    const { data: clientData } = useQuery(
        ["get client options for license estimate"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _eq: CompanyType.CLIENT,
                        },
                    },
                    deleted_at: { _is_null: true },
                },
            })
    );
    // 사업
    const { data: projectOptions } = useQuery(
        [
            "get project options by selected client for license estimate",
            watch("selected_client"),
        ],
        () =>
            projectService.getProjectByConditions({
                where: {
                    type: {
                        code: { _eq: licenseCode?.common_code[0].code || 0 },
                    },
                    client_id: {
                        _eq: parseInt(
                            getValues("selected_client.value") as string,
                            10
                        ),
                    },
                    is_canceled: { _eq: false },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled:
                !!licenseCode?.common_code[0].code &&
                !!getValues("selected_client.value") &&
                getValues("selected_client.value") !== "default",
        }
    );

    // 거래처 견적 담당자
    const { data: employeeOptions } = useQuery(
        [
            "get employee options by selected project for license estimate",
            watch("project_id"),
        ],
        () =>
            projectService.getProjectMembers({
                where: {
                    project_id: {
                        _eq:
                            parseInt(
                                getValues("project_id.value") as string,
                                10
                            ) || 0,
                    },
                    employee: {
                        company: { type: { value: { _neq: "본사" } } },
                    },
                },
            }),
        {
            enabled:
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default",
        }
    );

    // TAIL
    const { data: tailData } = useQuery(
        ["get license tail options for license estimate"],
        () =>
            tailService.getAllTailByType({
                where: {
                    type_code: { _eq: licenseCode!.common_code[0].code },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: !!licenseCode?.common_code[0].code,
        }
    );

    // 본사 견적 담당자
    const { data: headEmployeeOpions } = useQuery(
        [
            "get head office employee options by selected project for license estimate",
            watch("project_id"),
        ],
        () =>
            projectService.getProjectMembers({
                where: {
                    project_id: {
                        _eq:
                            parseInt(
                                getValues("project_id.value") as string,
                                10
                            ) || 0,
                    },
                    employee: {
                        company: { type: { value: { _eq: "본사" } } },
                    },
                },
            }),
        {
            enabled:
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default",
        }
    );

    // ---------------------------------------------------------------------
    // AUTO COMPLETE & CALCULATION
    // ---------------------------------------------------------------------
    // 고객사 재선택 시, 관련 필드 초기화
    useEffect(() => {
        setValue("project_id", {
            label: "선택해주세요",
            value: "default",
        });
        setValue("employee_name", "");
        setValue("employee_email", "");
        setValue("employee_contact", "");
        setValue("employee_phone", "");
        setValue("doc_num", "");
        setValue("case_name", "");
        setValue("selected_head_employee", {
            label: "선택해주세요",
            value: "default",
        });
        setValue("head_employee_name", "");
        setValue("head_employee_email", "");
        setValue("head_employee_contact", "");
    }, [watch("selected_client")]);

    // 사업 재선택 시, 관련 필드 초기화
    useEffect(() => {
        setValue("employee_name", "");
        setValue("employee_email", "");
        setValue("employee_contact", "");
        setValue("employee_phone", "");

        setValue("selected_head_employee", {
            label: "선택해주세요",
            value: "default",
        });
        setValue("head_employee_name", "");
        setValue("head_employee_email", "");
        setValue("head_employee_contact", "");
    }, [watch("project_id")]);

    // 거레처 견적 담당자 선택 시, 이메일 & 연락처 & 핸드폰번호 자동 입력
    useEffect(() => {
        const selectedEmployee = employeeOptions?.project_employee.find(
            ele => getValues("employee_name") === ele.employee.name
        )?.employee;

        if (!!selectedEmployee) {
            setValue("employee_email", selectedEmployee.email);
            setValue("employee_contact", selectedEmployee.contact);
            setValue("employee_phone", selectedEmployee.phone);
        }
    }, [watch("employee_name")]);

    // 수신처
    useEffect(() => {
        // ( 기본 ) 담당자 선택 X : 고객사
        if (
            getValues("selected_client.value") !== "default" &&
            getValues("employee_name") === ""
        ) {
            setValue("destination", getValues("selected_client.label"));
        }
        // ( 기본 ) 담당자 선택 O : 담당자의 회사
        const selectedEmployee = employeeOptions?.project_employee.find(
            ele => getValues("employee_name") === ele.employee.name
        )?.employee;
        if (!!selectedEmployee && getValues("employee_name") !== "") {
            setValue("destination", selectedEmployee.company.name);
        }
    }, [watch("selected_client"), watch("employee_name")]);

    // 건명 = { 고객사 } { 사업명 }
    useEffect(() => {
        if (
            !!getValues("project_id.value") &&
            getValues("project_id.value") !== "default" &&
            !!getValues("selected_client.value") &&
            getValues("selected_client.value") !== "default"
        ) {
            setValue(
                "case_name",
                `${getValues("selected_client.label")} ${getValues(
                    "project_id.label"
                )}`
            );
        }
    }, [watch("project_id"), watch("selected_client")]);

    // 유효기간 = 견적일자 + 30일
    useEffect(() => {
        setValue("validity", dayjs(getValues("estimate_date")).add(30, "day"));
    }, [watch("estimate_date")]);

    // TAIL 선택 시, 내용 적용
    useEffect(() => {
        if (getValues("selected_tail.value") !== "default") {
            const contents = tailData?.tail.filter(
                tail => tail.id === getValues("selected_tail.value")
            )[0]?.contents;
            if (!!contents) {
                setValue("tail", contents);
            }
        }
    }, [watch("selected_tail")]);

    // 본사 견적 담당자 선택 시, 이메일 & 연락처 & 핸드폰번호 자동 입력
    useEffect(() => {
        const selectedHeadEmployee = headEmployeeOpions?.project_employee.find(
            ele => getValues("selected_head_employee").value === ele.employee.id
        )?.employee;
        if (!!selectedHeadEmployee) {
            setValue(
                "head_employee_name",
                `${selectedHeadEmployee.name} ${
                    selectedHeadEmployee.position ?? ""
                }`
            );
            setValue("head_employee_email", selectedHeadEmployee.email);
            setValue("head_employee_contact", selectedHeadEmployee.phone);
        }
    }, [watch("head_employee_name")]);

    // ---------------------------------------------------------------------
    // MUI DATA GRID
    // ---------------------------------------------------------------------
    const handleClickAddRow = () => {
        // setIsAutoCompleteActivated(true); // 자동 입력 활성화
        const newRow: ILicenseEstimateForm.IDetailForm = {
            id: rows.length + 1,
            type: "선택해주세요",
            purpose: "선택해주세요",
            class: "선택해주세요",
            product: "선택해주세요",
            amount: 1,
            price: 0,
            standard_price: 0,
            supply_price: 0,
        };

        // setRows(prev => [...prev, newRow]);
        setRows(prev => {
            const updatedRows = [...prev, newRow];
            return updatedRows.sort((a, b) => a.id - b.id);
        });
    };

    const handleClickDeleteRow = () => {
        // setIsAutoCompleteActivated(true); // 자동 입력 활성화
        const allRowIds = detailsApiRef.current.getAllRowIds();
        const selectedRowIds: GridRowId[] = Array.from(
            detailsApiRef.current.getSelectedRows().keys()
        );
        detailsApiRef.current.setRowSelectionModel([]);
        const newRows = allRowIds
            .filter(id => !selectedRowIds.includes(id))
            .map((id, idx) => {
                const row = detailsApiRef.current.getRow(id);
                return {
                    ...row,
                    id: idx + 1,
                };
            });
        setRows(newRows);
    };
    // 견적 불러오기 후, 수정했을 경우 ( MUI DATAGRID )
    const onCellEditStart = () => {
        // if (!isAutoCompleteActivated) {
        //     setIsAutoCompleteActivated(true);
        // }
    };

    return (
        <VLicenseEstimateForm
            {...props}
            // vatChecked={vatChecked}
            // handleVat={handleVat}
            // specialDiscountChecked={specialDiscountChecked}
            // handleSpecialDiscount={handleSpecialDiscount}
            clientOptions={
                clientData
                    ?.filter(
                        company => company?.type.value === CompanyType.CLIENT
                    )
                    .map(client => ({
                        label: client!.name,
                        value: client!.id,
                    })) || []
            }
            projectOptions={
                projectOptions?.project.map(project => ({
                    label: project!.name,
                    value: project!.id,
                })) || []
            }
            employeeOptions={
                employeeOptions?.project_employee.map(
                    ele => ele!.employee.name
                ) || []
            }
            tailOptions={
                tailData?.tail.map(tail => ({
                    label: tail!.name,
                    value: tail!.id,
                })) || []
            }
            headEmployeeOptions={
                headEmployeeOpions?.project_employee
                    .map(ele => ({
                        label: ele!.employee.name,
                        value: ele!.employee.id,
                    }))
                    .filter(
                        (ele, index, self) =>
                            index === self.findIndex(t => t.value === ele.value)
                    ) || []
            }
            columns={getEstimateDetailColumns({
                estimateType: CommonType.LICENSE,
                apiRef: detailsApiRef,
                getValues: getValues,
                purposeOptions: useGetTypeCodes({
                    where: {
                        category: { _eq: CodeCategory.PRODUCT_PURPOSE },
                        is_used: { _eq: true },
                    },
                    order_by: [
                        {
                            code: IOrder_By.Asc,
                        },
                    ],
                }),
                classOptions: useGetTypeCodes({
                    where: {
                        category: { _eq: CodeCategory.PRODUCT_CLASS },
                        is_used: { _eq: true },
                    },
                    order_by: [
                        {
                            code: IOrder_By.Asc,
                        },
                    ],
                }),
                products: useGetProducts({
                    where: {
                        type: {
                            value: {
                                _in: [
                                    CommonType.LICENSE,
                                    CommonType.TECHSUPPPORT,
                                    CommonType.CUSTOMIZE,
                                ],
                            },
                        },
                        deleted_at: { _is_null: true },
                    },
                    order_by: [
                        {
                            created_at: IOrder_By.Asc,
                        },
                    ],
                }),
            }).map(col => ({
                ...col,
                editable: col.editable ?? true,
                sortable: true,
                align: "center",
                headerAlign: "center",
            }))}
            detailsApiRef={detailsApiRef}
            handleClickAddRow={handleClickAddRow}
            handleClickDeleteRow={handleClickDeleteRow}
            onCellEditStart={onCellEditStart}
        />
    );
};

export default LicenseEstimateForm;
