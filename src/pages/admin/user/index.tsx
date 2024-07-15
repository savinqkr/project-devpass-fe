import { css } from "@emotion/react";
import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { Colors } from "@configs/colors";
import { UserList } from "@domains/auth";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { Permission } from "@enums";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";

const User: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="전체 사용자" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>사용자</span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => {
                            if (loginUser.permission === Permission.USER) {
                                alert("관리자 권한의 계정으로 로그인해주세요.");
                            } else {
                                router.push(PATH.ADMIN.USER.REGISTER);
                            }
                        }}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <UserList />
            </div>
        </BasicTemplate>
    );
};

export default User;

const rootStyle = css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }

    .menu-info {
        color: ${Colors.gray};
    }

    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }
`;
