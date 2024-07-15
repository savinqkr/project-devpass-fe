import { BasicTextField, MuiDataGrid } from "@common/components";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import BasicFromToDatePicker from "@common/components/basic-from-to-datepicker";
import PageSectionTitle from "@common/components/page-section-title";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import { css } from "@emotion/react";
import { ScreenType } from "@enums";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import { ICustomizeProjectForm } from "./CustomizeProjectForm.interface";
import calculatePeriod from "@utils/calculatePeriod";

const VCustomizeProjectForm: React.FC<
    ICustomizeProjectForm.IVProps
> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();
    const {
        clientOptions,
        companyOptions,
        roleOptions,
        employeeOptions,
        // 담당자 그리드
        employeeApiRef,
        employeeColumns,
        employeeRows,
        onClickAddEmployee,
        onClickRemoveEmployee,
        register,
        watch,
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
                            />
                        </div>
                    </div>
                </div>
                <div className="btn-section">
                    {/* {router.pathname ===
                        `${PATH.CUSTOMIZE.PROJECT.EDIT}/[id]` && ( */}
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
                        {router.pathname === PATH.CUSTOMIZE.PROJECT.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VCustomizeProjectForm;

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
