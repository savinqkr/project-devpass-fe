import { css } from "@emotion/react";
import { IHeadOfficeForm } from "./HeadOfficeForm.interface";
import { ScreenType } from "@enums";
import { Button, Divider, useMediaQuery } from "@mui/material";
import {
    AttachmentInput,
    BasicTextField,
    FormattedTextfield,
    TableWithLabel,
} from "@common/components";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const VHeadOfficeForm: React.FC<IHeadOfficeForm.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const router = useRouter();

    const {
        control,
        register,
        onClickSubmit,
        errors,
        // 사업자등록증
        license,
        setLicense,
        // 통장사본
        passbookApiRef,
        columns,
        passbookRows,
        setPassbookRows,
        handleClickDeleteRow,
        handleClickAddRow,
    } = props;

    return (
        <div css={rootStyle}>
            <form autoComplete="off" onSubmit={onClickSubmit}>
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="name"
                        spaceWidth="1vw"
                        isRequired={true}
                        label="법인명"
                        errors={errors}
                        msg={"법인명을 입력해주세요."}
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="president"
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        isRequired={true}
                        label="대표자"
                        errors={errors}
                        msg={"대표자를 입력해주세요."}
                    />
                </div>
                <Divider className="divider" />
                {isMedium ? (
                    <>
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="busi_no"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="사업자번호"
                                placeholder="XXX-XX-XXXXX"
                                msg={"사업자번호를 입력해주세요."}
                                mask={[{ mask: "000-00-00000" }]}
                                name="busi_no"
                            />
                        </div>
                        <Divider className="divider" />
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="regist_no"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="법인등록번호"
                                placeholder="AAAABB-CCCCCCD"
                                msg={"법인등록번호를 입력해주세요."}
                                mask={[{ mask: "000000-0000000" }]}
                                name="regist_no"
                            />
                        </div>
                    </>
                ) : (
                    <div className={"row-section"}>
                        <FormattedTextfield
                            control={control}
                            registerKey="busi_no"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="사업자번호"
                            placeholder="XXX-XX-XXXXX"
                            msg={"사업자번호를 입력해주세요."}
                            mask={[{ mask: "000-00-00000" }]}
                            name="busi_no"
                        />
                        <div className="space" />
                        <FormattedTextfield
                            control={control}
                            registerKey="regist_no"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="법인등록번호"
                            placeholder="AAAABB-CCCCCCD"
                            msg={"법인등록번호를 입력해주세요."}
                            mask={[{ mask: "000000-0000000" }]}
                            name="regist_no"
                        />
                    </div>
                )}
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="address"
                        spaceWidth="1vw"
                        isRequired={true}
                        label="주소"
                        errors={errors}
                        msg={"주소를 입력해주세요."}
                    />
                </div>
                <Divider className="divider" />
                {isMedium ? (
                    <>
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="contact"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="연락처"
                                placeholder="(0)00-0000-0000"
                                msg={"연락처를 입력해주세요."}
                                mask={[
                                    { mask: "00-000-0000" },
                                    { mask: "00-0000-0000" },
                                    { mask: "000-000-0000" },
                                    { mask: "000-0000-0000" },
                                ]}
                                name="contact"
                            />
                        </div>
                        {/* <BasicTextField
                                register={register}
                                registerKey="contact"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="연락처"
                                errors={errors}
                                msg={"연락처를 입력해주세요."}
                            /> */}
                        <Divider className="divider" />
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="fax"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="Fax"
                                placeholder="0000-0000-0000"
                                msg={"Fax 번호를 입력해주세요."}
                                mask={[{ mask: "0000-0000-0000" }]}
                                name="fax"
                            />
                            {/* <BasicTextField
                            register={register}
                            registerKey="fax"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="Fax"
                            errors={errors}
                            msg={"Fax 번호를 입력해주세요."}
                        /> */}
                        </div>
                    </>
                ) : (
                    <div className={"row-section"}>
                        <FormattedTextfield
                            control={control}
                            registerKey="contact"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="연락처"
                            placeholder="(0)00-0000-0000"
                            msg={"연락처를 입력해주세요."}
                            mask={[
                                { mask: "00-000-0000" },
                                { mask: "00-0000-0000" },
                                { mask: "000-000-0000" },
                                { mask: "000-0000-0000" },
                            ]}
                            name="contact"
                        />
                        <div className="space" />
                        <FormattedTextfield
                            control={control}
                            registerKey="fax"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="Fax"
                            placeholder="0000-0000-0000"
                            msg={"Fax 번호를 입력해주세요."}
                            mask={[{ mask: "0000-0000-0000" }]}
                            name="fax"
                        />
                    </div>
                )}
                <Divider className="divider" />
                {isMedium ? (
                    <>
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="busi_state"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="업태"
                                errors={errors}
                                msg={"업태를 입력해주세요."}
                            />
                        </div>
                        <Divider className="divider" />
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="event"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="종목"
                                errors={errors}
                                msg={"종목을 입력해주세요."}
                            />
                        </div>
                    </>
                ) : (
                    <div className={"row-section"}>
                        <BasicTextField
                            register={register}
                            registerKey="busi_state"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="업태"
                            errors={errors}
                            msg={"업태를 입력해주세요."}
                        />
                        <div className="space" />
                        <BasicTextField
                            register={register}
                            registerKey="event"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="종목"
                            errors={errors}
                            msg={"종목을 입력해주세요."}
                        />
                    </div>
                )}
                <Divider className="divider" />
                <div className="section">
                    <AttachmentInput
                        register={register}
                        registerKey="license"
                        spaceWidth="1vw"
                        isRequired={true}
                        isMultiple={false}
                        isChip={false}
                        htmlFor="license-attach"
                        label="사업자등록증"
                        files={license}
                        setFiles={setLicense}
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <TableWithLabel
                        label="통장사본"
                        isRequired={true}
                        spaceWidth="1vw"
                        columns={columns}
                        rows={passbookRows}
                        setRows={setPassbookRows}
                        apiRef={passbookApiRef}
                        handleClickAddRow={handleClickAddRow}
                        handleClickDeleteRow={handleClickDeleteRow}
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="billing_address"
                        spaceWidth="1vw"
                        label={"전자세금계산서\n발행 주소"}
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="note"
                        spaceWidth="1vw"
                        label="비고"
                        isMultiline={true}
                        minRows={6}
                    />
                </div>
                <div className="btn-section">
                    {router.pathname === PATH.ADMIN.COMPANY.EDIT && (
                        <>
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
                        </>
                    )}
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
                        {router.pathname === PATH.ADMIN.COMPANY.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VHeadOfficeForm;

const rootStyle = css`
    .section {
        padding: 10px 20px 0px;
    }
    .row-section {
        display: flex;
        flex-direction: row;
        padding: 10px 20px 0px;
        .space {
            width: 6vw;
        }
    }
    .divider {
        margin: 10px 0px 0px;
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
