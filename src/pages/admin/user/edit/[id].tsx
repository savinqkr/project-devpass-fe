import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import { UserForm } from "@domains/auth";
import loginState from "@recoils/login-state.atom";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const UserEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    // useEffect(() => {
    //     if (!!loginUser && !!id && (loginUser.id as number) !== id) {
    //         router.back();
    //     }
    // }, [id, loginUser]);

    return (
        <BasicTemplate>
            <PageTitle
                title="사용자 수정"
                isVisible={true}
                path={`${PATH.ADMIN.USER.MAIN}/${id}`}
            />
            <UserForm />
        </BasicTemplate>
    );
};

export default UserEdit;
