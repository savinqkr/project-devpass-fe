import { css } from "@emotion/react";
import { ProductType, ScreenType } from "@enums";
import { ISalesEditForm } from "./SalesEditForm.interface";
import Divider from "@mui/material/Divider";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector/BasicAutoCompleteSelector.impl";
import { Button, useMediaQuery } from "@mui/material";
import PageSectionTitle from "@common/components/page-section-title";
import BasicDatePicker from "@common/components/basic-datepicker";
import {
    AttachmentInput,
    BasicSelector,
    BasicTextField,
} from "@common/components";
import BasicMoneyDatePicker from "@common/components/basic-money-datepicker/BasicMoneyDatePicker.impl";
import { Colors } from "@configs/colors";

const VSalesEditForm: React.FC<ISalesEditForm.IVProps> = props => {
    const {
        type,
        errors,
        register,
        control,
        onClickUpdate,
        onClickCancel,
        clientOptions,
        salesTypeOptions,
        salesEmployeeOptions,
        projectOptions,
        partnerTypeOptions,
        purchaseTypeOptions,
        partnerOptions,
        contract_amount,
        remaining_amount,
        licenseDocument,
        setLicenseDocument,
        inspectionDocument,
        setInspectionDocument,
        isDisabledPartnerName,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <form autoComplete="off">
                <div id="basic-info-section" className="section">
                    <PageSectionTitle title="기본정보" />
                    <Divider className="divider" />
                    <div className="field">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="client"
                            options={clientOptions}
                            isRequired
                            label="고객사"
                            width={isMedium ? "100%" : "48%"}
                            spaceWidth="1vw"
                            errMsg="고객사를 선택해주세요."
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicAutoCompleteSelector
                            control={control}
                            registerKey="project"
                            options={projectOptions}
                            isRequired
                            label={`${type} 사업`}
                            width={isMedium ? "100%" : "48%"}
                            spaceWidth="1vw"
                            errMsg="사업을 선택해주세요."
                        />
                    </div>
                    <Divider className="divider" />
                </div>

                <div id="inspection-section" className="section">
                    <PageSectionTitle title="검수" />
                    <Divider className="divider" />
                    <div className="field">
                        <BasicDatePicker
                            control={control}
                            registerKey="audit_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            label="검수일"
                        />
                    </div>
                    {(type === ProductType.LICENSE ||
                        type === ProductType.MAINTENANCE) && (
                        <div>
                            <Divider className="divider" />
                            <div className="twin-section">
                                <div className="twin-section-field">
                                    <BasicDatePicker
                                        control={control}
                                        registerKey="free_maintenance_start_date"
                                        spaceWidth="1vw"
                                        width={isMedium ? "100%" : "96%"}
                                        label="무상유지보수 시작일"
                                    />
                                </div>
                                {isMedium && <Divider className="divider" />}
                                <div className="twin-section-field">
                                    <BasicTextField
                                        register={register}
                                        registerKey="maintenance_duration"
                                        spaceWidth="1vw"
                                        label="유지보수 기간"
                                        width={"100%"}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <Divider className="divider" />
                    <div className="field">
                        <AttachmentInput
                            register={register}
                            registerKey="license_document"
                            spaceWidth="1vw"
                            isRequired={false}
                            isMultiple={false}
                            label="라이선스 증서"
                            htmlFor="license-certificate-attach"
                            errors={errors}
                            files={licenseDocument}
                            setFiles={setLicenseDocument}
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <AttachmentInput
                            register={register}
                            registerKey="inspection_document"
                            spaceWidth="1vw"
                            isRequired={false}
                            isMultiple={true}
                            label="검수서류"
                            htmlFor="inspection-document-attach"
                            errors={errors}
                            files={inspectionDocument}
                            setFiles={setInspectionDocument}
                        />
                    </div>
                    <Divider className="divider" />
                </div>
                <div id="sales-info-section" className="section">
                    <PageSectionTitle title="매출 기본정보" />
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-field">
                            <BasicSelector
                                label="구분"
                                isRequired
                                control={control}
                                registerKey="sales_type_code"
                                options={salesTypeOptions}
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "96%"}
                                msg="구분을 선택해주세요."
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-field">
                            <BasicSelector
                                label="영업 담당자"
                                isRequired
                                control={control}
                                registerKey="sales_representative_id"
                                options={salesEmployeeOptions}
                                spaceWidth="1vw"
                                width={"100%"}
                                isDisabled={true}
                                msg="계약에 등록된 영업 담당자가 없습니다."
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-field">
                            <BasicSelector
                                label="파트너사 종류"
                                isRequired
                                control={control}
                                registerKey="partner_type_code"
                                options={partnerTypeOptions}
                                spaceWidth="1vw"
                                width={isMedium ? "100%" : "96%"}
                                msg="파트너사 종류를 선택해주세요."
                            />
                        </div>
                        {isMedium && <Divider className="divider" />}
                        <div className="twin-section-field">
                            <BasicAutoCompleteSelector
                                label="파트너사 명"
                                isRequired={false}
                                control={control}
                                isDisabled={isDisabledPartnerName}
                                registerKey="partner_name"
                                options={partnerOptions}
                                spaceWidth="1vw"
                                width={"100%"}
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                    <div className="twin-section">
                        <div className="twin-section-field">
                            <BasicTextField
                                label="제품종류"
                                register={register}
                                registerKey="product_type"
                                spaceWidth="1vw"
                                isRequired
                                width={isMedium ? "100%" : "96%"}
                                errors={errors}
                                isErrMsg
                                msg={"제품종류를 입력해주세요."}
                            />
                        </div>
                        <div className="twin-section-field">
                            <BasicSelector
                                label="구매구분"
                                isRequired
                                control={control}
                                registerKey="purchase_type_code"
                                options={purchaseTypeOptions}
                                spaceWidth="1vw"
                                width={"100%"}
                                msg="구매구분을 선택해주세요."
                            />
                        </div>
                    </div>
                    <Divider className="divider" />
                </div>

                <div id="sales-section" className="section">
                    <PageSectionTitle title="매출" />
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매출1"
                            control={control}
                            moneyRegisterKey="first_sales"
                            dateRegisterKey="first_sales_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매출2"
                            control={control}
                            moneyRegisterKey="second_sales"
                            dateRegisterKey="second_sales_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매출3"
                            control={control}
                            moneyRegisterKey="last_sales"
                            dateRegisterKey="last_sales_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <div id="sales-info">
                        <p>
                            총 계약금액 : <span>{contract_amount}</span>
                        </p>

                        <p id="remaining-amount">
                            잔여 금액 : <span>{remaining_amount}</span>
                        </p>
                    </div>
                    <Divider className="divider" />
                </div>
                <div id="purchase-section" className="section">
                    <PageSectionTitle title="매입" />
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매입1"
                            control={control}
                            moneyRegisterKey="first_purchase"
                            dateRegisterKey="first_purchase_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매입2"
                            control={control}
                            moneyRegisterKey="second_purchase"
                            dateRegisterKey="second_purchase_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicMoneyDatePicker
                            label="매입3"
                            control={control}
                            moneyRegisterKey="last_purchase"
                            dateRegisterKey="last_purchase_claim_date"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            endAdornment="원"
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="field">
                        <BasicAutoCompleteSelector
                            label="파트너사"
                            control={control}
                            registerKey="purchase_partner"
                            spaceWidth="1vw"
                            width={isMedium ? "100%" : "48%"}
                            options={clientOptions}
                        />
                    </div>
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

export default VSalesEditForm;

const rootStyle = (isMedium: boolean) => css`
    /* margin-top: 10px; */
    display: flex;
    flex-direction: column;
    width: 100%;

    .divider {
        margin: 10px 0px;
    }

    #btn-section {
        width: 100%;
        display: flex;
        margin-top: 60px;
    }

    .section {
        margin-top: 35px;

        .twin-section {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
            margin: ${!isMedium && "0px 20px"};
            justify-content: space-between;

            .twin-section-field {
                width: ${!isMedium && "100%"};
                margin: ${isMedium && "0px 20px"};
            }
        }

        .field {
            margin: 0px 20px;
        }
    }

    #sales-info {
        display: flex;
        margin-left: 150px;
        margin-top: 10px;
        font-size: 13px;
        color: ${Colors.charcoalGray};

        #remaining-amount {
            margin-left: 10px;
        }
    }

    #btn-section {
        display: flex;
        justify-content: end;

        button:last-of-type {
            margin-left: 10px;
        }
    }
`;
