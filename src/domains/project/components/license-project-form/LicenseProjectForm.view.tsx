import { css } from "@emotion/react";
import { ILicenseProjectForm } from "./LicenseProjectForm.interface";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { BasicTextField, MuiDataGrid } from "@common/components";
import { ScreenType } from "@enums";
import PageSectionTitle from "@common/components/page-section-title";
import BasicFromToDatePicker from "@common/components/basic-from-to-datepicker";
import BasicDatePicker from "@common/components/basic-datepicker";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import { IoAddOutline } from "react-icons/io5";
import { Colors } from "@configs/colors";
import { AiOutlineDelete } from "react-icons/ai";

const VLicenseProjectForm: React.FC<ILicenseProjectForm.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    const {
        clientOptions,
        companyOptions,
        roleOptions,
        employeeOptions,
        // 파트너 그리드
        partnerApiRef,
        partnerColumns,
        partnerRows,
        onClickAddPartner,
        onClickRemovePartner,
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
        <div css={rootStyle(isMedium)}>
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
                    {isMedium ? (
                        <>
                            <div className="section">
                                <BasicAutoCompleteSelector
                                    control={control}
                                    registerKey="client_id"
                                    isRequired={true}
                                    options={clientOptions}
                                    label="고객사"
                                    spaceWidth="1vw"
                                    width={isMedium ? "100%" : "48%"}
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
                                    width={isMedium ? "100%" : "48%"}
                                    // errMsg="계약사를 선택해주세요."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="client_id"
                                options={clientOptions}
                                spaceWidth="1vw"
                                label="고객사"
                                isRequired={true}
                                width={isMedium ? "100%" : "48%"}
                                errMsg="고객사를 선택해주세요."
                            />
                            <div className="space" />
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="contractor_id"
                                options={clientOptions}
                                label="계약사"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                // errMsg="계약사를 선택해주세요."
                            />
                        </div>
                    )}
                    <Divider />
                    {isMedium ? (
                        <>
                            <div className="section">
                                <BasicFromToDatePicker
                                    label="사업 기간"
                                    spaceWidth="1vw"
                                    width={isMedium ? "100%" : "48%"}
                                    fromRegisterKey="start_date"
                                    toRegisterKey="end_date"
                                    control={control}
                                    errMsg={{
                                        from: "시작일을 선택해주세요.",
                                        to: "종료일을 선택해주세요.",
                                    }}
                                />
                            </div>
                            <Divider />
                            <div className="section">
                                <BasicDatePicker
                                    label="운영전환일"
                                    spaceWidth="1vw"
                                    width={isMedium ? "100%" : "48%"}
                                    control={control}
                                    registerKey="optrans_date"
                                    errMsg="날짜를 선택해주세요."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <BasicFromToDatePicker
                                label="사업 기간"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                fromRegisterKey="start_date"
                                toRegisterKey="end_date"
                                control={control}
                                errMsg={{
                                    from: "시작일을 선택해주세요.",
                                    to: "종료일을 선택해주세요.",
                                }}
                            />
                            <div className="space" />
                            <BasicDatePicker
                                label="운영전환일"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                registerKey="optrans_date"
                                control={control}
                                errMsg="날짜를 선택해주세요."
                            />
                        </div>
                    )}
                    <Divider />
                    {isMedium ? (
                        <>
                            <div className="section">
                                <BasicDatePicker
                                    label="검수일"
                                    spaceWidth="1vw"
                                    width={isMedium ? "100%" : "48%"}
                                    registerKey="inspect_date"
                                    control={control}
                                    errMsg="날짜를 선택해주세요."
                                />
                            </div>
                            <Divider />
                            <div className="section">
                                <BasicFromToDatePicker
                                    label="무상기간"
                                    spaceWidth="1vw"
                                    width={isMedium ? "100%" : "48%"}
                                    fromRegisterKey="free_start_date"
                                    toRegisterKey="free_end_date"
                                    control={control}
                                    errMsg={{
                                        from: "시작일을 선택해주세요.",
                                        to: "종료일을 선택해주세요.",
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <BasicDatePicker
                                label="검수일"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                registerKey="inspect_date"
                                control={control}
                                errMsg="날짜를 선택해주세요."
                            />
                            <div className="space" />
                            <BasicFromToDatePicker
                                label="무상기간"
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "48%"}
                                fromRegisterKey="free_start_date"
                                toRegisterKey="free_end_date"
                                control={control}
                                errMsg={{
                                    from: "시작일을 선택해주세요.",
                                    to: "종료일을 선택해주세요.",
                                }}
                            />
                        </div>
                    )}
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="participate_type"
                            spaceWidth="1vw"
                            label="사업 참여 형태"
                            errors={errors}
                            msg={"사업 참여 형태를 입력해주세요."}
                        />
                    </div>
                    <Divider />
                </div>
                <div className="group">
                    <PageSectionTitle title="SI / 파트너" />
                    <Divider className="divider" />
                    <div className="section">
                        <div className="control-bar">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_partner"
                                options={clientOptions}
                                label="SI / 파트너"
                                spaceWidth="1vw"
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
                                    onClick={onClickAddPartner}
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
                                    onClick={onClickRemovePartner}
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
                                apiRef={partnerApiRef}
                                rows={partnerRows}
                                columns={partnerColumns}
                                rowLimit={5}
                                checkboxSelection
                            />
                        </div>
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="담당자" />
                    <Divider className="divider" />
                    <div className="section">
                        <div className="control-bar">
                            {/* <div className="project_employees_head">
                                <div className="project_employees_label">
                                    <span id="label">담당자</span>
                                    <span id="star">*</span>
                                </div> */}
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="selected_company"
                                options={companyOptions}
                                width="800px"
                                label="담당자"
                                isRequired={true}
                                spaceWidth="1vw"
                                placeholder="회사"
                            />
                            {/* </div> */}
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
                            />
                        </div>
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="기타" />
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
                        {router.pathname === PATH.LICENSE.PROJECT.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VLicenseProjectForm;

const rootStyle = (isMedium: boolean) => css`
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
