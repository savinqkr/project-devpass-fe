import { css } from "@emotion/react";
import { IUserDetail } from "./UserDetail.interface";
import {
    Avatar,
    Button,
    Chip,
    Divider,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import { DetailInfoRow } from "@common/components";
import { Colors } from "@configs/colors";
import { Permission, ScreenType } from "@enums";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { useRouter } from "next/router";

const VUserDetail: React.FC<IUserDetail.IVProps> = props => {
    const { userData, onClickDeleteUser, onClickEditUser } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    return (
        <div css={rootStyle(isMedium)}>
            <div className="section" id="profile-header">
                <div id="bg" />
                <Avatar id="avatar">
                    {userData?.employee_by_pk?.name.slice(0, 2)}
                </Avatar>
                <p id="name">{userData?.employee_by_pk?.name}</p>
                {/* {(loginUser.id === id ||
                    loginUser.permission === Permission.ADMIN) && (
                    <IconButton onClick={onClickEditUser} id="edit-btn">
                        <MdEdit className="icon"  css={{}}/>
                    </IconButton>
                )} */}
            </div>
            <div className="section">
                <DetailInfoRow
                    label="아이디"
                    value={userData?.employee_by_pk?.account_id}
                    tag={
                        userData?.employee_by_pk?.deleted_at && (
                            <Chip
                                label="Deleted"
                                sx={{
                                    height: 24,
                                    padding: "0px 4px",
                                    color: Colors.wildStrawberry,
                                    fontSize: "12px",
                                    backgroundColor: "rgba(255, 51, 99, 0.12)",
                                    border: "none",
                                }}
                            />
                        )
                    }
                />
                <DetailInfoRow
                    label="이름"
                    value={userData?.employee_by_pk?.name}
                />
                <div className="row-section">
                    <DetailInfoRow
                        label="부서"
                        value={userData?.employee_by_pk?.department}
                    />
                    <DetailInfoRow
                        label="직함"
                        value={userData?.employee_by_pk?.position}
                    />
                </div>
                <DetailInfoRow
                    label="역할"
                    children={
                        <>
                            {userData?.employee_by_pk?.roles.length !== 0 ? (
                                userData?.employee_by_pk.roles
                                    .filter(
                                        role => role.role.deleted_at === null
                                    )
                                    .map((role, idx) => (
                                        <Chip
                                            className="role-chip"
                                            key={`role-${idx}`}
                                            label={role.role?.value ?? ""}
                                            sx={{
                                                padding: "0px 4px",
                                                fontSize: 14,
                                                height: 28,
                                                color: Colors.deepPurple,
                                                backgroundColor:
                                                    Colors.lavenderPurple,
                                            }}
                                        />
                                    ))
                            ) : (
                                <span>-</span>
                            )}
                        </>
                    }
                />
                <DetailInfoRow
                    label="이메일"
                    value={userData?.employee_by_pk?.email}
                />
                <div className="row-section">
                    <DetailInfoRow
                        label="연락처"
                        value={userData?.employee_by_pk?.contact}
                    />
                    <DetailInfoRow
                        label="휴대폰 번호"
                        value={userData?.employee_by_pk?.phone}
                    />
                </div>
                <Divider />
            </div>
            <div className="btn-section">
                {(loginUser.id === id ||
                    loginUser.permission === Permission.ADMIN) && (
                    <Button
                        variant="outlined"
                        color="oceanBlue"
                        onClick={onClickEditUser}
                        startIcon={<MdEdit size={16} fontWeight={"light"} />}
                        sx={{ width: 100, fontSize: 13 }}
                    >
                        수정
                    </Button>
                )}
                {loginUser.permission === Permission.ADMIN &&
                    userData?.employee_by_pk.permission.value !==
                        Permission.ADMIN && (
                        <Button
                            variant="outlined"
                            color="wildStrawberry"
                            onClick={onClickDeleteUser}
                            startIcon={
                                <MdOutlineDelete
                                    size={16}
                                    fontWeight={"light"}
                                />
                            }
                            sx={{
                                width: 100,
                                fontSize: 13,
                                marginLeft: "10px",
                            }}
                        >
                            삭제
                        </Button>
                    )}
            </div>
        </div>
    );
};

export default VUserDetail;

const rootStyle = (isMedium: boolean) => css`
    #profile-header {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 240px;
        margin: 24px 0px 30px;
        #bg {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            background-color: ${Colors.charcoalGray};
            opacity: 50%;
            z-index: -1;
        }
    }
    #avatar {
        width: 100px;
        height: 100px;
        font-size: 32px;
        color: ${Colors.white};
        background-color: ${Colors.softGray};
    }
    #name {
        margin-top: 24px;
        font-size: 20px;
        font-weight: 500;
        color: ${Colors.white};
    }
    #edit-btn {
        z-index: 999;
        background-color: #808080;
        position: absolute;
        right: 20px;
        bottom: 20px;
        .icon {
            color: #000;
        }
    }
    .row-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
    }
    .role-chip {
        margin-right: 12px;
    }
    .btn-section {
        display: flex;
        flex-direction: row;
        justify-content: end;
        margin-top: 36px;
    }
`;
