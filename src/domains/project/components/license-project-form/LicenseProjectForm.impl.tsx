import { useState } from "react";
import { ILicenseProjectForm } from "./LicenseProjectForm.interface";
import VLicenseProjectForm from "./LicenseProjectForm.view";
import { useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid";
import roleService from "@domains/role/services/role.service";
import employeeService from "@domains/employee/services/employee.service";

const LicenseProjectForm: React.FC<ILicenseProjectForm.IProps> = props => {
    const {
        watch,
        getValues,
        setValue,
        partnerRows,
        setPartnerRows,
        employeeRows,
        setEmployeeRows,
    } = props;

    // SELECTOR 옵션 ( 고객사 | 계약사 | 파트너사 )
    const [clientOptions, setClientOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [companyOptions, setCompanyOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [roleOptions, setRoleOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [employeeOptions, setEmployeeOptions] = useState<
        { label: string; value: number }[]
    >([]);

    // 회사 옵션
    const { data: companyData } = useQuery(
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
            onSuccess(data) {
                // 거래처 옵션
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

    // 역할 옵션
    const { data: roleData } = useQuery(
        ["get roles"],
        () =>
            roleService.getAllRoleCode({
                where: { deleted_at: { _is_null: true } },
            }),
        {
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

    // 담당자 옵션
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

    // 파트너사 그리드
    const partnerApiRef = useGridApiRef();
    const partnerColumns: GridColDef[] = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "type", headerName: "구분", flex: 1 },
        { field: "name", headerName: "SI / 파트너사", flex: 4 },
    ];
    const onClickAddPartner = () => {
        const selectedComp = companyData?.find(
            comp => comp?.id === getValues("selected_partner.value")
        );

        if (
            selectedComp &&
            !partnerRows.some(row => row.pk === selectedComp.id)
        ) {
            const selectedPartner = {
                id: partnerRows.length + 1,
                idx: partnerRows.length + 1,
                pk: selectedComp?.id,
                name: selectedComp?.name,
                type: selectedComp?.type.value,
            };
            setPartnerRows(prevRows => [...prevRows, selectedPartner]);
        }
        setValue("selected_partner", {
            value: "default",
            label: "선택해주세요",
        });
    };
    const onClickRemovePartner = () => {
        if (partnerRows.length !== 0) {
            const selectedRows = partnerApiRef.current.getSelectedRows();
            const updatedRows = partnerRows
                .filter(row => !selectedRows.has(row.id))
                .map((row, index) => ({
                    ...row,
                    id: index + 1,
                    idx: index + 1,
                }));
            partnerApiRef.current.setRowSelectionModel([]);
            setPartnerRows(updatedRows);
        }
    };

    // 담당자 그리드
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

    return (
        <VLicenseProjectForm
            {...props}
            clientOptions={clientOptions}
            companyOptions={companyOptions}
            roleOptions={roleOptions}
            employeeOptions={employeeOptions}
            partnerApiRef={partnerApiRef}
            partnerColumns={partnerColumns.map(col => {
                return {
                    field: col.field,
                    headerName: col.headerName,
                    flex: col.flex,
                    sortable: true,
                    align: "center",
                    headerAlign: "center",
                };
            })}
            onClickAddPartner={onClickAddPartner}
            onClickRemovePartner={onClickRemovePartner}
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

export default LicenseProjectForm;
