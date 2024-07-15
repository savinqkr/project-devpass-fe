import { useForm } from "react-hook-form";
import { IUserForm } from "./UserForm.interface";
import VUserForm from "./UserForm.view";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import roleService from "@domains/role/services/role.service";
import authService from "@domains/auth/services/auth.service";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { Permission } from "@enums";
import employeeService from "@domains/employee/services/employee.service";

const UserForm: React.FC<IUserForm.IProps> = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const {
        setValue,
        getValues,
        watch,
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = useForm<IUserForm.IForm>();

    // 역할 옵션
    const [roleOptions, setRoleOptions] = useState<
        { value: string; label: string }[]
    >([]);
    useQuery(
        ["get role type"],
        () =>
            roleService.getAllRoleCode({
                where: { deleted_at: { _is_null: true } },
            }),
        {
            enabled: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options: { value: string; label: string }[] = [];
                data.role_code.forEach(option => {
                    if (!option.deleted_at) {
                        options.push({
                            value: `${option.code}`,
                            label: option.value,
                        });
                    }
                });
                setRoleOptions(options);
            },
        }
    );

    // 선택된 역할 코드 값
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const onClickAddRoleChip = () => {
        roleOptions.forEach(option => {
            const roleCodes = roles.map(role => role.value);
            if (
                option.value === getValues("selectedRoleCode") &&
                !roleCodes.includes(option.value)
            ) {
                setRoles([...roles, option]);
            }
        });
        setValue("selectedRoleCode", "default");
    };
    const handleDeleteRoleChip = (role: { value: string; label: string }) => {
        const updatedRoles = roles.filter(item => item.value !== role.value);
        setRoles(updatedRoles);
    };

    // 아이디 중복 확인 ( MUTATION )
    const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
    const { mutate: checkAccountIdMutate } = useMutation(
        ["check account id"],
        () =>
            authService.checkAccountIdAvailable({
                account_id: getValues("account_id"),
            }),
        {
            onSuccess(data, variables, context) {
                setIdAvailable(data);
            },
        }
        //             .then(result => {
        //                 setIdAvailable(result);
        //             })
    );
    const checkIdAvailable = () => {
        if (getValues("account_id") !== "") {
            checkAccountIdMutate();
        } else {
            alert("아이디를 입력해주세요.");
        }
    };
    useEffect(() => {
        const tempId = getValues("account_id");

        if (watch("account_id") === tempId) {
            setIdAvailable(null);
        }
    }, [watch("account_id")]);

    // 비밀번호 일치 확인
    const [isPwEqual, setIsPwEqual] = useState<boolean | null>(null);
    const [isPwFieldActive, setIsPwFieldActive] = useState<boolean>(false);
    const handleToggleSwitch = () => {
        setValue("account_pw", "");
        setValue("account_pw_check", "");
        setIsPwEqual(null);
        setIsPwFieldActive(!isPwFieldActive);
    };
    useEffect(() => {
        if (
            !!getValues("account_pw") &&
            !!getValues("account_pw_check") &&
            getValues("account_pw") !== "" &&
            getValues("account_pw_check") !== ""
        ) {
            router.pathname === PATH.ADMIN.USER.REGISTER
                ? setIsPwEqual(
                      getValues("account_pw") === getValues("account_pw_check")
                  )
                : isPwFieldActive &&
                  setIsPwEqual(
                      getValues("account_pw") === getValues("account_pw_check")
                  );
        }
    }, [watch("account_pw_check"), watch("account_pw")]);

    // 사용자 등록 ( MUTATION )
    const { mutate: registerUserMutate } = useMutation(["register user"], () =>
        authService
            .registerUser({
                permission: Permission.USER,
                account_id: getValues("account_id"),
                account_pw: getValues("account_pw"),
                name: getValues("name"),
                department: getValues("department"),
                position: getValues("position"),
                email: getValues("email"),
                contact: getValues("contact"),
                phone: getValues("phone"),
                roleCodes: roles.map(role => parseInt(role.value)),
            })
            .then(result => {
                router.push(
                    `${PATH.ADMIN.USER.MAIN}/${result.registerUser.id}`
                );
            })
    );
    const onClickRegister = () => {
        if (idAvailable && isPwEqual) {
            registerUserMutate();
        } else {
            alert("아이디 중복확인이 필요합니다.");
        }
    };

    // 사용자 상세 조회
    const { data: originalUserData } = useQuery(
        ["get original user data by pk"],
        () =>
            employeeService.getEmployeeByPk({
                id,
            }),
        {
            enabled: !!id,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const { name, department, position, email, contact, phone } =
                    data.employee_by_pk;
                setValue("name", name);
                setValue("department", department);
                setValue("position", position);
                setValue("email", email);
                setValue("contact", contact);
                setValue("phone", phone);
                const rolelist = data.employee_by_pk.roles.map(role => {
                    return {
                        value: `${role.role.code}`,
                        label: role.role.value,
                    };
                });
                setRoles(rolelist);
            },
        }
    );

    // 사용자 수정
    const { mutate: editEmployeeMutate } = useMutation(
        ["edit employee"],
        () =>
            authService.editUser({
                id: id,
                account_pw: getValues("account_pw"),
                name: getValues("name"),
                department: getValues("department"),
                position: getValues("position"),
                roleCodes: roles.map(role => parseInt(role.value)),
                email: getValues("email"),
                contact: getValues("contact"),
                phone: getValues("phone"),
            }),
        {
            onSuccess(data) {
                router.push(`${PATH.ADMIN.USER.MAIN}/${id}`);
            },
        }
    );
    const onClickEditEmployee = () => {
        editEmployeeMutate();
    };

    return (
        <VUserForm
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            getValues={getValues}
            onClickSubmit={handleSubmit(
                router.pathname === PATH.ADMIN.USER.REGISTER
                    ? onClickRegister
                    : onClickEditEmployee
            )}
            idAvailable={idAvailable}
            checkIdAvailable={checkIdAvailable}
            isPwEqual={isPwEqual}
            isPwFieldActive={isPwFieldActive}
            handleToggleSwitch={handleToggleSwitch}
            roleOptions={roleOptions}
            roles={roles}
            onClickAddRoleChip={onClickAddRoleChip}
            handleDeleteRoleChip={handleDeleteRoleChip}
        />
    );
};

export default UserForm;
