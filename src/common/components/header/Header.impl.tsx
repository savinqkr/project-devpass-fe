import React, { useEffect } from "react";
import { IHeader } from "./Header.interface";
import VHeader from "./Header.view";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import useSessionCounter from "@hooks/useSessionCounter";
import drawerState from "@recoils/drawer-state.atom";
import loginState from "@recoils/login-state.atom";
import { useMutation } from "react-query";
import authService from "@domains/auth/services/auth.service";
import useParseJwt from "@hooks/useParseJwt";
import currentMenuState from "@recoils/current-menu-state.atom";

const Header: React.FC<IHeader.IProps> = () => {
    const router = useRouter();

    const hasToken: boolean =
        typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    const [loginUser, setLoginUser] = useRecoilState(loginState);
    const resetLoginUser = useResetRecoilState(loginState);

    // SESSION COUNTER
    // var session = useSessionCounter(Number(loginUser?.exp)) ?? "";
    // const getSessionBarValue = (time: string) => {
    //     const [hours, minutes, seconds] = time.split(":");
    //     const sessionToSeconds =
    //         parseInt(hours, 10) * 3600 +
    //         parseInt(minutes, 10) * 60 +
    //         parseInt(seconds, 10);
    //     const maxSessionSeconds = 24 * 3600;

    //     return (sessionToSeconds / maxSessionSeconds) * 100;
    // };

    // SESSION REFRESH
    // const { data: refreshJwtData, mutate: refreshJwtMutate } = useMutation(
    //     ["refreshJwt"],
    //     () =>
    //         authService.refreshJwt({
    //             refreshToken: window.localStorage.getItem("refreshToken") ?? "",
    //         })
    // );

    // const onClickRefreshSession = () => {
    //     refreshJwtMutate();
    // };

    // useEffect(() => {
    //     if (!refreshJwtData) return;
    //     if (typeof window !== "undefined" && refreshJwtData) {
    //         const { accessToken, refreshToken } = refreshJwtData.refreshJwt;
    //         window.localStorage.setItem("accessToken", accessToken);
    //         window.localStorage.setItem("refreshToken", refreshToken);
    //         if (accessToken) {
    //             const userInfo = useParseJwt(accessToken, !hasToken);
    //             setLoginUser(userInfo);
    //         }
    //     }
    // }, [refreshJwtData]);

    // USER BUTTON
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // CURRENT MENU
    const resetCurrentMenuState = useResetRecoilState(currentMenuState);
    // MENU DRAWER
    const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(drawerState);

    // LOGOUT
    const onClickLogout = () => {
        handleClose();
        resetCurrentMenuState();
        setIsDrawerOpen(false);
        const answer = confirm("로그아웃 하시겠습니까?");
        if (answer) {
            router.push(PATH.LOGIN);
            resetLoginUser();
            // window.localStorage.clear();
        }
    };

    return (
        <VHeader
            open={open}
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
            onClickLogout={onClickLogout}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            // session={session}
            // sessionBarValue={getSessionBarValue(session)}
            // onClickRefreshSession={onClickRefreshSession}
        />
    );
};

export default Header;
