import { css } from "@emotion/react";
import BasicButton from "@common/components/basic-button";
import { ButtonType, ScreenType } from "@enums";
import { BasicSelector, BasicTextField } from "@common/components";
import { IProductRegisterForm } from "./ProductRegisterForm.interface";
import BasicMoneyField from "@common/components/basic-moneyfield/BasicMoneyField.impl";
import Divider from "@mui/material/Divider";
import { Button, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const VProductRegisterForm: React.FC<IProductRegisterForm.IVProps> = props => {
    const {
        errors,
        register,
        control,
        onSubmit,
        typeOptions,
        purposeOptions,
        classOptions,
        unitOptions,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off" onSubmit={onSubmit}>
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
                        width={isMedium ? "100%" : "48%"}
                        msg="용도를 선택해주세요."
                    />
                    {isMedium ? (
                        <Divider className="divider" />
                    ) : (
                        <div className="space" />
                    )}
                    <BasicSelector
                        control={control}
                        registerKey="class"
                        isRequired={true}
                        options={classOptions}
                        spaceWidth="1vw"
                        label="Class"
                        width={isMedium ? "100%" : "48%"}
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
                        // showMsg={true}
                        isErrMsg={true}
                        msg={"품목명을 입력해주세요."}
                        width={isMedium ? "100%" : "48%"}
                        errors={errors}
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
                        registerKey="price"
                        control={control}
                        spaceWidth="1vw"
                        isRequired={true}
                        label="단가"
                        width={isMedium ? "100%" : "48%"}
                        errMsg="단가를 입력해주세요."
                        endAdornment="원"
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
                        msg={"에디션을 입력해주세요."}
                        width={isMedium ? "100%" : "48%"}
                        errors={errors}
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
                            marginRight: "10px",
                        }}
                        onClick={() => router.push(PATH.PRODUCT.MAIN)}
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
                        등록
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VProductRegisterForm;

const rootStyle = (isMedium: boolean) => css`
    margin-top: 10px;

    .divider {
        margin: 10px 0px;
    }

    .row-section {
        display: flex;
        justify-content: space-between;
        flex-direction: ${isMedium ? "column" : "row"};
        padding: 0px 20px;
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
