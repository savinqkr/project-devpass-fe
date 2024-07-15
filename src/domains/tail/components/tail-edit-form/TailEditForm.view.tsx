import { css } from "@emotion/react";
import { Button, Divider } from "@mui/material";
import BasicButton from "@common/components/basic-button";
import { ButtonType } from "@enums";
import { BasicTextField, BasicSelector } from "@common/components";
import { ITailEditForm } from "./TailEditForm.interface";
import BasicMarkdown from "@common/components/basic-markdown/BasicMarkdown.impl";

const VTailEditForm: React.FC<ITailEditForm.IVProps> = props => {
    const {
        errors,
        register,
        control,
        onClickUpdate,
        onClickCancel,
        typeOptions,
    } = props;

    return (
        <div css={rootStyle}>
            <form autoComplete="off" onSubmit={onClickUpdate}>
                <div className="section half-section">
                    <BasicSelector
                        control={control}
                        registerKey="type"
                        isRequired={true}
                        options={typeOptions}
                        spaceWidth="1vw"
                        label="구분"
                        msg="구분을 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="name"
                        spaceWidth="1vw"
                        isRequired={true}
                        label="TAIL 명"
                        isErrMsg={true}
                        errors={errors}
                        msg="TAIL 명을 입력해주세요."
                    />
                </div>

                <Divider className="divider" />
                <div className="section">
                    <BasicMarkdown
                        control={control}
                        registerKey="contents"
                        spaceWidth="1vw"
                        label="TAIL 내용"
                        isRequired
                        errMsg="TAIL 내용을 입력해주세요."
                    />
                </div>
                <div className="btn-section">
                    <Button
                        variant="outlined"
                        color="black"
                        disableElevation
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                            marginRight: "10px",
                        }}
                        onClick={onClickCancel}
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        color="black"
                        disableElevation
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        type="submit"
                    >
                        수정
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VTailEditForm;

const rootStyle = css`
    margin-top: 10px;

    .divider {
        margin: 10px 0px;
    }

    .section {
        padding: 0px 20px;
    }

    .btn-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        margin-top: 60px;
    }
`;
