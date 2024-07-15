import { css } from "@emotion/react";
import { IEmployeeForm } from "./EmployeeForm.interface";
import { useRouter } from "next/router";
import { Button, Chip, Divider, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import {
    BasicSelector,
    BasicTextField,
    FormattedTextfield,
} from "@common/components";
import PATH from "@constants/path";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import { Colors } from "@configs/colors";

const VEmployeeForm: React.FC<IEmployeeForm.IVProps> = props => {
    const router = useRouter();
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const {
        register,
        control,
        errors,
        onClickSubmit,
        companyOptions,
        roleOptions,
        roles,
        onClickAddRoleChip,
        handleDeleteRoleChip,
    } = props;

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off" onSubmit={onClickSubmit}>
                <div className="section">
                    <BasicAutoCompleteSelector
                        control={control}
                        registerKey="selectedCompany"
                        options={companyOptions}
                        label="회사"
                        isRequired={true}
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        errMsg="고객사를 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="name"
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        isRequired={true}
                        label="이름"
                    />
                </div>
                <Divider />
                {isMedium ? (
                    <>
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="department"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="부서"
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="position"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="직함"
                            />
                        </div>
                    </>
                ) : (
                    <div className="row-section">
                        <BasicTextField
                            register={register}
                            registerKey="department"
                            spaceWidth="1vw"
                            label="부서"
                        />
                        <div className="space" />
                        <BasicTextField
                            register={register}
                            registerKey="position"
                            spaceWidth="1vw"
                            label="직함"
                        />
                    </div>
                )}
                <Divider />
                <div className="section">
                    <BasicSelector
                        control={control}
                        registerKey="selectedRole"
                        options={roleOptions}
                        label="역할"
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                    />
                    <div className="btn-group">
                        <Button
                            className="round-btn"
                            onClick={onClickAddRoleChip}
                            variant="contained"
                            color="charcoalGray"
                            sx={{ fontSize: 12, height: 30 }}
                        >
                            추가
                        </Button>
                    </div>
                </div>
                <div id="chip-area">
                    {roles.map((role, idx) => (
                        <Chip
                            className="chip"
                            key={`chip-${role.value}-${idx}`}
                            label={role.label}
                            variant="outlined"
                            color="deepPurple"
                            onDelete={() => handleDeleteRoleChip(role)}
                        />
                    ))}
                </div>
                <Divider />
                <div className="section">
                    <BasicTextField
                        register={register}
                        registerKey="email"
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        label="이메일"
                        errors={errors}
                        pattern={{
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "이메일 형식을 입력해주세요.",
                        }}
                    />
                </div>
                <Divider />
                {isMedium ? (
                    <>
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="contact"
                                spaceWidth="1vw"
                                isRequired={false}
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
                        <Divider />
                        <div className="section">
                            <FormattedTextfield
                                control={control}
                                registerKey="phone"
                                spaceWidth="1vw"
                                isRequired={false}
                                label="핸드폰번호"
                                placeholder="(0)00-0000-0000"
                                msg={"핸드폰번호를 입력해주세요."}
                                mask={[
                                    { mask: "00-000-0000" },
                                    { mask: "00-0000-0000" },
                                    { mask: "000-000-0000" },
                                    { mask: "000-0000-0000" },
                                ]}
                                name="phone"
                            />
                        </div>
                    </>
                ) : (
                    <div className={"row-section"}>
                        <FormattedTextfield
                            control={control}
                            registerKey="contact"
                            spaceWidth="1vw"
                            isRequired={false}
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
                            registerKey="phone"
                            spaceWidth="1vw"
                            isRequired={false}
                            label="핸드폰번호"
                            placeholder="(0)00-0000-0000"
                            msg={"핸드폰번호를 입력해주세요."}
                            mask={[
                                { mask: "00-000-0000" },
                                { mask: "00-0000-0000" },
                                { mask: "000-000-0000" },
                                { mask: "000-0000-0000" },
                            ]}
                            name="phone"
                        />
                    </div>
                )}
                <Divider />
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
                    {/* {router.pathname ===
                        `${PATH.CLIENT.EMPLOYEE.EDIT}/[id]` && ( */}
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
                    {/* )} */}
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
                        {router.pathname === PATH.CLIENT.EMPLOYEE.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VEmployeeForm;

const rootStyle = (isMedium: boolean) => css`
    .section {
        padding: 10px 20px;
        display: flex;
        flex-direction: row;
        justify-content: start;
    }
    .row-section {
        display: flex;
        flex-direction: row;
        padding: 10px 20px;
        .space {
            width: 4.5vw;
        }
    }
    .btn-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        margin-top: 60px;
    }
    .round-btn {
        width: 100px;
        height: 32px;
        border-radius: 18px;
        box-shadow: none;
        margin-top: ${isMedium ? "10px" : "0px"};
        margin-left: ${isMedium ? "0px" : "20px"};
    }
    .space {
        width: 10px;
    }
    .btn-group {
        margin-left: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    #chip-area {
        margin: 16px 0px 32px calc(1vw + 130px);
    }
    .chip {
        font-size: 14px;
        height: 28px;
        margin-right: 12px;
        &:last-child {
            margin-right: 0px;
        }
    }
`;
