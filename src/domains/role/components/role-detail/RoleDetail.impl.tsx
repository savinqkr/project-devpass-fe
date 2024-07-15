import roleService from "@domains/role/services/role.service";
import { IRoleDetail } from "./RoleDetail.interface";
import VRoleDetail from "./RoleDetail.view";
import { useMutation, useQuery } from "react-query";
import { ModalMode } from "@enums";

const RoleDetail: React.FC<IRoleDetail.IProps> = props => {
    const { code, setIsExecuted, isExecuted, onClickClose, setModalMode } =
        props;

    // ------------------------------------------------
    // 역할 상세 조회 ( QUERY )
    // ------------------------------------------------
    const { data: roleData } = useQuery(
        ["get role data by pk"],
        () => roleService.getRoleCodeByPk({ code: code! }),
        {
            enabled: typeof code === "number",
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // 역할 수정 모달로 전환
    const onClicEditRole = () => {
        setModalMode(ModalMode.EDIT);
    };

    // ------------------------------------------------
    // 역할 삭제 ( MUTATION )
    // ------------------------------------------------
    const { mutate: deleteRoleMutate } = useMutation(
        ["delete role code"],
        (code: number) =>
            roleService
                .deleteRoleCode({
                    code,
                })
                .then(() => {
                    setIsExecuted(!isExecuted);
                })
    );
    const onClickDeleteRole = (code: number, value: string) => {
        if (confirm(`${value}을(를) 삭제하시겠습니까?`)) {
            deleteRoleMutate(code);
            onClickClose();
        }
    };

    return (
        <VRoleDetail
            {...props}
            data={roleData?.role_code_by_pk}
            onClickDeleteRole={onClickDeleteRole}
            onClicEditRole={onClicEditRole}
        />
    );
};

export default RoleDetail;
