import { css } from "@emotion/react";
import { ILicenseEstimateForm } from "./LicenseEstimateForm.interface";
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import { ScreenType } from "@enums";
import PageSectionTitle from "@common/components/page-section-title";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import {
    AutoCompleteTextfield,
    BasicTextField,
    EditableMuiGird,
    FormattedTextfield,
} from "@common/components";
import BasicDatePicker from "@common/components/basic-datepicker";
import { Colors } from "@configs/colors";
import BasicMarkdown from "@common/components/basic-markdown";
import BasicMoneyField from "@common/components/basic-moneyfield";
import { GiCheckMark } from "react-icons/gi";
import PATH from "@constants/path";
import { useSetRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { CommonType } from "src/enums/common_type.enum";
import { IoIosSquare } from "react-icons/io";

const VLicenseEstimateForm: React.FC<ILicenseEstimateForm.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    const {
        // react-hook-form
        register,
        control,
        watch,
        errors,
        onClickSubmit,
        // Options
        clientOptions,
        projectOptions,
        employeeOptions,
        tailOptions,
        headEmployeeOptions,
        // MUI DataGrid
        columns,
        rows,
        setRows,
        detailsApiRef,
        handleClickAddRow,
        handleClickDeleteRow,
        onCellEditStart,
        //
        // vatChecked,
        // handleVat,
        // specialDiscountChecked,
        // handleSpecialDiscount,
    } = props;

    const setEstimateModal = useSetRecoilState(estimateModalState);

    return (
        // <div css={rootStyle(isMedium, vatChecked)}>
        <div css={rootStyle(isMedium, false)}>
            <div className="header-btn">
                <Button
                    variant="outlined"
                    color="gray"
                    sx={{ width: 140, fontSize: 12, height: 32 }}
                    onClick={() =>
                        setEstimateModal({
                            isOpen: true,
                            type: CommonType.LICENSE,
                        })
                    }
                >
                    견적 불러오기
                </Button>
            </div>
            <form autoComplete="off" onSubmit={onClickSubmit}>
                <div className="top-group">
                    <PageSectionTitle title="기본정보" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="selected_client"
                            isRequired={true}
                            options={clientOptions}
                            label="고객사"
                            spaceWidth="1vw"
                            placeholder="선택해주세요"
                            width={isMedium ? "100%" : "48%"}
                            errMsg="고객사를 선택해주세요."
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="project_id"
                            isRequired={true}
                            options={projectOptions}
                            label="라이선스 사업"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            errMsg="라이선스 사업을 선택해주세요."
                        />
                    </div>
                    <Divider />
                    {isMedium ? (
                        <>
                            <div className="section">
                                <AutoCompleteTextfield
                                    control={control}
                                    watch={watch}
                                    registerKey="employee_name"
                                    options={employeeOptions}
                                    isRequired={true}
                                    label="담당자"
                                    spaceWidth="1vw"
                                    msg="담당자를 입력해주세요."
                                    width={isMedium ? "100%" : "48%"}
                                />
                                <div css={{ height: "10px" }} />
                                <BasicTextField
                                    register={register}
                                    registerKey="employee_email"
                                    spaceWidth="1vw"
                                    label="이메일"
                                    errors={errors}
                                    msg={"이메일을 입력해주세요."}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <AutoCompleteTextfield
                                control={control}
                                watch={watch}
                                registerKey="employee_name"
                                options={employeeOptions}
                                isRequired={true}
                                label="담당자"
                                spaceWidth="1vw"
                                msg="담당자를 입력해주세요."
                            />
                            <div className="space" />
                            <BasicTextField
                                register={register}
                                registerKey="employee_email"
                                spaceWidth="1vw"
                                label="이메일"
                                errors={errors}
                                msg={"이메일을 입력해주세요."}
                            />
                        </div>
                    )}
                    {isMedium ? (
                        <>
                            <div className="section">
                                <FormattedTextfield
                                    control={control}
                                    registerKey="employee_contact"
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
                                    name="employee_contact"
                                />
                                <div css={{ height: "10px" }} />
                                <FormattedTextfield
                                    control={control}
                                    registerKey="employee_phone"
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
                                    name="employee_phone"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <FormattedTextfield
                                control={control}
                                registerKey="employee_contact"
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
                                name="employee_contact"
                            />
                            <div className="space" />
                            <FormattedTextfield
                                control={control}
                                registerKey="employee_phone"
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
                                name="employee_phone"
                            />
                        </div>
                    )}
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="destination"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="수신처"
                            errors={errors}
                            msg={"수신처를 입력해주세요."}
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="doc_num"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="문서번호"
                            errors={errors}
                            width={isMedium ? "100%" : "48%"}
                            msg={"문서번호를 입력해주세요."}
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicTextField
                            register={register}
                            registerKey="case_name"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="건명"
                            errors={errors}
                            width={isMedium ? "100%" : "48%"}
                            msg={"건명을 입력해주세요."}
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicDatePicker
                            label="견적일자"
                            registerKey="estimate_date"
                            isRequired
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            control={control}
                            errMsg="날짜를 선택해주세요."
                        />
                    </div>
                    <Divider />
                    <div className="section">
                        <BasicDatePicker
                            label="유효기간"
                            registerKey="validity"
                            isRequired
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            control={control}
                            errMsg="유효기간을 선택해주세요."
                        />
                    </div>
                    <Divider />
                    <div className="section-with-msg">
                        <BasicMoneyField
                            control={control}
                            registerKey="estimate_price"
                            spaceWidth="1vw"
                            isRequired={true}
                            label="견적금액"
                            errMsg={"견적금액을 입력해주세요."}
                            endAdornment="원"
                        />
                        <div className="msg">
                            <GiCheckMark
                                className="msg-icon"
                                color={Colors.wildStrawberry}
                                size={14}
                                css={{ marginRight: 6 }}
                            />
                            <span>부가세포함</span>
                        </div>
                    </div>
                    <Divider />
                </div>
                <div className="group">
                    <PageSectionTitle title="세부내역" />
                    <div className="section grid-section">
                        <p id="unit-info">( 단위 : 원 )</p>
                        <EditableMuiGird
                            columns={columns}
                            rows={rows}
                            setRows={setRows}
                            apiRef={detailsApiRef}
                            handleClickAddRow={handleClickAddRow}
                            handleClickDeleteRow={handleClickDeleteRow}
                            onCellEditStart={onCellEditStart}
                        />
                    </div>
                    {/* <div className="details-group">
                        <Divider />
                        <div className="section">
                            <BasicTextField
                                register={register}
                                registerKey="discount_rate"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="할인율"
                                isNumber={true}
                                errors={errors}
                                msg={"할인율을 입력해주세요."}
                                endAdornment="%"
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicMoneyField
                                control={control}
                                registerKey="total_price"
                                spaceWidth="1vw"
                                isRequired={true}
                                label="공급금액 합계"
                                errMsg={"공급금액 합계를 입력해주세요."}
                                endAdornment="원"
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicMoneyField
                                control={control}
                                registerKey="special_discount_price"
                                spaceWidth="1vw"
                                isRequired={specialDiscountChecked}
                                isDisabled={!specialDiscountChecked}
                                label="특별 할인 금액"
                                errMsg={"특별 할인 금액을 입력해주세요."}
                                endAdornment="원"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={specialDiscountChecked}
                                        onChange={handleSpecialDiscount}
                                        sx={{
                                            "&.Mui-checked": {
                                                color: Colors.wildStrawberry,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            color: Colors.charcoalGray,
                                        }}
                                    >
                                        활성화
                                    </Typography>
                                }
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "end",
                                }}
                            />
                        </div>
                        <Divider />
                        <div className="section">
                            <BasicMoneyField
                                control={control}
                                registerKey="total_price_vat"
                                spaceWidth="1vw"
                                isRequired={vatChecked}
                                isDisabled={!vatChecked}
                                label={"공급금액 합계\n( 부가세포함 )"}
                                errMsg={
                                    "공급금액 합계( 부가세포함 )를 입력해주세요."
                                }
                                endAdornment="원"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={vatChecked}
                                        onChange={handleVat}
                                        sx={{
                                            "&.Mui-checked": {
                                                color: Colors.wildStrawberry,
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            color: Colors.charcoalGray,
                                        }}
                                    >
                                        활성화
                                    </Typography>
                                }
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "end",
                                }}
                            />
                        </div>
                        <Divider />
                    </div>
                </div>
                <div className="group">
                    <PageSectionTitle title="Remark" />
                    <Divider className="divider" />
                    <div className="section grid-section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="selected_tail"
                            isRequired={false}
                            options={tailOptions}
                            spaceWidth="0px"
                            placeholder="선택해주세요"
                            width={isMedium ? "100%" : "48%"}
                        />
                    </div>
                    <div className="section grid-section">
                        <BasicMarkdown
                            control={control}
                            registerKey="tail"
                            spaceWidth="0px"
                            height="320px"
                            errMsg="TAIL 내용을 입력해주세요."
                        />
                    </div> */}
                </div>
                <div className="group">
                    <p className="msg">
                        <IoIosSquare className="msg-icon" />
                        본사 소속 견적 담당자 정보를 입력해주세요. 견적서의
                        공급자 정보와 함께 표기됩니다.
                    </p>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="selected_head_employee"
                            isRequired={true}
                            options={headEmployeeOptions}
                            label="견적 담당자"
                            spaceWidth="1vw"
                            errMsg="담당자를 선택해주세요."
                            width={isMedium ? "100%" : "48%"}
                        />
                    </div>
                    {isMedium ? (
                        <>
                            <div className="section">
                                <BasicTextField
                                    register={register}
                                    registerKey="head_employee_email"
                                    spaceWidth="1vw"
                                    label="이메일"
                                    errors={errors}
                                    msg={"이메일을 입력해주세요."}
                                />
                                <div css={{ height: "10px" }} />
                                <FormattedTextfield
                                    control={control}
                                    registerKey="head_employee_contact"
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
                                    name="head_employee_contact"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="row-section">
                            <BasicTextField
                                register={register}
                                registerKey="head_employee_email"
                                spaceWidth="1vw"
                                label="이메일"
                                errors={errors}
                                msg={"이메일을 입력해주세요."}
                            />
                            <div className="space" />
                            <FormattedTextfield
                                control={control}
                                registerKey="head_employee_contact"
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
                                name="head_employee_contact"
                            />
                        </div>
                    )}
                    <Divider />
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
                        {router.pathname === PATH.LICENSE.ESTIMATE.REGISTER
                            ? "등록"
                            : "수정"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VLicenseEstimateForm;

const rootStyle = (isMedium: boolean, vatChecked: boolean) => css`
    .header-btn {
        margin-top: 12px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }
    .divider {
        margin-top: 10px;
    }
    .group {
        margin-top: 40px;
    }
    .divider {
        width: 100%;
    }
    .section {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
    }
    #unit-info {
        margin: -10px 0px 12px;
        text-align: end;
        font-size: 14px;
        color: ${Colors.charcoalGray};
    }
    .grid-section {
        padding-right: 0px;
        padding-left: 0px;
    }
    .space {
        width: 16px;
    }
    .row-section {
        display: flex;
        flex-direction: row;
        align-items: start;
        padding: 10px 20px;
        .space {
            width: 6vw;
        }
    }
    .row-section-right {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: start;
        padding: 0px 20px;
    }
    .section-with-msg {
        display: flex;
        flex-direction: column;
        align-items: end;
        padding: 10px 20px 0px;
        .msg {
            opacity: ${vatChecked ? "100%" : "35%"};
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex: 1;
            color: ${Colors.charcoalGray};
            font-size: 14px;
            margin: 8px 0px 10px;
        }
    }
    .details-group {
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
    .msg {
        font-size: 15px;
        color: #babac0;
        margin: 8px 16px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        .msg-icon {
            width: 15px;
            height: 15px;
            color: #babac0;
            margin-right: 8px;
        }
    }

    .MuiCheckbox-root {
        transform: scale(0.75);
        margin: 0px;
        padding: 0px;
    }
`;
