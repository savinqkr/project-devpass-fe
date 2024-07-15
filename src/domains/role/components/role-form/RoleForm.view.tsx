import { css } from "@emotion/react";
import { Button, IconButton, Paper } from "@mui/material";
import { Colors } from "@configs/colors";
import { CgClose } from "react-icons/cg";
import { BasicTextField, RadioBtnField } from "@common/components";
import { IRoleForm } from "./RoleForm.interface";
import { ModalMode } from "@enums";

const VRoleForm: React.FC<IRoleForm.IVProps> = props => {
    const {
        control,
        specialRoleOptions,
        title,
        onClickClose,
        errors,
        register,
        onClickRegister,
        onClickEdit,
        mode,
    } = props;

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
            <form
                id="form-area"
                autoComplete="off"
                onSubmit={
                    mode === ModalMode.REGISTER ? onClickRegister : onClickEdit
                }
            >
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="value"
                        spaceWidth="0px"
                        isRequired="역할명을 입력해주세요"
                        label="역할명"
                        errors={errors}
                    />
                </div>
                <div className="section">
                    <RadioBtnField
                        control={control}
                        registerKey="special_role_code"
                        label="역할 구분"
                        spaceWidth="1vw"
                        options={specialRoleOptions}
                        defaultValue={-1}
                    />
                </div>
                <div className="btn-section">
                    <Button
                        type="submit"
                        variant="contained"
                        color="black"
                        disableElevation
                        sx={{
                            width: 240,
                            height: 36,
                            fontSize: 13,
                            borderRadius: 40,
                        }}
                    >
                        {mode === ModalMode.REGISTER ? "등록" : "수정"}
                    </Button>
                </div>
            </form>
        </Paper>
    );
};

export default VRoleForm;

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

    #form-area {
        width: 100%;
        padding: 0px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #switch-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    #switch-head {
        width: 100px;
        display: flex;
        flex-direction: row;
        align-items: center;
        #label {
            color: ${Colors.gray};
            margin-right: 16px;
            white-space: pre-line;
            line-height: 1.6;
            font-size: 14px;
        }
        #star {
            color: ${Colors.wildStrawberry};
        }
    }

    .section {
        margin-bottom: 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .btn-section {
        position: absolute;
        bottom: 30px;
    }
`;
