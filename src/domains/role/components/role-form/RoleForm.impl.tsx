import { useForm } from "react-hook-form";
import VRoleForm from "./RoleForm.view";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import roleService from "@domains/role/services/role.service";
import { IRoleForm } from "./RoleForm.interface";
import { ModalMode } from "@enums";
import codeService from "@common/services/code/code.service";
import { CodeCategory } from "src/enums/code_category.enum";

const RoleForm: React.FC<IRoleForm.IProps> = props => {
    const { isExecuted, setIsExecuted, mode, code, onClickClose } = props;

    const {
        watch,
        control,
        getValues,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<IRoleForm.IForm>();

    // SWITCH
    const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSwitchOn(event.target.checked);
    };

    // 특별 역할 옵션
    const [specialRoleOptions, setSpecialRoleOptions] = useState<
        { label: string; value: number }[]
    >([]);
    useQuery(
        ["get special role common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.SPECIAL_ROLE_TYPE },
                },
            }),
        {
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options = data.common_code.map(code => ({
                    label: code.value,
                    value: code.code,
                }));
                setSpecialRoleOptions([
                    { label: "없음", value: -1 },
                    ...options,
                ]);
            },
        }
    );

    // ------------------------------------------------
    // 역할 등록 ( MUTATION )
    // ------------------------------------------------
    const { mutate: registerRoleMutate } = useMutation(
        ["register role code", isExecuted],
        () =>
            roleService
                .registerRoleCode({
                    value: getValues("value"),
                    special_role_code:
                        parseInt(getValues("special_role_code")) === -1
                            ? undefined
                            : parseInt(getValues("special_role_code")),
                })
                .then(() => {
                    setIsExecuted(!isExecuted);
                    onClickClose();
                })
    );

    const onClickRegisterRole = () => {
        registerRoleMutate();
    };

    // ------------------------------------------------
    // 역할 상세 조회 ( QUERY )
    // ------------------------------------------------
    const { refetch: fetchOriginalRoleData } = useQuery(
        ["get original role data by pk", isExecuted],
        () => roleService.getRoleCodeByPk({ code: code! }),
        {
            enabled: false,
            onSuccess(data) {
                setValue("value", data.role_code_by_pk.value);
                setValue(
                    "special_role_code",
                    `${
                        data.role_code_by_pk.special_role
                            ? data.role_code_by_pk.special_role.code
                            : -1
                    }`
                );
            },
        }
    );

    useEffect(() => {
        if (mode === ModalMode.EDIT && typeof code === "number") {
            fetchOriginalRoleData();
        }
    }, []);

    // ------------------------------------------------
    // 역할 수정 ( MUTATION )
    // ------------------------------------------------
    const { mutate: updateRoleMutate } = useMutation(
        ["update role code", isExecuted],
        () =>
            roleService.editRoleCode({
                code: code!,
                value: getValues("value"),
                special_role_code:
                    parseInt(getValues("special_role_code")) === -1
                        ? undefined
                        : parseInt(getValues("special_role_code")),
            }),
        {
            onSuccess(data, variables, context) {
                setIsExecuted(!isExecuted);
                onClickClose();
            },
        }
    );
    const onClicEditRole = () => {
        updateRoleMutate();
    };

    return (
        <VRoleForm
            {...props}
            errors={errors}
            control={control}
            register={register}
            onClickRegister={handleSubmit(onClickRegisterRole)}
            onClickEdit={handleSubmit(onClicEditRole)}
            specialRoleOptions={[...specialRoleOptions]}
        />
    );
};

export default RoleForm;
