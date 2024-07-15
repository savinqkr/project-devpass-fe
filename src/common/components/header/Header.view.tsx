import { css } from "@emotion/react";
import {
    Button,
    Divider,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    alpha,
    useMediaQuery,
} from "@mui/material";
import { MdRefresh } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { IHeader } from "./Header.interface";
import { Colors } from "@configs/colors";
import { Permission, ScreenType } from "@enums";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuDrawer from "../menu-drawer";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "@recoils/login-state.atom";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const VHeader: React.FC<IHeader.IVProps> = props => {
    const {
        open,
        anchorEl,
        handleClick,
        handleClose,
        onClickLogout,
        setIsDrawerOpen,
        // session,
        // sessionBarValue,
        // onClickRefreshSession,
    } = props;

    const router = useRouter();
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const loginUser = useRecoilValue(userState);

    return (
        <div css={rootStyle}>
            {/* SESSION INFO */}
            <div css={sessionBoxStyle}>
                {/* <div className="session-box">
                    <LinearProgress
                        className="session-bar"
                        value={sessionBarValue}
                        variant="determinate"
                    />
                    <p>{session}</p>
                </div>
                <IconButton css={iconBtnStyle} onClick={onClickRefreshSession}>
                    <MdRefresh className="icon" />
                </IconButton> */}
            </div>
            {/* TITLE */}
            {!isMedium && <p>사내 업무 관리 시스템</p>}
            {isMedium ? (
                <React.Fragment key={"right"}>
                    <Button
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{
                            width: 20,
                            position: "absolute",
                            right: 8,
                        }}
                    >
                        <MenuIcon
                            sx={{
                                color: Colors.creamyWhite,
                                width: 20,
                                height: 20,
                            }}
                        />
                    </Button>
                    <MenuDrawer onClickLogout={onClickLogout} />
                </React.Fragment>
            ) : (
                // USER BUTTON
                <div>
                    <Button
                        css={menuBtnStyle}
                        onClick={handleClick}
                        variant="contained"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <div>
                            <span>{loginUser.name}</span>
                        </div>
                        <div className="btn">
                            {open ? (
                                <IoChevronUp className="btn-icon" />
                            ) : (
                                <IoChevronDown className="btn-icon" />
                            )}
                        </div>
                    </Button>
                    <Menu
                        elevation={2}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                        disableScrollLock
                    >
                        {loginUser.permission !== Permission.ADMIN && (
                            <div>
                                <MenuItem
                                    css={menuItemStyle}
                                    onClick={() => {
                                        router.push(
                                            `${PATH.ADMIN.USER.MAIN}/${loginUser.id}`
                                        );
                                    }}
                                >
                                    <GoPerson />
                                    <span>내 프로필</span>
                                </MenuItem>
                                <Divider />
                            </div>
                        )}
                        <MenuItem css={menuItemStyle} onClick={onClickLogout}>
                            <MdLogout />
                            <span>로그아웃</span>
                        </MenuItem>
                    </Menu>
                </div>
            )}
        </div>
    );
};

export default VHeader;

const rootStyle = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 20px;
    background-color: ${Colors.charcoalGray};
    font-size: 16px;
    font-weight: 100;
    color: ${Colors.creamyWhite};
`;

const sessionBoxStyle = css`
    width: 210px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: ${alpha(Colors.creamyWhite, 0.8)};

    .session-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .session-bar {
        width: 100px;
        height: 6px;
        border-radius: 6px;
        margin-right: 12px;
    }
`;

const iconBtnStyle = css`
    width: 28px;
    height: 28px;
    background-color: rgba(253, 253, 253, 0.1);
    .icon {
        color: ${Colors.creamyWhite};
    }
    &:hover {
        background-color: rgba(253, 253, 253, 0.3);
    }
`;
const menuBtnStyle = css`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 30px;
    border-radius: 18px;
    background-color: ${Colors.black};
    font-size: 13px;
    &:hover {
        background-color: ${Colors.black};
    }

    .btn {
        width: 28px;
        height: 28px;
        position: absolute;
        right: 8px;
        top: 6px;
        .btn-icon {
            color: ${Colors.creamyWhite};
        }
    }
`;

const menuItemStyle = css`
    width: 140px;
    font-size: 14px;

    span {
        margin-left: 10px;
    }
`;
