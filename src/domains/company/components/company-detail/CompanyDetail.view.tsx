import { css } from "@emotion/react";
import { ICompanyDetail } from "./CompanyDetail.interface";
import { DetailInfoRow } from "@common/components";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Modal,
    useMediaQuery,
} from "@mui/material";
import { ScreenType } from "@enums";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { Colors } from "@configs/colors";
import { TiAttachment } from "react-icons/ti";
import { CgClose } from "react-icons/cg";

const VCompanyDetail: React.FC<ICompanyDetail.IVProps> = props => {
    const {
        companyData,
        licenseData,
        passbookData,
        isOpen,
        handleClose,
        handleOpen,
        attachment,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();

    return (
        <div css={rootStyle(isMedium)}>
            <DetailInfoRow
                label="법인명"
                value={companyData?.name}
                tag={
                    companyData?.deleted_at && (
                        <Chip
                            label="Deleted"
                            sx={{
                                padding: "0px 10px",
                                color: Colors.wildStrawberry,
                                fontSize: "16px",
                                backgroundColor: "rgba(255, 51, 99, 0.12)",
                                border: "none",
                            }}
                        />
                    )
                }
            />
            <DetailInfoRow label="대표자" value={companyData?.president} />
            <div className="row-section">
                <DetailInfoRow
                    label="사업자번호"
                    value={companyData?.busi_no}
                />
                <DetailInfoRow
                    label="법인등록번호"
                    value={companyData?.regist_no}
                />
            </div>
            <DetailInfoRow label="주소" value={companyData?.address} />
            {router.pathname === PATH.ADMIN.COMPANY.MAIN && (
                <div className="row-section">
                    <DetailInfoRow
                        label="연락처"
                        value={companyData?.contact}
                    />
                    <DetailInfoRow label="Fax" value={companyData?.fax} />
                </div>
            )}
            <div className="row-section">
                <DetailInfoRow label="업태" value={companyData?.busi_state} />
                <DetailInfoRow label="종목" value={companyData?.event} />
            </div>
            <DetailInfoRow
                label="사업자등록증"
                children={
                    licenseData && (
                        <Chip
                            sx={{
                                fontSize: 12,
                                height: 26,
                                "& .MuiChip-label": {
                                    maxWidth: 320,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                },
                            }}
                            className="file-clip"
                            icon={<TiAttachment size={16} />}
                            label={licenseData!.name ?? ""}
                            variant="outlined"
                            color="oceanBlue"
                            onClick={() => handleOpen(licenseData)}
                        />
                    )
                }
                value={!licenseData && "-"}
            />
            <DetailInfoRow
                label="통장사본"
                children={
                    passbookData.length !== 0 && (
                        <Box css={passbookAreaStyle(isMedium)}>
                            {passbookData.map(file => {
                                return (
                                    <Box
                                        key={`pb-group-${file.id}`}
                                        className="passbook-row"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div className="passbook-info">
                                            <span className="bank_name">
                                                {file.bank_name}
                                            </span>
                                            <span className="bank_account">
                                                ( {file.bank_account} )
                                            </span>
                                        </div>
                                        <div>
                                            <Chip
                                                sx={{
                                                    fontSize: 12,
                                                    height: 26,
                                                    "& .MuiChip-label": {
                                                        maxWidth: 320,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    },
                                                }}
                                                icon={
                                                    <TiAttachment size={16} />
                                                }
                                                key={`pb-${file.id}`}
                                                className="file-clip"
                                                label={file.name}
                                                variant="outlined"
                                                color="oceanBlue"
                                                onClick={() => handleOpen(file)}
                                            />
                                        </div>
                                    </Box>
                                );
                            })}
                        </Box>
                    )
                }
                value={passbookData.length === 0 && "-"}
            />
            <DetailInfoRow
                label={"전자세금계산서\n발행주소"}
                value={companyData?.billing_address}
            />
            <DetailInfoRow
                label="비고"
                value={companyData?.note}
                isNote={true}
            />
            <Divider />
            <Modal open={isOpen} onClose={handleClose} disableScrollLock>
                <div css={modalStyle}>
                    <div id="header">
                        <h2>첨부파일</h2>
                        <IconButton id="close-btn" onClick={handleClose}>
                            <CgClose size={22} color={Colors.black} />
                        </IconButton>
                    </div>
                    <div id="body">
                        <p
                            id="parent-modal-description"
                            className="modal-description"
                        >
                            첨부파일을 다운로드 하시겠습니까?
                        </p>
                        <p id="name">
                            <TiAttachment size={20} id="clip" />
                            <span>{attachment?.name}</span>
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
        </div>
    );
};

export default VCompanyDetail;

const rootStyle = (isMedium: boolean) => css`
    .row-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
    }

    #modal-content {
        background-color: ${Colors.white};
        padding: 40px;
        width: 400px;
        height: 500px;
        border-radius: 10px;
    }
`;

const passbookAreaStyle = (isMedium: boolean) => css`
    margin: 10px 0px;

    .passbook-row {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0px;
        }

        .passbook-info {
            margin-right: 24px;
        }
        .bank_name {
            margin-right: 16px;
        }
    }
`;

const modalStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    height: 300px;
    background-color: ${Colors.white};
    border-radius: 10px;
    padding: 24px;
    display: flex;
    flex-direction: column;

    #header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50px;

        h2 {
            font-size: 20px;
            color: ${Colors.charcoalGray};
        }

        #close-btn {
            position: absolute;
            top: 14px;
            right: 18px;
        }
    }

    #body {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        p {
            font-size: 17.5px;
            color: ${Colors.charcoalGray};
        }
        #name {
            width: 80%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
            color: ${Colors.oceanBlue};
            word-break: break-all;
        }
        #clip {
            margin-right: 4px;
        }
    }

    #download-btn {
        position: absolute;
        bottom: 30px;
        width: calc(100% - 60px);
        height: 36px;
        font-size: 14px;
        border-radius: 36px;
    }

    #link {
        width: 100%;
    }
`;
