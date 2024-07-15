import { css } from "@emotion/react";
import { ISalesDetailsTable } from "./SalesDetailsTable.interface";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Modal,
    useMediaQuery,
} from "@mui/material";
import { ProductType, ScreenType } from "@enums";
import { DetailInfoRow } from "@common/components";
import PageSectionTitle from "@common/components/page-section-title";
import { Colors } from "@configs/colors";
import { TiAttachment } from "react-icons/ti";
import { CgClose } from "react-icons/cg";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";
import DetailsInfoRow from "@common/components/details-info-row";

const VSalesDetailsTable: React.FC<ISalesDetailsTable.IVProps> = props => {
    const router = useRouter();
    const id = router.query.id as string;

    const {
        type,
        sales,
        isLicenseDocumentOpen,
        handleLicenseDocumentOpen,
        handleLicenseDocumentClose,
        licenseDocument,
        licenseDocumentData,
        isInspectionDocumentOpen,
        handleInspectionDocumentOpen,
        handleInspectionDocumentClose,
        inspectionDocument,
        inspectionDocumentData,
        onClickDeleted,
        onClickUpdated,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    // console.log(sales);
    return (
        <div css={rootStyle(isMedium)}>
            {sales ? (
                <div>
                    {!sales.deleted_at && (
                        <div id="btns">
                            <IconButton
                                color="wildStrawberry"
                                onClick={onClickDeleted}
                            >
                                <MdOutlineDelete size={20} />
                            </IconButton>
                            <IconButton
                                color="oceanBlue"
                                onClick={onClickUpdated}
                            >
                                <MdOutlineEdit size={20} />
                            </IconButton>
                        </div>
                    )}
                    <div id="table-section">
                        <div id="inspection-section" className="section">
                            <div className="section-title">
                                <PageSectionTitle title="검수" />
                            </div>
                            <DetailInfoRow
                                label="검수일"
                                value={sales.audit_date}
                                tag={
                                    <div
                                        css={{
                                            display: "flex",
                                            flexDirection: "row",
                                        }}
                                    >
                                        {sales.is_canceled && (
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
                                        {sales.deleted_at && (
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
                                                    marginLeft: "10px",
                                                }}
                                            />
                                        )}
                                    </div>
                                }
                            />
                            {(type === ProductType.LICENSE ||
                                type === ProductType.MAINTENANCE) && (
                                <div className="twin-section">
                                    <DetailInfoRow
                                        label="무상유지보수 시작일"
                                        value={
                                            sales.free_maintenance_start_date
                                        }
                                    />
                                    <DetailInfoRow
                                        label="유지보수 기간"
                                        value={sales.maintenance_duration}
                                    />
                                </div>
                            )}
                            <DetailInfoRow
                                label="라이선스 증서"
                                children={
                                    licenseDocumentData.length !== 0 && (
                                        <div css={chipAreaStyle(isMedium)}>
                                            {licenseDocumentData.map(file => {
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
                                                        onClick={() => {
                                                            handleLicenseDocumentOpen(
                                                                file
                                                            );
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )
                                }
                                value={licenseDocumentData.length === 0 && "-"}
                            />
                            <DetailInfoRow
                                label="검수서류"
                                children={
                                    inspectionDocumentData.length !== 0 && (
                                        <div css={chipAreaStyle(isMedium)}>
                                            {inspectionDocumentData.map(
                                                file => {
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
                                                            onClick={() => {
                                                                handleInspectionDocumentOpen(
                                                                    file
                                                                );
                                                            }}
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    )
                                }
                                value={
                                    inspectionDocumentData.length === 0 && "-"
                                }
                            />
                            <Divider className="divider" />
                        </div>
                        <div id="sales-info-section" className="section">
                            <div className="section-title">
                                <PageSectionTitle title="매출 기본정보" />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="고객사"
                                    value={sales.client}
                                />
                                <DetailInfoRow
                                    label="영업담당자"
                                    value={sales.sales_representative}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label={`${type} 사업`}
                                    value={sales.project}
                                />
                                <DetailInfoRow
                                    label="구분"
                                    value={sales.sales_type}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="파트너사 종류"
                                    value={sales.partner_type}
                                />
                                <DetailsInfoRow
                                    label="파트너사 명"
                                    value={sales.partner_name}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="제품종류"
                                    value={sales.product_type}
                                />
                                <DetailInfoRow
                                    label="구매구분"
                                    value={sales.purchase_type}
                                />
                            </div>
                            <Divider className="divider" />
                        </div>
                        <div id="sales-section" className="section">
                            <div className="section-title">
                                <PageSectionTitle title="매출" />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매출1"
                                    value={sales.first_sales}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매출일자"
                                    value={sales.first_sales_claim_date}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매출2"
                                    value={sales.second_sales}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매출일자"
                                    value={sales.second_sales_claim_date}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매출3"
                                    value={sales.last_sales}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매출일자"
                                    value={sales.last_sales_claim_date}
                                />
                            </div>
                            <Divider className="divider" />
                        </div>
                        <div id="purchase-section" className="section">
                            <div className="section-title">
                                <PageSectionTitle title="매입" />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매입1"
                                    value={sales.first_purchase}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매입일자"
                                    value={sales.first_purchase_claim_date}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매입2"
                                    value={sales.second_purchase}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매입일자"
                                    value={sales.second_purchase_claim_date}
                                />
                            </div>
                            <div className="twin-section">
                                <DetailInfoRow
                                    label="매입3"
                                    value={sales.last_purchase}
                                    adornment={"원"}
                                />
                                <DetailInfoRow
                                    label="매입일자"
                                    value={sales.last_purchase_claim_date}
                                />
                            </div>

                            <DetailInfoRow
                                label="파트너사"
                                value={sales.purchase_partner}
                            />
                            <Divider className="divider" />
                        </div>
                        <Modal
                            open={isLicenseDocumentOpen}
                            onClose={handleLicenseDocumentClose}
                            disableScrollLock
                        >
                            <div css={modalStyle}>
                                <div id="header">
                                    <h2>라이선스 증서</h2>
                                    <IconButton
                                        id="close-btn"
                                        onClick={handleLicenseDocumentClose}
                                    >
                                        <CgClose
                                            size={24}
                                            color={Colors.black}
                                        />
                                    </IconButton>
                                </div>
                                <div id="attachment-body" className="body">
                                    <p
                                        id="parent-modal-description"
                                        className="modal-description"
                                    >
                                        라이선스 증서를 다운로드 하시겠습니까?
                                    </p>
                                    <p id="name">
                                        <TiAttachment size={20} id="clip" />
                                        {licenseDocument?.name}
                                    </p>
                                    <Button
                                        id="download-btn"
                                        variant="contained"
                                        color="wildStrawberry"
                                        disableElevation
                                    >
                                        <a
                                            id="link"
                                            href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/file/download/${licenseDocument?.id}`}
                                        >
                                            다운로드
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            open={isInspectionDocumentOpen}
                            onClose={handleInspectionDocumentClose}
                            disableScrollLock
                        >
                            <div css={modalStyle}>
                                <div id="header">
                                    <h2>검수서류</h2>
                                    <IconButton
                                        id="close-btn"
                                        onClick={handleInspectionDocumentClose}
                                    >
                                        <CgClose
                                            size={24}
                                            color={Colors.black}
                                        />
                                    </IconButton>
                                </div>
                                <div id="attachment-body" className="body">
                                    <p
                                        id="parent-modal-description"
                                        className="modal-description"
                                    >
                                        검수서류를 다운로드 하시겠습니까?
                                    </p>
                                    <p id="name">
                                        <TiAttachment size={20} id="clip" />
                                        {inspectionDocument?.name}
                                    </p>
                                    <Button
                                        id="download-btn"
                                        variant="contained"
                                        color="wildStrawberry"
                                        disableElevation
                                    >
                                        <a
                                            id="link"
                                            href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/file/download/${inspectionDocument?.id}`}
                                        >
                                            다운로드
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            ) : (
                <div>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default VSalesDetailsTable;

const rootStyle = (isMedium: boolean) => css`
    position: relative;

    .section {
        margin-top: 40px;
        margin-bottom: 10px;

        .section-title {
            margin-bottom: 16px;
        }

        .twin-section {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
        }
    }

    #btns {
        display: flex;
        justify-content: end;
        position: absolute;
        top: ${isMedium ? "-20px" : "-50px"};
        right: 0;
        width: 100%;

        button:last-child {
            margin-left: 8px;
        }
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
