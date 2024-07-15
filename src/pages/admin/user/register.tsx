import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import { UserForm } from "@domains/auth";
import { Permission } from "@enums";
import loginState from "@recoils/login-state.atom";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

const UserRegister: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    useEffect(() => {
        if (!!loginUser && loginUser.permission !== Permission.ADMIN) {
            router.back();
        }
    }, [loginUser]);

    return (
        <BasicTemplate>
            <PageTitle
                title="사용자 등록"
                isVisible={false}
                path={PATH.ADMIN.USER.MAIN}
            />
            <UserForm />
        </BasicTemplate>
    );
};

export default UserRegister;
