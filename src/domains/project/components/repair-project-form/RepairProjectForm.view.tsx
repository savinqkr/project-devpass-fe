import { css } from "@emotion/react";
import { IRepairProjectForm } from "./RepairProjectForm.interface";
import { ScreenType } from "@enums";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import PageSectionTitle from "@common/components/page-section-title";
import {
    BasicTextField,
    FormattedTextfield,
    MuiDataGrid,
    RadioBtnField,
} from "@common/components";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import { IoAddOutline } from "react-icons/io5";
import { Colors } from "@configs/colors";
import { AiOutlineDelete } from "react-icons/ai";
import BasicFromToDatePicker from "@common/components/basic-from-to-datepicker";
import PATH from "@constants/path";
import calculatePeriod from "@utils/calculatePeriod";

const VRepairProjectForm: React.FC<IRepairProjectForm.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    const {
        watch,
        getValues,
        clientOptions,
        companyOptions,
        roleOptions,
        employeeOptions,
        consultantOptions,
        inspectCycleOptions,
        inspectMethodOptions,
        // 파트너 그리드
        licenseContractApiRef,
        licenseContractColumns,
        licenseContractRows,
        // 담당자 그리드
        employeeApiRef,
        employeeColumns,
        employeeRows,
        onClickAddEmployee,
        onClickRemoveEmployee,
        register,
        control,
        errors,
        onClickSubmit,
    } = props;

    return (
        <div
            css={rootStyle(
                isMedium,
                !!watch("start_date") && !!watch("end_date")
            )}
        >
            {" "}
            <form autoComplete="off" onSubmit={onClickSubmit}>
                <div className="group">
                    <PageSectionTitle title="사업 프로필" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="name"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="사업명"
                            errors={errors}
                            msg={"사업명을 입력해주세요."}
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="client_id"
                            isRequired={true}
                            options={clientOptions}
                            label="고객사"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "calc(50% + 27px + 1vw)"}
                            errMsg="고객사를 선택해주세요."
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="contractor_id"
                            options={clientOptions}
                            label="계약사"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "calc(50% + 27px + 1vw)"}
                            // errMsg="계약사를 선택해주세요."
                        />
                    </div>
                    <Divider />
                    <div className="section row-with-label">
                        <BasicFromToDatePicker
                            label="사업 기간"
                            spaceWidth="1vw"
                            fromRegisterKey="start_date"
                            toRegisterKey="end_date"
                            isRequired={true}
                            control={control}
                            errMsg={{
                                from: "시작일을 선택해주세요.",
                                to: "종료일을 선택해주세요.",
                            }}
                        />
                        <div id="month-info">
                            {!!watch("end_date") &&
                                `( 기간 : ${calculatePeriod(
                                    watch("start_date"),
                                    watch("end_date")
                                )} )`}
                        </div>
                    </div>
                    <Divider />
                </div>
                <div className="group">
                    <PageSectionTitle title="라이선스 도입 사업 목록" />
                    <Divider className="divider" />
                    <div className="section">
                        <div css={licenseContractGridStyle(isMedium)}>
                            <p id="head">{"라이선스 도입\n사업 목록"}</p>
                            <div css={{ width: "100%" }}>
                                <MuiDataGrid
                                    apiRef={licenseContractApiRef}
                                    rows={licenseContractRows}
                                    columns={licenseContractColumns}
                                    checkboxSelection
                                    msg={
                                        licenseContractRows.length === 0 &&
                                        !!getValues("client_id.value") &&
                                        getValues("client_id.value") !==
                                            "default" &&
                                        getValues("client_id.value") !== ""
                                            ? "선택한 고객사에 해당하는 라이선스 도입 사업 목록이 존재하지 않습니다."
                                            : "고객사를 선택해주세요."
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="담당자" />
                    <Divider className="divider" />
                    <div className="section">
                        <div className="control-bar">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_company"
                                options={companyOptions}
                                label="담당자"
                                isRequired={true}
                                width="800px"
                                spaceWidth="1vw"
                                placeholder="회사"
                            />
                            <div className="space" />
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_role"
                                options={roleOptions}
                                spaceWidth="0px"
                                width="500px"
                                placeholder="역할"
                            />
                            <div className="space" />
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_employee"
                                options={employeeOptions}
                                spaceWidth="0px"
                                width="500px"
                                placeholder="담당자"
                            />
                            <div className="control-btn">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="black"
                                    sx={{
                                        fontSize: 12,
                                        height: 40,
                                        width: isMedium ? 40 : 70,
                                    }}
                                    onClick={onClickAddEmployee}
                                >
                                    {isMedium ? (
                                        <IoAddOutline
                                            color={Colors.white}
                                            size={23}
                                        />
                                    ) : (
                                        "추가"
                                    )}
                                </Button>
                                <div className="space" />
                                <Button
                                    disableElevation
                                    variant="outlined"
                                    color="wildStrawberry"
                                    sx={{
                                        fontSize: 12,
                                        height: 40,
                                        width: isMedium ? 40 : 70,
                                    }}
                                    onClick={onClickRemoveEmployee}
                                >
                                    {isMedium ? (
                                        <AiOutlineDelete
                                            color={Colors.wildStrawberry}
                                            size={23}
                                        />
                                    ) : (
                                        "삭제"
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="data-table">
                            <MuiDataGrid
                                apiRef={employeeApiRef}
                                rows={employeeRows}
                                columns={employeeColumns}
                                rowLimit={5}
                                checkboxSelection
                                msg="담당자를 추가해주세요."
                            />
                        </div>
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="엔지니어" />
                    <Divider className="divider" />
                    {isMedium ? (
                        <>
                            <div className="section">
                                <BasicAutoCompleteSelector
                                    control={control}
                                    registerKey="selected_consultant"
                                    options={consultantOptions}
                                    label="엔지니어"
                                    spaceWidth="1vw"
                                    placeholder="엔지니어"
                                    width={isMedium ? "100%" : "48%"}
                                />
                                <div css={{ height: "10px" }} />
                                <BasicTextField
                                    register={register}
                                    registerKey="consultant_email"
                                    spaceWidth="1vw"
                                    label="이메일"
                                    errors={errors}
                                    msg={"이메일을 입력해주세요."}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_consultant"
                                options={consultantOptions}
                                label="엔지니어"
                                spaceWidth="1vw"
                                placeholder="엔지니어"
                            />
                            <div className="space" />
                            <BasicTextField
                                register={register}
                                registerKey="consultant_email"
                                spaceWidth="1vw"
                                label="이메일"
                                errors={errors}
                                msg={"이메일을 입력해주세요."}
                            />
                        </div>
                    )}
                    <Divider />
                    {isMedium ? (
                        <>
                            <div className="section">
                                <FormattedTextfield
                                    control={control}
                                    registerKey="consultant_contact"
                                    spaceWidth="1vw"
                                    label="연락처"
                                    placeholder="(0)00-0000-0000"
                                    msg={"연락처를 입력해주세요."}
                                    mask={[
                                        { mask: "00-000-0000" },
                                        { mask: "00-0000-0000" },
                                        { mask: "000-000-0000" },
                                        { mask: "000-0000-0000" },
                                    ]}
                                    name="consultant_contact"
                                />
                                <div css={{ height: "10px" }} />
                                <FormattedTextfield
                                    control={control}
                                    registerKey="consultant_phone"
                                    spaceWidth="1vw"
                                    label="핸드폰번호"
                                    placeholder="(0)00-0000-0000"
                                    msg={"핸드폰번호를 입력해주세요."}
                                    mask={[
                                        { mask: "00-000-0000" },
                                        { mask: "00-0000-0000" },
                                        { mask: "000-000-0000" },
                                        { mask: "000-0000-0000" },
                                    ]}
                                    name="consultant_phone"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <FormattedTextfield
                                control={control}
                                registerKey="consultant_contact"
                                spaceWidth="1vw"
                                label="연락처"
                                placeholder="(0)00-0000-0000"
                                msg={"연락처를 입력해주세요."}
                                mask={[
                                    { mask: "00-000-0000" },
                                    { mask: "00-0000-0000" },
                                    { mask: "000-000-0000" },
                                    { mask: "000-0000-0000" },
                                ]}
                                name="consultant_contact"
                            />
                            <div className="space" />
                            <FormattedTextfield
                                control={control}
                                registerKey="consultant_phone"
                                spaceWidth="1vw"
                                label="핸드폰번호"
                                placeholder="(0)00-0000-0000"
                                msg={"핸드폰번호를 입력해주세요."}
                                mask={[
                                    { mask: "00-000-0000" },
                                    { mask: "00-0000-0000" },
                                    { mask: "000-000-0000" },
                                    { mask: "000-0000-0000" },
                                ]}
                                name="consultant_phone"
                            />
                        </div>
                    )}
                </div>
                <div className="group">
                    <PageSectionTitle title="정기점검" />
                    <Divider className="divider" />
                    <div className="section">
                        <RadioBtnField
                            control={control}
                            registerKey="inspect_cycle"
                            label="점검 주기"
                            options={inspectCycleOptions}
                            spaceWidth="1vw"
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <RadioBtnField
                            control={control}
                            registerKey="inspect_method"
                            label="점검 방법"
                            options={inspectMethodOptions}
                            spaceWidth="1vw"
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="inspect_option"
                            spaceWidth="1vw"
                            label="점검옵션"
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="inspect_note"
                            spaceWidth="1vw"
                            isMultiline={true}
                            label="비고"
                        />
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="유지보수 요율" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="repair_rate"
                            spaceWidth="1vw"
                            label="유지보수 요율"
                            width={isMedium ? "100%" : "calc(50% + 27px + 1vw)"}
                            endAdornment="%"
                            isNumber={true}
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="repair_last_year_rate"
                            spaceWidth="1vw"
                            label="전년 요율"
                            width={isMedium ? "100%" : "calc(50% + 27px + 1vw)"}
                            endAdornment="%"
                            isNumber={true}
                        />
                    </div>
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
                        {router.pathname === PATH.REPAIR.PROJECT.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VRepairProjectForm;

const rootStyle = (isMedium: boolean, showMonthInfo?: boolean) => css`
    .group {
        margin-top: 40px;
    }
    .divider {
        margin-top: 10px;
    }
    .section {
        padding: 10px 20px;
    }
    .space {
        width: 16px;
    }
    .row-with-label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        #month-info {
            margin-top: ${showMonthInfo ? "10px" : "0px"};
            width: 150px;
            display: flex;
            flex-direction: row;
            justify-content: end;
            align-items: center;
            font-size: 14px;
            color: ${Colors.charcoalGray};
        }
    }
    .row-section {
        display: flex;
        flex-direction: row;
        padding: 10px 20px;
        .space {
            width: 6vw;
        }
    }
    .control-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .control-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 10px;
        .space {
            width: 10px;
        }
    }
    .data-table {
        width: ${isMedium ? "100%" : "calc(100%-110px- 1vw)"};
        margin-left: ${isMedium ? "0px" : "calc(110px + 1vw)"};
        margin-top: 16px;
    }
    .btn-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        margin-top: 60px;
        .space {
            width: 10px;
        }
    }
    .MuiButton-root {
        padding: 0px;
        margin: 0px;
        min-width: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
`;

const licenseContractGridStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    width: 100%;

    #head {
        margin-top: 10px;
        width: 110px;
        min-width: 110px;
        color: ${Colors.gray};
        margin-right: 16px;
        white-space: pre-line;
        line-height: 1.6;
        font-size: 14px;
    }
    .data-table {
        width: calc(100% - 110px);
        margin: 0px;
    }
`;
