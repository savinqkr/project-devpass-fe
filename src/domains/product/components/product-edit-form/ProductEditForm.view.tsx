import { css } from "@emotion/react";
import { IProductEditForm } from "./ProductEditForm.interface";
import { BasicSelector, BasicTextField } from "@common/components";
import BasicMoneyField from "@common/components/basic-moneyfield";
import Divider from "@mui/material/Divider";
import { Button, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import { useRouter } from "next/router";

const VProductEditForm: React.FC<IProductEditForm.IVProps> = props => {
    const {
        register,
        errors,
        control,
        onClickUpdate,
        typeOptions,
        purposeOptions,
        classOptions,
        unitOptions,
    } = props;
    const router = useRouter();
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off" onSubmit={onClickUpdate}>
                <div className="section">
                    <BasicSelector
                        control={control}
                        registerKey="type"
                        isRequired={true}
                        options={typeOptions}
                        spaceWidth="1vw"
                        label="구분"
                        width={isMedium ? "100%" : "48%"}
                        msg="구분을 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="row-section">
                    <BasicSelector
                        control={control}
                        registerKey="purpose"
                        isRequired={true}
                        options={purposeOptions}
                        spaceWidth="1vw"
                        label="용도"
                        msg="용도를 선택해주세요."
                    />
                    {isMedium ? (
                        <Divider className="divider" />
                    ) : (
                        <div className="space"></div>
                    )}
                    <BasicSelector
                        control={control}
                        registerKey="class"
                        isRequired={true}
                        options={classOptions}
                        spaceWidth="1vw"
                        label="Class"
                        msg="Class를 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="name"
                        spaceWidth="1vw"
                        isRequired={true}
                        label="품목명"
                        isErrMsg={true}
                        errors={errors}
                        msg={"품목명을 입력해주세요."}
                        width={isMedium ? "100%" : "48%"}
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicSelector
                        control={control}
                        registerKey="unit"
                        isRequired={true}
                        options={unitOptions}
                        spaceWidth="1vw"
                        label="단위"
                        width={isMedium ? "100%" : "48%"}
                        msg="단위를 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicMoneyField
                        spaceWidth="1vw"
                        isRequired={true}
                        label="단가"
                        control={control}
                        registerKey="price"
                        width={isMedium ? "100%" : "48%"}
                        endAdornment="원"
                        errMsg="단가를 입력해주세요."
                    />
                </div>
                <Divider className="divider" />

                {/* <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="edition"
                        spaceWidth="1vw"
                        isRequired={true}
                        label="에디션"
                        showMsg={true}
                        isErrMsg={true}
                        errors={errors}
                        msg={"에디션을 입력해주세요."}
                        width={isMedium ? "100%" : "48%"}
                    />
                </div>

                <Divider className="divider" /> */}
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="note"
                        spaceWidth="1vw"
                        isRequired={false}
                        isMultiline={true}
                        minRows={6}
                        label="비고"
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
                        }}
                        onClick={() => router.back()}
                    >
                        취소
                    </Button>
                    <div className="space" />
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

export default VProductEditForm;

const rootStyle = (isMedium: boolean) => css`
    margin-top: 10px;

    .divider {
        margin: 10px 0px;
    }

    .section {
        padding: 0px 20px;
    }
    .row-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
        padding: 0px 20px;

        .space {
            width: 6vw;
        }
    }
    .space {
        width: 10px;
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
