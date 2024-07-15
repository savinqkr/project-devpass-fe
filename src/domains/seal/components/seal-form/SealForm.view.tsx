import { css } from "@emotion/react";
import { ISealForm } from "./SealForm.interface";
import { Button, Divider, IconButton, Paper } from "@mui/material";
import { CgClose } from "react-icons/cg";
import { Colors } from "@configs/colors";
import { AttachmentInput } from "@common/components";
import { ModalMode } from "@enums";

const VSealForm: React.FC<ISealForm.IVProps> = props => {
    const {
        register,
        errors,
        onClickSubmit,
        onClickClose,
        seal,
        setSeal,
        title,
        mode,
        isDisabled,
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
            <form id="form-area" autoComplete="off" onSubmit={onClickSubmit}>
                <div className="section">
                    <AttachmentInput
                        register={register}
                        registerKey="seal"
                        spaceWidth="1vw"
                        isRequired={true}
                        isMultiple={false}
                        label="인감"
                        htmlFor="seal-attach"
                        errors={errors}
                        files={seal}
                        setFiles={setSeal}
                    />
                </div>
                <div className="btn-section">
                    <Button
                        type="submit"
                        variant="contained"
                        color="black"
                        sx={{
                            width: 240,
                            height: 36,
                            fontSize: 13,
                            borderRadius: 40,
                        }}
                        disabled={isDisabled}
                    >
                        {mode === ModalMode.REGISTER ? "등록" : "수정"}
                    </Button>
                </div>
            </form>
        </Paper>
    );
};

export default VSealForm;

const rootStyle = css`
    border-radius: 10px;
    width: 500px;
    height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .divider {
        width: 100%;
    }

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
        height: 60%;
        padding: 0px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .section {
        width: 100%;
        height: 100%;
        padding: 10px 4px;
        border-top: 1px solid #e2e2e2;
        border-bottom: 1px solid #e2e2e2;
    }

    .btn-section {
        position: absolute;
        bottom: 30px;
    }
`;
