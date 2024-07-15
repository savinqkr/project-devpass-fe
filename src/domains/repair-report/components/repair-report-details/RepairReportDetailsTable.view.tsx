import { css } from "@emotion/react";
import {
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Modal,
    useMediaQuery,
} from "@mui/material";
import { ScreenType } from "@enums";
import { Colors } from "@configs/colors";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import DetailsInfoRow from "@common/components/details-info-row";
import { TiAttachment } from "react-icons/ti";
import { CgClose } from "react-icons/cg";
import { IRepairReportDetailsTable } from "./RepairReportDetailsTable.interface";

const VRepairReportDetailsTable: React.FC<
    IRepairReportDetailsTable.IVProps
> = props => {
    const {
        repairReportData,
        onClickDelete,
        onClickEdit,
        attachment,
        attachmentData,
        isAttachmentOpen,
        handleAttachmentClose,
        handleAttachmentOpen,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return repairReportData ? (
        <div css={rootStyle(isMedium)}>
            {!repairReportData?.deleted_at && (
                <div id="btn-section">
                    <IconButton color="wildStrawberry" onClick={onClickDelete}>
                        <MdOutlineDelete size={20} />
                    </IconButton>
                    <IconButton color="oceanBlue" onClick={onClickEdit}>
                        <MdOutlineEdit size={20} />
                    </IconButton>
                </div>
            )}
            <div id="table-section">
                <DetailsInfoRow
                    label="유지보수 사업"
                    value={repairReportData.project_name}
                    tag={
                        repairReportData.deleted_at && (
                            <Chip
                                label="Deleted"
                                sx={{
                                    height: 24,
                                    padding: "0px 4px",
                                    color: Colors.wildStrawberry,
                                    fontSize: "12px",
                                    backgroundColor: "rgba(255, 51, 99, 0.08)",
                                    border: "none",
                                    marginLeft: "10px",
                                }}
                            />
                        )
                    }
                />
                <DetailsInfoRow
                    label="점검일자"
                    value={repairReportData.repair_date}
                />
                <DetailsInfoRow
                    label="점검자"
                    value={repairReportData.inspector_name}
                />
                <DetailsInfoRow
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
                                            sx={{
                                                height: 24,
                                                padding: "0px 4px",
                                            }}
                                            key={`pb-${file.id}`}
                                            className="file-clip"
                                            label={file.name}
                                            variant="outlined"
                                            color="oceanBlue"
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
            </div>
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
    ) : (
        <div>
            <CircularProgress />
        </div>
    );
};

export default VRepairReportDetailsTable;

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

    #btn-section {
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
