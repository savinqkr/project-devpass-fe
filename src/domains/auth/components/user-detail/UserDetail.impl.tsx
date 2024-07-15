import { useRouter } from "next/router";
import { IUserDetail } from "./UserDetail.interface";
import VUserDetail from "./UserDetail.view";
import { useMutation, useQuery } from "react-query";
import employeeService from "@domains/employee/services/employee.service";
import PATH from "@constants/path";

const UserDetail: React.FC<IUserDetail.IProps> = props => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    // 사용자 상세 조회
    const { data: userData } = useQuery(
        ["get user by pk"],
        () =>
            employeeService.getEmployeeByPk({
                id,
            }),
        {
            enabled: !!id,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // 사용자 삭제
    const { mutate: deleteUserMutate } = useMutation(
        ["delete user by pk"],
        () =>
            employeeService.deleteEmployeeByPk({
                id,
            }),
        {
            onSuccess: result => {
                router.push(PATH.ADMIN.USER.MAIN);
            },
        }
    );
    const onClickDeleteUser = () => {
        if (confirm("사용자를 삭제하시겠습니까?")) {
            deleteUserMutate();
        }
    };

    const onClickEditUser = () => {
        router.push(`${PATH.ADMIN.USER.EDIT}/${id}`);
    };

    return (
        <VUserDetail
            {...props}
            userData={userData}
            onClickDeleteUser={onClickDeleteUser}
            onClickEditUser={onClickEditUser}
        />
    );
};

export default UserDetail;
