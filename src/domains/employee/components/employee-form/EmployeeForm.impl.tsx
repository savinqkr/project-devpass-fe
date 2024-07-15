import { useForm } from "react-hook-form";
import { IEmployeeForm } from "./EmployeeForm.interface";
import VEmployeeForm from "./EmployeeForm.view";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import roleService from "@domains/role/services/role.service";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import employeeService from "@domains/employee/services/employee.service";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const EmployeeForm: React.FC<IEmployeeForm.IProps> = props => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const {
        setValue,
        getValues,
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<IEmployeeForm.IForm>();

    // 회사 옵션
    const [companyOptions, setCompanyOptions] = useState<
        { value: string; label: string }[]
    >([]);
    useQuery(
        ["get company options"],
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
            }),

        {
            enabled: true,
            onSuccess(data) {
                const options: { value: string; label: string }[] = [];
                data.forEach(item => {
                    if (!item?.deleted_at) {
                        options.push({
                            value: `${item!.id}`,
                            label: item!.name,
                        });
                    }
                });
                setCompanyOptions(options);
            },
        }
    );

    // 역할 옵션
    const [roleOptions, setRoleOptions] = useState<
        { value: string; label: string }[]
    >([]);
    useQuery(
        ["get role type"],
        () =>
            roleService
                .getAllRoleCode({
                    where: {
                        deleted_at: { _is_null: true },
                        special_role_code: { _is_null: true },
                    },
                })
                .then(result => {
                    const options: { value: string; label: string }[] = [];
                    result.role_code!.forEach(option => {
                        if (!option?.deleted_at) {
                            options.push({
                                value: `${option.code}`,
                                label: option.value,
                            });
                        }
                    });
                    setRoleOptions(options);
                }),
        {
            enabled: true,
        }
    );

    // 선택된 역할 코드 값
    var [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const onClickAddRoleChip = () => {
        roleOptions.forEach(option => {
            const roleCodes = roles.map(role => role.value);
            if (
                option.value === getValues("selectedRole") &&
                !roleCodes.includes(option.value)
            ) {
                setRoles([...roles, option]);
            }
        });
        setValue("selectedRole", "default");
    };
    const handleDeleteRoleChip = (role: { value: string; label: string }) => {
        const updatedRoles = roles.filter(item => item.value !== role.value);
        setRoles(updatedRoles);
    };

    // 등록
    const { mutate: registerEmployeeMutate } = useMutation(
        ["register employee"],
        () =>
            employeeService.registerEmployee({
                company_id: parseInt(
                    getValues("selectedCompany.value") as string
                ),
                name: getValues("name"),
                department: getValues("department"),
                position: getValues("position"),
                role_codes: roles.map(role => {
                    return { role_code: parseInt(role.value) };
                }),
                email: getValues("email"),
                contact: getValues("contact"),
                phone: getValues("phone"),
                note: getValues("note"),
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.CLIENT.EMPLOYEE.MAIN}/${data.insert_employee_one.id}`
                );
            },
        }
    );
    const onClickRegister = () => {
        // console.log(getValues("selectedCompany"));
        registerEmployeeMutate();
    };

    // 담당자 상세 조회
    const { data: employeeData } = useQuery(
        ["get employee by pk"],
        () =>
            employeeService.getEmployeeByPk({
                id,
            }),
        {
            enabled: !!id,
            onSuccess(data) {
                const {
                    company: { id, name: compName },
                    name,
                    department,
                    position,
                    email,
                    contact,
                    phone,
                    note,
                } = data.employee_by_pk;
                setValue("selectedCompany.value", `${id}`);
                setValue("selectedCompany.label", `${compName}`);
                setValue("name", name);
                setValue("department", department);
                setValue("position", position);
                setValue("email", email);
                setValue("contact", contact);
                setValue("phone", phone);
                setValue("note", note);
                const rolelist = data.employee_by_pk.roles.map(role => {
                    return {
                        value: `${role.role?.code}`,
                        label: role.role?.value,
                    };
                });
                setRoles(rolelist);
            },
        }
    );

    // 담당자 수정
    const { mutate: editEmployeeMutate } = useMutation(
        ["edit employee"],
        () =>
            employeeService.editEmployeeByPk({
                id,
                company_id: parseInt(
                    getValues("selectedCompany.value") as string
                ),
                name: getValues("name"),
                department: getValues("department"),
                position: getValues("position"),
                role_codes: roles.map(role => {
                    return { employee_id: id, role_code: parseInt(role.value) };
                }),
                email: getValues("email"),
                contact: getValues("contact"),
                phone: getValues("phone"),
                note: getValues("note"),
            }),
        {
            onSuccess(data) {
                router.push(`${PATH.CLIENT.EMPLOYEE.MAIN}/${id}`);
            },
        }
    );
    const onClickEditEmployee = () => {
        editEmployeeMutate();
    };

    return (
        <VEmployeeForm
            {...props}
            register={register}
            control={control}
            errors={errors}
            onClickSubmit={handleSubmit(
                router.pathname === PATH.CLIENT.EMPLOYEE.REGISTER
                    ? onClickRegister
                    : onClickEditEmployee
            )}
            companyOptions={companyOptions}
            roleOptions={roleOptions}
            roles={roles}
            onClickAddRoleChip={onClickAddRoleChip}
            handleDeleteRoleChip={handleDeleteRoleChip}
        />
    );
};

export default EmployeeForm;
