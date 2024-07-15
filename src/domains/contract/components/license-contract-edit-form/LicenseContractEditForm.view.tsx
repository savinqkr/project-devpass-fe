import { css } from "@emotion/react";
import {
    AttachmentInput,
    BasicSelector,
    BasicTextField,
} from "@common/components";
import BasicMoneyField from "@common/components/basic-moneyfield/BasicMoneyField.impl";
import Divider from "@mui/material/Divider";
import BasicFromToDatePicker from "@common/components/basic-from-to-datepicker/BasicFromToDatePicker.impl";
import { ScreenType } from "@enums";
import { Button, useMediaQuery } from "@mui/material";
import { ILicenseContractEditForm } from "./LicenseContractEditForm.interface";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector/BasicAutoCompleteSelector.impl";
import PageSectionTitle from "@common/components/page-section-title";
import BasicDatePicker from "@common/components/basic-datepicker";
import BasicMoneyDatePicker from "@common/components/basic-money-datepicker";
import BasicChipField from "@common/components/basic-chip-field";
import { Colors } from "@configs/colors";

const VLicenseContractEditForm: React.FC<
    ILicenseContractEditForm.IVProps
> = props => {
    const {
        control,
        register,
        clientOptions,
        projectOptions,
        salesRepresentativeOptions,
        finalEstimateOptions,
        onClickUpdate,
        onClickCancel,
        attachments,
        setAttachments,
        errors,
        hasFinalEstimate,
        total_amount,
        remaining_amount,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off">
                <div id="default-info-section" className="info-section">
                    <PageSectionTitle title="기본정보" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="client"
                            options={clientOptions}
                            spaceWidth="1vw"
                            label="고객사"
                            isRequired
                            width={isMedium ? "100%" : "48%"}
                            errMsg={"고객사를 선택해주세요."}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="project"
                                options={projectOptions}
                                spaceWidth="1vw"
                                label="라이선스 사업"
                                isRequired
                                width={isMedium ? "100%" : "96%"}
                                errMsg={"사업을 선택해주세요."}
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicAutoCompleteSelector
                                label="영업 담당자"
                                isRequired
                                width="100%"
                                control={control}
                                registerKey="sales_representative"
                                options={salesRepresentativeOptions}
                                spaceWidth="1vw"
                                errMsg="선택한 사업에 영업 담당자가 없습니다."
                            />
                        </div>
                    </div>
                    <Divider className="divider" />

                    {finalEstimateOptions.length > 1 && (
                        <div className="section">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="final_estimate"
                                options={finalEstimateOptions}
                                width={isMedium ? "100%" : "48%"}
                                isRequired
                                label="최종 견적서"
                                spaceWidth="1vw"
                            />
                        </div>
                    )}

                    {finalEstimateOptions.length > 1 && (
                        <Divider className="divider" />
                    )}
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicTextField
                                label="계약명"
                                isRequired
                                register={register}
                                registerKey="name"
                                spaceWidth="1vw"
                                isErrMsg={true}
                                msg="계약명을 입력해주세요."
                                errors={errors}
                                width={isMedium ? "100%" : "96%"}
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicDatePicker
                                control={control}
                                registerKey="contract_date"
                                spaceWidth="1vw"
                                label="계약일"
                                isRequired={true}
                                errMsg="계약일을 선택해주세요."
                                width="100%"
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicFromToDatePicker
                            label="계약기간"
                            isRequired
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            fromRegisterKey="contract_period_start"
                            toRegisterKey="contract_period_end"
                            control={control}
                            errMsg={{
                                from: "계약기간 시작일을 선택해주세요.",
                                to: "계약기간 종료일을 선택해주세요.",
                            }}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicDatePicker
                            label={"라이선스 증서\n발급 일자"}
                            isRequired={false}
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            registerKey="license_document_date"
                            control={control}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicDatePicker
                            label="납기일"
                            isRequired
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            registerKey="delivery_date"
                            control={control}
                            errMsg={"납기일을 선택해주세요."}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicMoneyField
                            label="계약금액"
                            width={isMedium ? "100%" : "48%"}
                            isRequired
                            spaceWidth="1vw"
                            control={control}
                            registerKey="contract_amount"
                            endAdornment="원"
                            errMsg={"계약금액을 입력해주세요."}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicMoneyField
                                label="공급금액"
                                width={isMedium ? "100%" : "96%"}
                                isRequired
                                spaceWidth="1vw"
                                control={control}
                                registerKey="supply_amount"
                                endAdornment="원"
                                errMsg={"공급금액을 입력해주세요."}
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicMoneyField
                                label="부가세 포함"
                                width="100%"
                                isRequired
                                spaceWidth="1vw"
                                control={control}
                                registerKey="including_vat"
                                endAdornment="원"
                                errMsg={"부가세 포함 금액을 입력해주세요."}
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            label={"계약이행\n보증요율"}
                            width={isMedium ? "100%" : "48%"}
                            isRequired
                            isNumber
                            register={register}
                            registerKey="performance_guarantee_rate"
                            spaceWidth="1vw"
                            endAdornment="%"
                            isErrMsg={true}
                            msg="계약이행보증요율을 입력해주세요."
                            errors={errors}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicTextField
                                label={"하자이행\n보증요율"}
                                isRequired={true}
                                isNumber
                                width={isMedium ? "100%" : "96%"}
                                register={register}
                                registerKey="defect_performance_guarantee_rate"
                                spaceWidth="1vw"
                                endAdornment="%"
                                msg="하자이행보증요율을 입력해주세요."
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicFromToDatePicker
                                fromRegisterKey="defect_warranty_period_start"
                                toRegisterKey="defect_warranty_period_end"
                                control={control}
                                spaceWidth="1vw"
                                label={"하자이행\n보증기간"}
                                width="100%"
                                isRequired={true}
                                errMsg={{
                                    from: "하자이행보증기간 시작일을 선택해주세요.",
                                    to: "하자이행보증기간 종료일을 선택해주세요.",
                                }}
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                </div>
                <div className="section">
                    <BasicTextField
                        label="대금지급 방법"
                        width={isMedium ? "100%" : "48%"}
                        isRequired
                        register={register}
                        registerKey="payment_method"
                        spaceWidth="1vw"
                        isErrMsg={true}
                        msg="대금지급 방법을 입력해주세요."
                        errors={errors}
                    />
                </div>
                <Divider className="divider" />
                {/* ---------------------------------[ 대금 청구 ]------------------------------- */}
                <div id="payment-section" className="info-section">
                    <PageSectionTitle title="대금 청구" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            label="선급금 보증요율"
                            isNumber
                            isRequired={false}
                            width={isMedium ? "100%" : "48%"}
                            register={register}
                            registerKey="advance_payment_guarantee_rate"
                            spaceWidth="1vw"
                            endAdornment="%"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicMoneyDatePicker
                            spaceWidth="1vw"
                            label="선급금"
                            isRequired={false}
                            width={isMedium ? "100%" : "48%"}
                            moneyRegisterKey="advance_payment"
                            dateRegisterKey="advance_payment_claim_date"
                            control={control}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicMoneyDatePicker
                            spaceWidth="1vw"
                            label="중도금"
                            isRequired={false}
                            width={isMedium ? "100%" : "48%"}
                            moneyRegisterKey="installment_payment"
                            dateRegisterKey="installment_payment_claim_date"
                            control={control}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicMoneyDatePicker
                            spaceWidth="1vw"
                            label="잔금"
                            isRequired={false}
                            width={isMedium ? "100%" : "48%"}
                            moneyRegisterKey="remaining_balance"
                            dateRegisterKey="remaining_balance_claim_date"
                            control={control}
                            endAdornment="원"
                        />
                    </div>
                    <div id="contract-info">
                        <p>
                            총 공급금액 : <span>{total_amount}</span>
                        </p>

                        <p id="remaining-amount">
                            잔여 금액 : <span>{remaining_amount}</span>
                        </p>
                    </div>
                    <Divider className="divider" />
                </div>
                <div id="attachment-section" className="info-section">
                    <PageSectionTitle title="첨부문서" />
                    <Divider className="divider" />
                    <BasicChipField
                        spaceWidth="1vw"
                        isCompleted={hasFinalEstimate}
                        label="최종 견적서"
                        chipLabel="최종 견적서"
                        chipStyle="outlined"
                        isRequired
                        color={"wildStrawberry"}
                        errMsg="해당 사업에 최종 확정된 견적이 없습니다."
                        width={isMedium ? "100%" : "48%"}
                    />
                    <Divider className="divider" />
                    <AttachmentInput
                        register={register}
                        registerKey="attachments"
                        spaceWidth="1vw"
                        isRequired={true}
                        isMultiple={true}
                        label="첨부문서"
                        htmlFor="attachments-attach"
                        errors={errors}
                        files={attachments}
                        setFiles={setAttachments}
                        msg="첨부문서를 추가해주세요."
                    />
                    <Divider className="divider" />
                </div>
                <div id="btn-section">
                    <Button
                        color={"black"}
                        variant="outlined"
                        sx={{ width: "180px", height: "36px" }}
                        onClick={onClickCancel}
                    >
                        취소
                    </Button>
                    <Button
                        color={"black"}
                        variant="contained"
                        sx={{ width: "180px", height: "36px" }}
                        onClick={onClickUpdate}
                    >
                        수정
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VLicenseContractEditForm;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    width: 100%;

    .divider {
        margin: 10px 0px;
    }

    .twin-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
        justify-content: space-between;
        margin: ${!isMedium && "0px 20px"};

        .twin-section-item {
            width: 100%;
            padding: ${isMedium && "0px 20px"};
        }
    }

    .info-section {
        margin-top: 35px;
    }

    #contract-info {
        display: flex;
        margin-left: 150px;
        margin-top: 10px;
        font-size: 13px;
        color: ${Colors.charcoalGray};

        #remaining-amount {
            margin-left: 10px;
        }
    }

    #default-info-section {
    }

    #payment-section {
    }

    #attachment-section {
    }

    .section {
        margin: 0px 20px;
    }

    #btn-section {
        display: flex;
        justify-content: end;
        margin-top: 60px;

        button:last-child {
            margin-left: 10px;
        }
    }
`;
