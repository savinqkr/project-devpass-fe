import { css } from "@emotion/react";
import { ProductType, ScreenType } from "@enums";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Modal,
    useMediaQuery,
} from "@mui/material";
import { ILicenseContractDetailsTable } from "./LicenseContractDetailsTable.interface";
import { DetailInfoRow, MuiDataGrid } from "@common/components";
import { CgClose } from "react-icons/cg";
import { TiAttachment } from "react-icons/ti";
import { Colors } from "@configs/colors";
import { useRouter } from "next/router";
import PageSectionTitle from "@common/components/page-section-title";
import ContractDetailsBtns from "../contract-details-btns/ContractDetailsBtns.impl";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";

const VLicenseContractDetailsTable: React.FC<
    ILicenseContractDetailsTable.IVProps
> = props => {
    const {
        contract,
        detailsColumns,
        detailsRows,
        isAttachmentOpen,
        handleAttachmentClose,
        handleAttachmentOpen,
        attachment,
        attachmentData,
        isFinalEstimateOpen,
        handleFinalEstimateClose,
        handleFinalEstimateOpen,
        finalEstimate,
        isLicenseDocumentOpen,
        handleLicenseDocumentClose,
        handleLicenseDocumentOpen,
    } = props;
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();
    const id = parseInt(router.query.id as string);

    const [loginUser, setLoginUser] = useRecoilState(loginState);

    return contract ? (
        <div css={rootStyle(isMedium)}>
            {!contract.deleted_at && (
                <div id="btns">
                    <ContractDetailsBtns
                        type={ProductType.LICENSE}
                        isCanceled={contract.is_canceled}
                    />
                </div>
            )}
            <div id="profile-section" className="row-group">
                <div className="section-title">
                    <PageSectionTitle title="기본정보" />
                </div>
                <DetailInfoRow
                    label="고객사"
                    value={contract.client}
                    tag={
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {contract.is_canceled && (
                                <Chip
                                    label="해지"
                                    sx={{
                                        height: 24,
                                        padding: "0px 4px",
                                        color: Colors.mandarinOrange,
                                        fontSize: "12px",
                                        backgroundColor:
                                            "rgba(255, 204, 157, 0.2)",
                                        border: "none",
                                        minWidth: 70,
                                    }}
                                />
                            )}
                            {contract.deleted_at && (
                                <Chip
                                    label="Deleted"
                                    sx={{
                                        height: 24,
                                        padding: "0px 4px",
                                        color: Colors.wildStrawberry,
                                        fontSize: "12px",
                                        backgroundColor:
                                            "rgba(255, 51, 99, 0.08)",
                                        border: "none",
                                    }}
                                />
                            )}
                        </div>
                    }
                />
                <div className="twin-row">
                    <DetailInfoRow
                        label="라이선스 사업"
                        value={contract.project}
                    />
                    <DetailInfoRow
                        label="영업 담당자"
                        value={contract.sales_representative}
                    />
                </div>
                <div className="twin-row">
                    <DetailInfoRow label="계약명" value={contract.name} />
                    <DetailInfoRow
                        label="계약일"
                        value={contract.contract_date}
                    />
                </div>
                <DetailInfoRow
                    label={"라이선스 증서\n발급 일자"}
                    value={contract.license_document_date}
                />
                <DetailInfoRow
                    label="라이선스 증서"
                    children={
                        <Button
                            id="license-download-btn"
                            variant="outlined"
                            sx={{
                                borderRadius: "50px",
                                height: "24px",
                                fontSize: 12,
                            }}
                            color="oceanBlue"
                            onClick={() => {
                                handleLicenseDocumentOpen();
                            }}
                        >
                            라이선스 증서
                        </Button>
                    }
                />
                <DetailInfoRow
                    label="계약기간"
                    value={`${contract.contract_period_start} ~ ${contract.contract_period_end}`}
                />
                <DetailInfoRow label="납기일" value={contract.delivery_date} />
                <DetailInfoRow
                    label="계약금액"
                    value={contract.contract_amount}
                    adornment={"원"}
                />
                <div className="twin-row">
                    <DetailInfoRow
                        label="공급금액"
                        value={contract.supply_amount}
                        adornment={"원"}
                    />
                    <DetailInfoRow
                        label="부가세포함"
                        value={contract.including_vat}
                        adornment={"원"}
                    />
                </div>
                <DetailInfoRow
                    label="계약이행보증요율"
                    value={contract.performance_guarantee_rate}
                    adornment={"%"}
                />
                <div className="twin-row">
                    <DetailInfoRow
                        label="하자이행보증요율"
                        value={contract.defect_performance_guarantee_rate}
                        adornment={"%"}
                    />
                    <DetailInfoRow
                        label="하자이행보증기간"
                        value={`${contract.defect_warranty_period_start} ~ ${contract.defect_warranty_period_end}`}
                    />
                </div>
                <DetailInfoRow
                    label="대금지급 방법"
                    value={contract.payment_method}
                />
                <Divider />
            </div>
            <div id="billing-section" className="row-group"></div>
            <div className="section-title">
                <PageSectionTitle title="대금청구" />
            </div>
            <DetailInfoRow
                label="선급금 보증요율"
                value={contract.advance_payment_guarantee_rate}
                adornment={"%"}
            />
            <div className="twin-row">
                <DetailInfoRow
                    label="선급금"
                    value={contract.advance_payment}
                    adornment={"원"}
                />
                <DetailInfoRow
                    label="대금청구일자"
                    value={contract.advance_payment_claim_date}
                />
            </div>
            <div className="twin-row">
                <DetailInfoRow
                    label="중도금"
                    value={contract.installment_payment}
                    adornment={"원"}
                />
                <DetailInfoRow
                    label="대금청구일자"
                    value={contract.installment_payment_claim_date}
                />
            </div>
            <div className="twin-row">
                <DetailInfoRow
                    label="잔금"
                    value={contract.remaining_balance}
                    adornment={"원"}
                />
                <DetailInfoRow
                    label="대금청구일자"
                    value={contract.remaining_balance_claim_date}
                />
            </div>
            <Divider />
            <div id="product-section" className="row-group">
                <div className="section-title">
                    <PageSectionTitle title="품목 정보" />
                </div>
                <MuiDataGrid rows={detailsRows} columns={detailsColumns} />
            </div>
            <Divider />

            <div id="attachment-section" className="row-group"></div>
            <div className="section-title">
                <PageSectionTitle title="첨부문서" />
            </div>
            <DetailInfoRow
                label="최종견적서"
                children={
                    <Chip
                        key={`at-final-estimate`}
                        className="file-clip"
                        label={"최종견적서"}
                        variant="outlined"
                        color="wildStrawberry"
                        sx={{
                            height: 24,
                            padding: "0px 4px",
                        }}
                        onClick={() => {
                            handleFinalEstimateOpen();
                        }}
                    />
                }
            />

            <DetailInfoRow
                label="첨부문서"
                children={
                    attachmentData.length !== 0 && (
                        <div css={chipAreaStyle(isMedium)}>
                            {attachmentData.map(file => {
                                return (
                                    <Chip
                                        icon={
                                            <TiAttachment
                                                size={20}
                                                className="icon"
                                            />
                                        }
                                        key={`pb-${file.id}`}
                                        className="file-clip"
                                        label={file.name}
                                        variant="outlined"
                                        color="oceanBlue"
                                        sx={{
                                            height: 24,
                                            padding: "0px 4px",
                                        }}
                                        onClick={() => {
                                            handleAttachmentOpen(file);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )
                }
                value={attachmentData.length === 0 && "-"}
            />

            <Divider />

            <Modal
                open={isAttachmentOpen}
                onClose={handleAttachmentClose}
                disableScrollLock
            >
                <div css={modalStyle}>
                    <div id="header">
                        <h2>첨부파일</h2>
                        <IconButton
                            id="close-btn"
                            onClick={handleAttachmentClose}
                        >
                            <CgClose size={24} color={Colors.black} />
                        </IconButton>
                    </div>
                    <div id="attachment-body" className="body">
                        <p
                            id="parent-modal-description"
                            className="modal-description"
                        >
                            첨부파일을 다운로드 하시겠습니까?
                        </p>
                        <p id="name">
                            <TiAttachment size={20} id="clip" />
                            {attachment?.name}
                        </p>
                        <Button
                            id="download-btn"
                            variant="contained"
                            color="wildStrawberry"
                            disableElevation
                        >
                            <a
                                id="link"
                                href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/file/download/${attachment?.id}`}
                            >
                                다운로드
                            </a>
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={isFinalEstimateOpen}
                onClose={handleFinalEstimateClose}
                disableScrollLock
            >
                <div css={modalStyle}>
                    <div id="header">
                        <IconButton
                            id="close-btn"
                            onClick={handleFinalEstimateClose}
                        >
                            <CgClose size={24} color={Colors.black} />
                        </IconButton>
                    </div>
                    <div id="final-estimate-body" className={"body"}>
                        <p
                            id="parent-modal-description"
                            className="modal-description"
                        >
                            최종 견적서를 다운로드 하시겠습니까?
                        </p>
                        <div id="button-section">
                            <Button
                                id="download-btn"
                                variant="contained"
                                color="black"
                                disableElevation
                            >
                                <a
                                    id="link"
                                    href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/excel/estimate/${finalEstimate}`}
                                >
                                    Excel
                                </a>
                            </Button>
                            <Button
                                id="download-btn"
                                variant="contained"
                                color="black"
                                disableElevation
                            >
                                <a
                                    id="link"
                                    href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/pdf/estimate/${finalEstimate}`}
                                >
                                    PDF
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                open={isLicenseDocumentOpen}
                onClose={handleLicenseDocumentClose}
                disableScrollLock
            >
                <div css={modalStyle}>
                    <div id="header">
                        <IconButton
                            id="close-btn"
                            onClick={handleLicenseDocumentClose}
                        >
                            <CgClose size={24} color={Colors.black} />
                        </IconButton>
                    </div>
                    <div id="final-estimate-body" className={"body"}>
                        <p
                            id="parent-modal-description"
                            className="modal-description"
                        >
                            라이선스 증서를 발급 하시겠습니까?
                        </p>
                        <div id="button-section">
                            <Button
                                id="download-btn"
                                variant="contained"
                                color="black"
                                disableElevation
                            >
                                <a
                                    id="link"
                                    href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/pdf/contract/${contract.id}/${loginUser.id}`}
                                >
                                    PDF
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    ) : (
        <div>
            <CircularProgress />
        </div>
    );
};

export default VLicenseContractDetailsTable;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    position: relative;
    flex-direction: column;
    width: 100%;

    #btns {
        display: flex;
        justify-content: end;
        position: absolute;
        top: ${isMedium ? "-20px" : "-50px"};
        right: 0;
        width: 100%;
    }

    #license-download-btn {
        word-break: keep-all;
    }

    .divider {
        margin: 10px 0px;
    }

    .section-title {
        margin-bottom: 16px;
    }

    .row-group {
        margin-top: 16px;
        margin-bottom: 10px;
    }

    .twin-row {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
    }
`;

const modalStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 480px;
    height: 280px;
    background-color: ${Colors.white};
    border-radius: 20px;
    padding: 20px 30px;
    display: flex;
    flex-direction: column;

    #header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50px;

        h2 {
            color: ${Colors.charcoalGray};
        }

        #close-btn {
            position: absolute;
            top: 16px;
            right: 26px;
        }
    }

    .body {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        p {
            font-size: 20px;
            color: ${Colors.charcoalGray};
        }
        #name {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-top: 16px;
            font-size: 16px;
            color: ${Colors.oceanBlue};
        }
        #clip {
            margin-right: 4px;
        }
    }

    #attachment-body {
        #download-btn {
            position: absolute;
            bottom: 20px;
            width: calc(100% - 60px);
            font-size: 16px;
        }
    }

    #final-estimate-body {
        #button-section {
            position: absolute;
            bottom: 20px;
            display: flex;
            width: 100%;
            justify-content: space-evenly;

            #download-btn {
                width: calc(50% - 60px);
                font-size: 16px;
            }
        }
    }

    #link {
        width: 100%;
    }
`;

const chipAreaStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: ${isMedium ? "column" : "row"};
    align-items: ${isMedium ? "start" : "center"};

    .file-clip {
        margin-right: 16px;
        margin-bottom: ${isMedium ? "10px" : "0px"};
        max-width: 300px;
        &:last-child {
            margin-right: 0px;
        }
    }
    .icon {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
        max-width: 20px;
        max-height: 20px;
    }
`;
