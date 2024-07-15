import { css } from "@emotion/react";
import { IUserForm } from "./UserForm.interface";
import { ScreenType } from "@enums";
import {
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Switch,
    useMediaQuery,
} from "@mui/material";
import {
    BasicSelector,
    BasicTextField,
    FormattedTextfield,
} from "@common/components";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { Colors } from "@configs/colors";

const VUserForm: React.FC<IUserForm.IVProps> = props => {
    const router = useRouter();
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const {
        register,
        control,
        errors,
        watch,
        getValues,
        onClickSubmit,
        idAvailable,
        checkIdAvailable,
        isPwEqual,
        isPwFieldActive,
        handleToggleSwitch,
        roleOptions,
        roles,
        onClickAddRoleChip,
        handleDeleteRoleChip,
    } = props;

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off" onSubmit={onClickSubmit}>
                {router.pathname !== `${PATH.ADMIN.USER.EDIT}/[id]` && (
                    <>
                        <div className="section">
                            <BasicTextField
                                label="아이디"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                placeholder="* 4자 이상의 영문(필수), 숫자(선택), 특수문자(선택)"
                                register={register}
                                registerKey="account_id"
                                isRequired="아이디를 입력해주세요"
                                errors={errors}
                                pattern={{
                                    // value: /^(?=.*[a-zA-Z])[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>~`/\-_=+]{4,}$/,
                                    value: /^(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*(),.?":{}|<>~`/\-_=+]*[^가-힣])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>~`/\-_=+]{4,}$/,
                                    message:
                                        "영문(필수), 숫자(선택), 특수문자(선택) 으로 구성된 4자 이상의 아이디를 입력해주세요",
                                }}
                                minLength={{
                                    value: 4,
                                    message: "4자 이상의 아이디를 입력해주세요",
                                }}
                                showMsg={idAvailable !== null}
                                isErrMsg={!idAvailable}
                                msg={
                                    idAvailable
                                        ? "사용 가능한 아이디 입니다"
                                        : "사용할 수 없는 아이디 입니다"
                                }
                                allowedPattern={
                                    /^[a-zA-Z0-9~`!@#\$%\^&\*\(\)_\-\+=\{\[\]\}\|\\:;'",<>\.\?\/]*$/
                                }
                            />
                            <div className="btn-group">
                                <Button
                                    className="round-btn"
                                    onClick={checkIdAvailable}
                                    variant="contained"
                                    color="charcoalGray"
                                    disabled={idAvailable === true}
                                    sx={{ fontSize: 12, height: 30 }}
                                >
                                    중복 확인
                                </Button>
                            </div>
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicTextField
                                label="비밀번호"
                                placeholder="* 6자 이상의 영문(필수), 숫자(필수), 특수문자(선택)"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                register={register}
                                registerKey="account_pw"
                                isRequired="비밀번호를 입력해주세요"
                                errors={errors}
                                pattern={{
                                    value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>~`/\-_=+]{6,}$/,
                                    message:
                                        "영문(필수), 숫자(필수), 특수문자(선택) 으로 구성된 6자 이상의 비밀번호를 입력해주세요",
                                }}
                                minLength={{
                                    value: 6,
                                    message:
                                        "6자 이상의 비밀번호를 입력해주세요",
                                }}
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="account_pw_check"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                isRequired="비밀번호가 일치하는지 확인해주세요"
                                label="비밀번호 확인"
                                isPassword={true}
                                errors={errors}
                                showMsg={
                                    isPwEqual !== null &&
                                    !errors.account_pw_check
                                }
                                isErrMsg={!isPwEqual}
                                msg={
                                    isPwEqual
                                        ? "비밀번호가 일치합니다"
                                        : "비밀번호가 일치하지 않습니다"
                                }
                                validate={(match: any) => {
                                    return match === watch("account_pw");
                                }}
                            />
                        </div>
                    </>
                )}
                <Divider />
                <div className="section">
                    <BasicTextField
                        label="사용자명"
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        register={register}
                        registerKey="name"
                        isRequired="사용자명을 입력해주세요"
                        errors={errors}
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
                    <BasicSelector
                        control={control}
                        registerKey="selectedRoleCode"
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
                    {roles.map(role => (
                        <Chip
                            className="chip"
                            key={`chip-${role.value}`}
                            label={role.label}
                            variant="outlined"
                            color="deepPurple"
                            onDelete={() => handleDeleteRoleChip(role)}
                        />
                    ))}
                </div>
                <Divider />
                {router.pathname === `${PATH.ADMIN.USER.EDIT}/[id]` && (
                    <>
                        <div className="section">
                            <div
                                css={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "start",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    css={{
                                        marginLeft: "4px",
                                        fontSize: "16px",
                                        color: Colors.charcoalGray,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    비밀번호 변경하기
                                </span>
                                <Switch
                                    color="wildStrawberry"
                                    value={isPwFieldActive}
                                    onChange={handleToggleSwitch}
                                />
                            </div>
                        </div>
                        <div className="section">
                            <BasicTextField
                                isDisabled={!isPwFieldActive}
                                label="비밀번호"
                                placeholder="* 6자 이상의 영문(필수), 숫자(필수), 특수문자(선택)"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                register={register}
                                registerKey="account_pw"
                                isRequired={isPwFieldActive}
                                errors={errors}
                                pattern={{
                                    value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>~`/\-_=+]{6,}$/,
                                    message:
                                        "영문(필수), 숫자(필수), 특수문자(선택) 으로 구성된 6자 이상의 비밀번호를 입력해주세요",
                                }}
                                minLength={{
                                    value: 6,
                                    message:
                                        "6자 이상의 비밀번호를 입력해주세요",
                                }}
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicTextField
                                isDisabled={!isPwFieldActive}
                                register={register}
                                registerKey="account_pw_check"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                isRequired={isPwFieldActive}
                                label="비밀번호 확인"
                                isPassword={true}
                                errors={errors}
                                showMsg={
                                    isPwFieldActive &&
                                    isPwEqual !== null &&
                                    !errors.account_pw_check
                                }
                                isErrMsg={!isPwEqual}
                                msg={
                                    isPwEqual
                                        ? "비밀번호가 일치합니다"
                                        : "비밀번호가 일치하지 않습니다"
                                }
                                validate={(match: any) => {
                                    return match === watch("account_pw");
                                }}
                            />
                        </div>
                        <Divider />
                    </>
                )}
                <div className="btn-section">
                    {/* {router.pathname === `${PATH.ADMIN.USER.EDIT}/[id]` && ( */}
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
                        {router.pathname === PATH.ADMIN.USER.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VUserForm;

const rootStyle = (isMedium: boolean) => css`
    .section {
        padding: 10px 20px;
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
        justify-content: ${isMedium ? "end" : "start"};
        align-items: ${isMedium ? "end" : "center"};
    }
    .row-section {
        display: flex;
        flex-direction: row;
        padding: 10px 20px;
        .space {
            width: 4.5vw;
        }
    }
    .round-btn {
        width: 100px;
        height: 32px;
        border-radius: 18px;
        box-shadow: none;
        margin-top: ${isMedium ? "10px" : "0px"};
        margin-left: ${isMedium ? "0px" : "20px"};
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
