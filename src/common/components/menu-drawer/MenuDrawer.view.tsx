import { css } from "@emotion/react";
import { IMenuDrawer } from "./MenuDrawer.interface";
import { Avatar, Button, Divider, Drawer, IconButton } from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import Menu from "../menu";
import { Colors } from "@configs/colors";
import { useRecoilState } from "recoil";
import drawerState from "@recoils/drawer-state.atom";
import userState from "@recoils/login-state.atom";

const VMenuDrawer: React.FC<IMenuDrawer.IVProps> = props => {
    const { onClickLogout } = props;
    const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(drawerState);
    const [loginUser, setLoginUser] = useRecoilState(userState);
    return (
        <Drawer
            css={rootStyle}
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
        >
            <div className="btn-group">
                <IconButton onClick={() => setIsDrawerOpen(false)}>
                    <IoCloseOutline size={28} color={Colors.gray} />
                </IconButton>
            </div>
            <div className="user-info">
                <Avatar id="avator" sx={{ width: 80, height: 80 }} />
                <p id="username">{loginUser.name}</p>
                <Button
                    id="logout-btn"
                    variant="outlined"
                    color="charcoalGray"
                    onClick={() => onClickLogout()}
                    sx={{
                        width: 96,
                        height: 28,
                        borderRadius: 20,
                        fontSize: 11,
                        textAlign: "center",
                    }}
                >
                    로그아웃
                </Button>
            </div>
            <Divider />
            <Menu />
        </Drawer>
    );
};

export default VMenuDrawer;

const rootStyle = css`
    .btn-group {
        padding: 4px 4px 0px;
        display: flex;
        flex-direction: row;
        justify-content: start;
    }
    .user-info {
        padding: 24px 0px 30px;
        display: flex;
        flex-direction: column;
        align-items: center;

        #username {
            margin: 20px 0px 24px;
            font-size: 17px;
            color: ${Colors.charcoalGray};
        }
    }
`;
