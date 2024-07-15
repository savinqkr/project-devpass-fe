import PATH from "@constants/path";
import { css } from "@emotion/react";
import { CircularProgress } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
    const router = useRouter();

    const hasToken: boolean =
        typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    // TOKEN 이 있으면 본사 페이지로 이동
    useEffect(() => {
        if (hasToken) {
            router.push(PATH.ADMIN.COMPANY.MAIN);
        }
    }, [hasToken]);

    return (
        <div css={rootStyle}>
            <CircularProgress />
        </div>
    );
};

export default Home;

const rootStyle = css`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
