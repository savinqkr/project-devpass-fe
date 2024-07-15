import { css } from "@emotion/react";
import { BasicSelector, BasicTextField } from "@common/components";
import BasicMoneyField from "@common/components/basic-moneyfield/BasicMoneyField.impl";
import Divider from "@mui/material/Divider";
import BasicFromToDatePicker from "@common/components/basic-from-to-datepicker/BasicFromToDatePicker.impl";
import { ProductType, ScreenType } from "@enums";
import { Button, useMediaQuery } from "@mui/material";
import { IContractRegisterForm } from "./ContractRegisterForm.interface";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector/BasicAutoCompleteSelector.impl";
import PageSectionTitle from "@common/components/page-section-title";
import BasicChipField from "@common/components/basic-chip-field";
import { useRouter } from "next/router";
import BasicDatePicker from "@common/components/basic-datepicker/BasicDatePicker.impl";

const VContractRegisterForm: React.FC<
    IContractRegisterForm.IVProps
> = props => {
    const {
        type,
        control,
        register,
        errors,
        clientOptions,
        projectOptions,
        salesRepresentativeOptions,
        issuanceMethodOptions,
        billingCycleOptions,
        finalEstimateOptions,
        onClickSubmit,
        hasFinalEstimate,
        routePath,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off">
                <div id="default-section" className="info-section">
                    <PageSectionTitle title="기본정보" />
                    <Divider className="divider" />
                    <div className="section">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="client"
                            options={clientOptions}
                            spaceWidth="1vw"
                            label="고객사"
                            isRequired={true}
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
                                label={`${type} 사업`}
                                isRequired={true}
                                width={"100%"}
                                errMsg={"사업을 선택해주세요."}
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicAutoCompleteSelector
                                control={control}
                                registerKey="sales_representative"
                                options={salesRepresentativeOptions}
                                spaceWidth="1vw"
                                label={"영업 담당자"}
                                isRequired={true}
                                width={"100%"}
                                errMsg={"선택한 사업에 영업 담당자가 없습니다."}
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
                    <div className="section">
                        <BasicAutoCompleteSelector
                            label="계약사"
                            isRequired
                            width={isMedium ? "100%" : "48%"}
                            control={control}
                            registerKey="contractor"
                            options={clientOptions}
                            spaceWidth="1vw"
                            errMsg="계약사를 선택해주세요."
                        />
                    </div>
                    <Divider className="divider" />
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
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicDatePicker
                                control={control}
                                registerKey="contract_date"
                                label="계약일"
                                isRequired={true}
                                spaceWidth="1vw"
                                errMsg="계약일을 선택해주세요."
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
                                from: "계약 시작일을 선택해주세요.",
                                to: "계약 종료일을 선택해주세요.",
                            }}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicMoneyField
                                label="계약금액"
                                width="100%"
                                isRequired
                                spaceWidth="1vw"
                                control={control}
                                registerKey="contract_amount"
                                endAdornment="원"
                                errMsg={"계약금액을 입력해주세요."}
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
                                isRequired={
                                    type === ProductType.MAINTENANCE
                                        ? false
                                        : true
                                }
                                isNumber
                                width="100%"
                                register={register}
                                registerKey="defect_performance_guarantee_rate"
                                spaceWidth="1vw"
                                endAdornment="%"
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
                                isRequired={
                                    type === ProductType.MAINTENANCE
                                        ? false
                                        : true
                                }
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicSelector
                                control={control}
                                registerKey="issuance_method_code"
                                label="계산서 발행 방법"
                                isRequired={true}
                                placeholder="선택해주세요."
                                options={issuanceMethodOptions}
                                spaceWidth="1vw"
                                msg="계산서 발행 방법을 선택해주세요"
                                width="100%"
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicTextField
                                label="발행 사이트"
                                isRequired
                                width={"100%"}
                                register={register}
                                registerKey="issuing_site"
                                spaceWidth="1vw"
                                isErrMsg={true}
                                msg="발행 사이트를 입력해주세요."
                                errors={errors}
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicTextField
                                label="검수등록 대상"
                                isRequired={false}
                                width="100%"
                                register={register}
                                registerKey="inspection_target"
                                spaceWidth="1vw"
                                isErrMsg={false}
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicTextField
                                label="검수 사이트"
                                isRequired={false}
                                width={"100%"}
                                register={register}
                                registerKey="inspection_site"
                                spaceWidth="1vw"
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicMoneyField
                            control={control}
                            label="매월 기준 금액"
                            width={isMedium ? "100%" : "48%"}
                            isRequired
                            registerKey="monthly_standard_amount"
                            spaceWidth="1vw"
                            endAdornment="원"
                            errMsg="매월 기준 금액을 입력해주세요."
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-item">
                            <BasicSelector
                                control={control}
                                registerKey="billing_cycle_code"
                                label="청구 주기"
                                isRequired={true}
                                placeholder="선택해주세요."
                                options={billingCycleOptions}
                                spaceWidth="1vw"
                                msg="청구 주기를 선택해주세요"
                                width="100%"
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-item">
                            <BasicMoneyField
                                label="1회 청구 금액"
                                isRequired={true}
                                width={"100%"}
                                control={control}
                                registerKey="billing_amount_once"
                                spaceWidth="1vw"
                                endAdornment="원"
                                errMsg="1회 청구 금액을 입력해주세요."
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            label="계산서 발행일"
                            width={isMedium ? "100%" : "48%"}
                            isRequired={false}
                            register={register}
                            registerKey="billing_date"
                            spaceWidth="1vw"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="section">
                        <BasicTextField
                            label="입금 시기"
                            width={isMedium ? "100%" : "48%"}
                            isRequired={false}
                            register={register}
                            registerKey="payment_timing"
                            spaceWidth="1vw"
                        />
                    </div>
                    <Divider className="divider" />
                </div>
                <div id="attachment-section" className="info-section">
                    <PageSectionTitle title="첨부문서" />
                    <Divider className="divider" />
                    <div className="section">
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
                    </div>
                </div>
                <div id="other-section" className="info-section">
                    <PageSectionTitle title="기타" />
                    <Divider className="divider" />
                    <BasicTextField
                        label="비고"
                        width={"100%"}
                        register={register}
                        registerKey="note"
                        spaceWidth="1vw"
                        isMultiline={true}
                        maxRows={7}
                        minRows={7}
                    />
                </div>
                <div id="btn-section">
                    <Button
                        variant="outlined"
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                            marginRight: "10px",
                        }}
                        color={"black"}
                        onClick={() => router.push(routePath)}
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        color={"black"}
                        onClick={onClickSubmit}
                    >
                        등록
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VContractRegisterForm;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    width: 100%;

    .divider {
        margin: 10px 0px;
    }

    .info-section {
        margin-top: 40px;

        .twin-section {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
            justify-content: space-between;
            margin: ${!isMedium && "0px 20px"};

            .twin-section-item {
                padding: ${isMedium && "0px 20px"};
                width: ${isMedium ? "100%" : "48%"};
            }
        }
    }

    .section {
        margin: 0px 20px;
    }

    #btn-section {
        display: flex;
        justify-content: end;
        margin-top: 60px;
    }
`;
