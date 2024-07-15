import { css } from "@emotion/react";
import { IRoleDetail } from "./RoleDetail.interface";
import { Button, Chip, Divider, IconButton, Paper } from "@mui/material";
import { CgClose } from "react-icons/cg";
import { Colors } from "@configs/colors";
import { DetailInfoRow } from "@common/components";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const VRoleDetail: React.FC<IRoleDetail.IVProps> = props => {
    const { title, onClickClose, data, onClicEditRole, onClickDeleteRole } =
        props;
    return (
        <Paper css={rootStyle}>
            <div id="header">
                <div id="title">
                    <span>{title}</span>
                </div>
                <IconButton id="close-btn" onClick={onClickClose}>
                    <CgClose size={24} color={Colors.black} />
                </IconButton>
            </div>
            <div id="body">
                <DetailInfoRow
                    label="역할명"
                    value={data?.value}
                    tag={
                        data?.deleted_at && (
                            <Chip
                                label="Deleted"
                                sx={{
                                    height: 24,
                                    padding: "0px 4px",
                                    color: Colors.wildStrawberry,
                                    fontSize: "12px",
                                    backgroundColor: "rgba(255, 51, 99, 0.08)",
                                    border: "none",
                                }}
                            />
                        )
                    }
                />
                <DetailInfoRow
                    label="역할 구분"
                    value={data?.special_role ? data!.special_role!.value : "-"}
                />
                <Divider sx={{ width: "100%" }} />
                {!data?.deleted_at && (
                    <div id="btn-area">
                        <Button
                            className="btn"
                            variant="outlined"
                            color="wildStrawberry"
                            onClick={() =>
                                onClickDeleteRole(data!.code, data!.value)
                            }
                            startIcon={
                                <MdOutlineDelete
                                    size={16}
                                    fontWeight={"light"}
                                />
                            }
                        >
                            삭제
                        </Button>
                        <div css={{ width: "20px" }} />
                        <Button
                            className="btn"
                            variant="outlined"
                            color="oceanBlue"
                            onClick={onClicEditRole}
                            startIcon={
                                <MdOutlineEdit size={16} fontWeight={"light"} />
                            }
                        >
                            수정
                        </Button>
                    </div>
                )}
            </div>
        </Paper>
    );
};

export default VRoleDetail;

const rootStyle = css`
    border-radius: 12px;
    width: 500px;
    height: 360px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    #header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 16px;
        padding: 0px 10px 0px 30px;
    }

    #title {
        font-size: 20px;
        font-weight: 600;
        color: ${Colors.charcoalGray};
    }

    #body {
        width: 100%;
        padding: 0px 30px;

        #btn-area {
            display: flex;
            flex-direction: row;
            justify-content: end;
            position: absolute;
            bottom: 30px;
            right: 30px;

            .btn {
                width: 90px;
                height: 32px;
                font-size: 12px;
            }
        }
    }
`;
