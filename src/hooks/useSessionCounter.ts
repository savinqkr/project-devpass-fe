import PATH from "@constants/path";
import userState from "@recoils/login-state.atom";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useResetRecoilState } from "recoil";

export default function useSessionCounter(expireTime: number): void | string {
    const router = useRouter();
    const [time, setTime] = useState(new Date());

    const resetLoginUser = useResetRecoilState(userState);

    useEffect(() => {
        const now = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(now);
    }, []);

    if (time.getTime() > expireTime * 1000) {
        resetLoginUser();
        alert("세션이 만료되었습니다.");
        router.push(PATH.LOGIN); // 로그인 페이지 이동 후, 로컬 스토리지 CLEAR
    }

    const expTime = dayjs(expireTime * 1000);
    const nowTime = dayjs(time.getTime());

    const diffToSeconds = expTime.diff(nowTime, "seconds");

    const hours = Math.floor(diffToSeconds / 3600);
    const minutes = Math.floor((diffToSeconds % 3600) / 60);
    const seconds = diffToSeconds % 60;

    const formateTime = (time: number) => {
        const timeToString = `${time}`;
        if (timeToString.length === 1) {
            return `0${timeToString}`;
        } else {
            return timeToString;
        }
    };

    return `${formateTime(hours)}:${formateTime(minutes)}:${formateTime(
        seconds
    )}`;
}
