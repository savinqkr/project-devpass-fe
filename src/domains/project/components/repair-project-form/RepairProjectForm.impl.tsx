import { useEffect, useState } from "react";
import { IRepairProjectForm } from "./RepairProjectForm.interface";
import {
    GridColDef,
    GridRowId,
    GridRowsProp,
    useGridApiRef,
} from "@mui/x-data-grid";
import { useQuery } from "react-query";
import employeeService from "@domains/employee/services/employee.service";
import roleService from "@domains/role/services/role.service";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import VRepairProjectForm from "./RepairProjectForm.view";
import contractService from "@domains/contract/services/graphql/contract.service";
import dayjs from "dayjs";
import codeService from "@common/services/code/code.service";
import { CodeCategory } from "src/enums/code_category.enum";
import { IOrder_By } from "src/codegen/graphql";
import { SpecialRole } from "@enums";
import { CommonType } from "src/enums/common_type.enum";

const RepairProjectForm: React.FC<IRepairProjectForm.IProps> = props => {
    const {
        watch,
        getValues,
        setValue,
        employeeRows,
        setEmployeeRows,
        originalProjectData,
        licenseContractApiRef,
        isAutoCompleteActivated,
        setIsAutoCompleteActivated,
    } = props;

    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (type === "change" && !isAutoCompleteActivated) {
                setIsAutoCompleteActivated(true); // 자동 입력 활성화
            }
            return () => formWatch.unsubscribe();
        });
    }, [originalProjectData]);

    /***********************************************************************
     * 회사 옵션 ( 고객사 | 계약사 | 담당자 > 회사 )
     ***********************************************************************/
    const [clientOptions, setClientOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [companyOptions, setCompanyOptions] = useState<
        { label: string; value: number }[]
    >([]);
    useQuery(
        ["get client companies"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _in: [CompanyType.CLIENT, CompanyType.HEAD],
                        },
                    },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                // 고객사 옵션
                const clients: { label: string; value: number }[] = data
                    .filter(comp => comp?.type.value === CompanyType.CLIENT)
                    .map(comp => ({ label: comp!.name, value: comp!.id }));
                setClientOptions(clients);
                // 담당자 > 회사 옵션
                const companyOptions: { label: string; value: number }[] =
                    data.map(comp => ({
                        label: comp!.name,
                        value: comp!.id,
                    }));
                setCompanyOptions(companyOptions);
            },
        }
    );

    /***********************************************************************
     * 역할 옵션
     ***********************************************************************/
    const [roleOptions, setRoleOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const { data: roleData } = useQuery(
        ["get roles"],
        () =>
            roleService.getAllRoleCode({
                where: { deleted_at: { _is_null: true } },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const roles: { label: string; value: number }[] =
                    data.role_code.map(role => ({
                        label: role!.value,
                        value: role!.code,
                    }));
                setRoleOptions(roles);
            },
        }
    );

    /***********************************************************************
     * 담당자 옵션
     ***********************************************************************/
    const [employeeOptions, setEmployeeOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const { data: employeeData, refetch: fetchEmployeeOptions } = useQuery(
        ["get employees", watch("selected_company"), watch("selected_role")],
        () =>
            employeeService.getAllUserAndEmployee({
                where: {
                    company_id: {
                        _eq:
                            !watch("selected_company.value") ||
                            watch("selected_company.value") === "default"
                                ? 0
                                : parseInt(
                                      watch("selected_company.value") as string
                                  ),
                    },
                    roles: {
                        role: {
                            code: {
                                _eq:
                                    !watch("selected_role.value") ||
                                    watch("selected_role.value") === "default"
                                        ? 0
                                        : parseInt(
                                              watch(
                                                  "selected_role.value"
                                              ) as string
                                          ),
                            },
                        },
                    },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled:
                watch("selected_company.value") !== "default" &&
                watch("selected_role.value") !== "default",
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const employees: { label: string; value: number }[] =
                    data.employee.map(emp => ({
                        label: emp.name,
                        value: emp.id,
                    }));
                setEmployeeOptions(employees);
            },
        }
    );

    /***********************************************************************
     * 엔지니어 (컨설턴트) 옵션
     ***********************************************************************/
    const [consultantOptions, setConsultantOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const { data: consultantData, refetch: fetchConsultantOptions } = useQuery(
        ["get employees", watch("selected_company"), watch("selected_role")],
        () =>
            employeeService.getAllUserAndEmployee({
                where: {
                    company: {
                        type: {
                            value: { _eq: CompanyType.HEAD },
                        },
                    },
                    roles: {
                        role: {
                            special_role: {
                                value: { _eq: SpecialRole.ENGINEER },
                            },
                        },
                    },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const consultants: { label: string; value: number }[] =
                    data.employee.map(emp => ({
                        label: emp.name,
                        value: emp.id,
                    }));
                setConsultantOptions(consultants);

                if (!!originalProjectData) {
                    const consultant = data.employee.find(
                        emp => emp.name === getValues("consultant_name")
                    );
                    if (!!consultant) {
                        setValue("selected_consultant", {
                            label: consultant.name,
                            value: consultant.id,
                        });
                    }
                }
            },
        }
    );

    useEffect(() => {
        if (isAutoCompleteActivated) {
            const consultant = consultantData?.employee.find(
                emp => emp.id === getValues("selected_consultant.value")
            );
            if (!!consultant) {
                setValue("consultant_name", consultant.name);
                setValue("consultant_email", consultant.email);
                setValue("consultant_contact", consultant.contact);
                setValue("consultant_phone", consultant.phone);
            }
        } else {
            if (!!originalProjectData) {
                setValue(
                    "consultant_name",
                    originalProjectData.project_by_pk.consultant_name!
                );
                setValue(
                    "consultant_email",
                    originalProjectData.project_by_pk.consultant_email!
                );
                setValue(
                    "consultant_contact",
                    originalProjectData.project_by_pk.consultant_contact!
                );
                setValue(
                    "consultant_phone",
                    originalProjectData.project_by_pk.consultant_phone!
                );
            }
        }
    }, [watch("selected_consultant")]);

    /***********************************************************************
     * 라이선스 도입 사업 목록 그리드
     ***********************************************************************/
    const [licenseContractRows, setLicenseContractRows] =
        useState<GridRowsProp>([]);
    const licenseContractColumns: GridColDef[] = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "contract_period_start", headerName: "계약일", flex: 1 },
        { field: "project_name", headerName: "사업명", flex: 2 },
    ];
    const { data: licenseContractData, refetch: fetchLicenseContractData } =
        useQuery(
            ["get license contracts", watch("client_id")],
            () =>
                contractService.getAllContract({
                    where: {
                        client_id: {
                            _eq:
                                getValues("client_id.value") === "default"
                                    ? 0
                                    : (getValues("client_id.value") as number),
                        },
                        type: {
                            value: { _eq: CommonType.LICENSE },
                        },
                        project: {
                            is_canceled: { _eq: false },
                        },
                        deleted_at: { _is_null: true },
                    },
                    order_by: [
                        {
                            contract_period_start: IOrder_By.Asc,
                        },
                    ],
                }),
            {
                enabled:
                    !!licenseContractApiRef &&
                    !!getValues("client_id.value") &&
                    getValues("client_id.value") !== "default",
                cacheTime: 0,
                staleTime: 0,
                keepPreviousData: false,
                onSuccess(data) {
                    const contracts = data.map((contract, idx) => ({
                        id: idx + 1,
                        idx: idx + 1,
                        pk: contract?.id,
                        contract_period_start: dayjs(
                            contract?.contract_period_start
                        ).format("YYYY년 MM월 DD일"),
                        contract_period_end: dayjs(
                            contract?.contract_period_end
                        ).format("YYYY년 MM월 DD일"),
                        project_name: contract?.project.name,
                    }));
                    setLicenseContractRows(contracts);

                    // if (!!originalProjectData) {
                    //     const selectedContractIds =
                    //         originalProjectData.project_by_pk.license_contracts.map(
                    //             contract => contract.contract.id
                    //         );
                    //     const selectedRows: GridRowId[] = contracts
                    //         .filter(row =>
                    //             selectedContractIds.includes(row.pk!)
                    //         )
                    //         .map(row => row.id);
                    //     //     // selectedRows.forEach(id =>
                    //     //     //     licenseContractApiRef.current.selectRow(id)
                    //     //     // );
                    //     //     if (!!licenseContractApiRef.current.setRowSelectionModel) {
                    //     licenseContractApiRef.current.setRowSelectionModel(
                    //         selectedRows
                    //     );
                    //     //     }
                    // }
                },
            }
        );

    /*************************************************************
     * 고객사 선택 값이 바뀌었을 때, 라이선스 도입 사업 목록 초기화
     * ( 자동 입력 활성 상태일 경우 )
     *************************************************************/
    useEffect(() => {
        if (isAutoCompleteActivated) {
            setLicenseContractRows([]);
        }
    }, [watch("client_id")]);

    /*************************************************************
     * 라이선스 도입 목록이 업데이트 된 직후
     *************************************************************/
    useEffect(() => {
        // 자동 전체 선택 ( 자동 입력 활성 상태일 경우 )
        if (
            isAutoCompleteActivated &&
            licenseContractRows.length !== 0 &&
            !!licenseContractApiRef.current.setRowSelectionModel
        ) {
            const rowIds: GridRowId[] = licenseContractRows.map(row => row.id);
            licenseContractApiRef.current.setRowSelectionModel(rowIds);
        }

        // 수정페이지에 해당 ( 자동 입력 비활성 상태일 경우 )
        // - 라이선스 도입 사업 목록 중, 기존 데이터에 포함된 ROW 만 선택
        if (
            !isAutoCompleteActivated &&
            !!originalProjectData &&
            !!licenseContractApiRef.current.setRowSelectionModel
        ) {
            const selectedContractIds =
                originalProjectData.project_by_pk.license_contracts.map(
                    contract => contract.contract.id
                );
            const selectedRows: GridRowId[] = licenseContractRows
                .filter(row => selectedContractIds.includes(row.pk!))
                .map(row => row.id);
            licenseContractApiRef.current.setRowSelectionModel(selectedRows);
        }
    }, [licenseContractRows, originalProjectData]);

    /***********************************************************************
     * 담당자 그리드
     ***********************************************************************/
    const employeeApiRef = useGridApiRef();
    const employeeColumns: GridColDef[] = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "company", headerName: "회사", flex: 1.5 },
        { field: "name", headerName: "담당자명", flex: 3 },
        { field: "role", headerName: "역할", flex: 1 },
    ];
    const onClickAddEmployee = () => {
        const selectedEmp = employeeData?.employee.find(
            emp => emp.id === getValues("selected_employee.value")
        );
        const selectedRole = roleData?.role_code.find(
            role => role.code === getValues("selected_role.value")
        );

        if (
            selectedEmp &&
            selectedRole &&
            !employeeRows.some(
                row =>
                    row.pk === selectedEmp.id &&
                    row.role_code === selectedRole.code
            )
        ) {
            const selectedEmployee = {
                id: employeeRows.length + 1,
                idx: employeeRows.length + 1,
                pk: selectedEmp?.id,
                name: selectedEmp?.name,
                company: selectedEmp?.company.name,
                role: selectedRole?.value,
                role_code: selectedRole?.code,
            };
            setEmployeeRows(prevRows => [...prevRows, selectedEmployee]);
        }
        setValue("selected_company", { value: "default", label: "회사" });
        setValue("selected_role", { value: "default", label: "역할" });
        setValue("selected_employee", { value: "default", label: "담당자" });
    };
    const onClickRemoveEmployee = () => {
        if (employeeRows.length !== 0) {
            const selectedRows = employeeApiRef.current.getSelectedRows();
            const updatedRows = employeeRows
                .filter(row => !selectedRows.has(row.id))
                .map((row, index) => ({
                    ...row,
                    id: index + 1,
                    idx: index + 1,
                }));
            employeeApiRef.current.setRowSelectionModel([]);
            setEmployeeRows(updatedRows);
        }
    };

    /***********************************************************************
     * 정기점검 옵션
     ***********************************************************************/
    const [inspectCycleOptions, setInspectCycleOptions] = useState<
        { label: string; value: string }[]
    >([]);
    useQuery(
        ["get inspect cycle types"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.INSPECT_CYCLE_TYPE },
                },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options = data.common_code.map(code => ({
                    label: code.value,
                    value: code.value,
                }));
                setInspectCycleOptions(options);
            },
        }
    );
    const [inspectMethodOptions, setInspectMethodOptions] = useState<
        { label: string; value: string }[]
    >([]);
    useQuery(
        ["get inspect method types"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.INSPECT_METHOD_TYPE },
                },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options = data.common_code.map(code => ({
                    label: code.value,
                    value: code.value,
                }));
                setInspectMethodOptions(options);
            },
        }
    );

    return (
        <VRepairProjectForm
            {...props}
            clientOptions={clientOptions}
            companyOptions={companyOptions}
            roleOptions={roleOptions}
            employeeOptions={employeeOptions}
            consultantOptions={consultantOptions}
            inspectCycleOptions={inspectCycleOptions}
            inspectMethodOptions={inspectMethodOptions}
            licenseContractRows={licenseContractRows}
            licenseContractColumns={licenseContractColumns.map(col => {
                return {
                    field: col.field,
                    headerName: col.headerName,
                    flex: col.flex,
                    sortable: true,
                    align: "center",
                    headerAlign: "center",
                };
            })}
            employeeApiRef={employeeApiRef}
            employeeColumns={employeeColumns.map(col => {
                return {
                    field: col.field,
                    headerName: col.headerName,
                    flex: col.flex,
                    sortable: true,
                    align: "center",
                    headerAlign: "center",
                };
            })}
            onClickAddEmployee={onClickAddEmployee}
            onClickRemoveEmployee={onClickRemoveEmployee}
        />
    );
};

export default RepairProjectForm;
