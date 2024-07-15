import type { NextPage } from "next";
import Image from "next/image";
import { css } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import LoginForm from "@domains/auth/components/login-form";

const Login: NextPage = () => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <Image
                id="background"
                src={"/images/background.webp"}
                alt="설명"
                priority
                layout="fill"
                loading="eager"
            />
            <div className="login-group">
                <Image
                    src={"/images/data2tech.webp"}
                    alt="설명"
                    width={360}
                    height={360 * 0.45}
                    priority
                    loading="eager"
                />
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    align-items: center;

    .background {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -999;
    }
    .login-group {
        width: ${isMedium ? "60vW" : "36vw"};
        height: 78vh;
        margin-top: 10vh;
        padding-top: 40px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* border: 1.5px solid #fefefe20;
        border-radius: 24px;
        background-color: #fefefe13; */
    }
`;
