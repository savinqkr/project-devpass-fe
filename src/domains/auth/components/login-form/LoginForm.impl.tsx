import { useForm } from "react-hook-form";
import { ILoginForm } from "./LoginForm.interface";
import VLoginForm from "./LoginForm.view";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { useMutation } from "react-query";
import authService from "@domains/auth/services/auth.service";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";
import useParseJwt from "@hooks/useParseJwt";

const LoginForm: React.FC<ILoginForm.IProps> = () => {
    const router = useRouter();
    const { register, handleSubmit, getValues } = useForm<ILoginForm.IForm>();

    // PASSWORD
    const [isPwVisible, setIsPwVisible] = useState<boolean>(false);
    const onClickShowPw = () => {
        setIsPwVisible(!isPwVisible);
    };

    // LOGIN
    const {
        data: loginData,
        mutate: loginMutate,
        isSuccess,
    } = useMutation(["login"], () =>
        authService.login({
            id: getValues("id"),
            password: getValues("password"),
        })
    );

    const onClickLogin = () => {
        loginMutate();
    };

    const [loginUser, setLoginUser] = useRecoilState(loginState);
    useEffect(() => {
        if (loginData && typeof window !== "undefined") {
            const { accessToken, refreshToken } = loginData.login;
            window.localStorage.setItem("accessToken", accessToken);
            window.localStorage.setItem("refreshToken", refreshToken);

            if (accessToken) {
                const userInfo = useParseJwt(accessToken, false);
                setLoginUser(userInfo);
            }
        }
    }, [loginData]);

    useEffect(() => {
        if (!!loginUser.id) {
            router.push(PATH.ADMIN.COMPANY.MAIN);
        } else {
            window.localStorage.clear();
        }
    }, [loginUser]);

    return (
        <VLoginForm
            register={register}
            onClickLogin={handleSubmit(onClickLogin)}
            isPwVisible={isPwVisible}
            onClickShowPw={onClickShowPw}
        />
    );
};

export default LoginForm;
