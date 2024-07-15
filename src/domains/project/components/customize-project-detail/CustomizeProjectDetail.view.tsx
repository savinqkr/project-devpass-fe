import { css } from "@emotion/react";
import { ICustomizeProjectDetail } from "./CustomizeProjectDetail.interface";
import {
    Button,
    Chip,
    Divider,
    IconButton,
    Tab,
    Tabs,
    useMediaQuery,
} from "@mui/material";
import { ScreenType } from "@enums";
import PageSectionTitle from "@common/components/page-section-title";
import { DetailInfoRow, MuiDataGrid } from "@common/components";

import { Colors } from "@configs/colors";
import dayjs from "dayjs";
import CommentsContent from "@domains/comments/components/comments-content/CommentsContent.impl";
import PATH from "@constants/path";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import calculatePeriod from "@utils/calculatePeriod";

const VCustomizeProjectDetail: React.FC<
    ICustomizeProjectDetail.IVProps
> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const {
        projectData,
        employeeColumns,
        employeeRows,
        tabValue,
        estimateColumns,
        estimateRows,
        contractColumns,
        contractRows,
        salesColumns,
        salesRows,
        handleChangeTab,
        onClickEmployeeRow,
        onClickEstimateRow,
        onClickContractRow,
        onClickSalesRow,
        onClickCancelProject,
    } = props;

    const router = useRouter();

    return (
        <div css={rootStyle(isMedium)}>
            <div className="group">
                <PageSectionTitle title="사업 프로필" />
                <div className="contents">
                    <DetailInfoRow
                        label="사업명"
                        value={projectData?.project_by_pk.name}
                        tag={
                            <div
                                css={{ display: "flex", flexDirection: "row" }}
                            >
                                {projectData?.project_by_pk.is_canceled && (
                                    <div
                                        css={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
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
                                        {projectData?.project_by_pk
                                            .canceled_at && (
                                            <p
                                                css={{
                                                    color: Colors.wildStrawberry,
                                                    marginLeft: 6,
                                                    fontSize: 13,
                                                }}
                                            >
                                                {dayjs(
                                                    projectData?.project_by_pk
                                                        .canceled_at
                                                ).format(
                                                    "  YYYY년 MM월 DD일 HH:mm:ss"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {projectData?.project_by_pk.deleted_at && (
                                    <>
                                        <div css={{ width: "10px" }} />
                                        <Chip
                                            label="삭제"
                                            sx={{
                                                height: 24,
                                                padding: "0px 4px",
                                                color: Colors.wildStrawberry,
                                                fontSize: "12px",
                                                backgroundColor:
                                                    "rgba(255, 51, 99, 0.08)",
                                                border: "none",
                                                minWidth: 70,
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        }
                    />
                    <div className="row-section">
                        <DetailInfoRow
                            label="고객사"
                            value={projectData?.project_by_pk.client.name}
                        />
                        <DetailInfoRow
                            label="사업자등록번호"
                            value={projectData?.project_by_pk.client.busi_no}
                        />
                    </div>
                    <div className="row-section">
                        <DetailInfoRow
                            label="계약사"
                            value={projectData?.project_by_pk?.contractor?.name}
                        />
                        <DetailInfoRow
                            label="사업자등록번호"
                            value={
                                projectData?.project_by_pk?.contractor?.busi_no
                            }
                        />
                    </div>
                    <div className="row-section">
                        <DetailInfoRow
                            label="사업 기간"
                            value={`${
                                !!projectData?.project_by_pk?.start_date
                                    ? dayjs(
                                          projectData?.project_by_pk?.start_date
                                      ).format("YYYY년 MM월 DD일")
                                    : ""
                            } ~ ${
                                !!projectData?.project_by_pk?.end_date
                                    ? dayjs(
                                          projectData?.project_by_pk?.end_date
                                      ).format("YYYY년 MM월 DD일")
                                    : ""
                            }`}
                            tag={
                                !!projectData?.project_by_pk.start_date &&
                                !!projectData?.project_by_pk.end_date ? (
                                    <span>{`( 기간 : ${calculatePeriod(
                                        projectData?.project_by_pk.start_date,
                                        projectData?.project_by_pk.end_date
                                    )})`}</span>
                                ) : (
                                    <></>
                                )
                            }
                        />
                    </div>

                    <Divider className="divider" />
                </div>
            </div>

            <div className="group">
                <PageSectionTitle title="담당자" />
                <div className="contents">
                    <Divider className="divider" />
                    <MuiDataGrid
                        rows={employeeRows}
                        columns={employeeColumns}
                        rowLimit={5}
                        onClickRow={onClickEmployeeRow}
                        msg="등록된 담당자가 없습니다."
                    />
                </div>
            </div>
            <div className="group">
                <PageSectionTitle title="사업 하위 활동" />
                <div className="contents">
                    <Tabs
                        className="tab-group"
                        value={tabValue}
                        onChange={handleChangeTab}
                        sx={{
                            borderBottom: `1px solid ${Colors.lightGray}`,
                            minHeight: 32,
                        }}
                    >
                        <Tab className="tab-btn" label="견적" value={0} />
                        <Tab className="tab-btn" label="계약" value={1} />
                        <Tab
                            className="tab-btn"
                            label="검수 & 매출"
                            value={2}
                        />
                    </Tabs>
                    <div className="tab-contents">
                        {tabValue === 0 && (
                            <>
                                <div className="tab-tool">
                                    <IconButton
                                        color="oceanBlue"
                                        onClick={() =>
                                            router.push(
                                                PATH.CUSTOMIZE.ESTIMATE.REGISTER
                                            )
                                        }
                                    >
                                        <IoAddOutline />
                                    </IconButton>
                                </div>
                                <MuiDataGrid
                                    rows={estimateRows}
                                    columns={estimateColumns}
                                    rowLimit={5}
                                    onClickRow={onClickEstimateRow}
                                    msg="등록된 견적이 없습니다."
                                />
                            </>
                        )}
                        {tabValue === 1 && (
                            <>
                                <div className="tab-tool">
                                    <IconButton
                                        color="oceanBlue"
                                        onClick={() =>
                                            router.push(
                                                PATH.CUSTOMIZE.CONTRACT.REGISTER
                                            )
                                        }
                                    >
                                        <IoAddOutline />
                                    </IconButton>
                                </div>
                                <MuiDataGrid
                                    rows={contractRows}
                                    columns={contractColumns}
                                    rowLimit={5}
                                    onClickRow={onClickContractRow}
                                    msg="등록된 계약이 없습니다."
                                />
                            </>
                        )}
                        {tabValue === 2 && (
                            <>
                                <div className="tab-tool">
                                    <IconButton
                                        color="oceanBlue"
                                        onClick={() =>
                                            router.push(
                                                PATH.CUSTOMIZE.SALES.REGISTER
                                            )
                                        }
                                    >
                                        <IoAddOutline />
                                    </IconButton>
                                </div>
                                <MuiDataGrid
                                    rows={salesRows}
                                    columns={salesColumns}
                                    rowLimit={5}
                                    onClickRow={onClickSalesRow}
                                    msg="등록된 검수 & 매출이 없습니다."
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="group">
                <PageSectionTitle title="댓글" />
                <CommentsContent />
            </div>
            <div className="btn-group">
                <Button
                    id="cancel-btn"
                    variant="outlined"
                    color="wildStrawberry"
                    disableElevation
                    disabled={
                        projectData?.project_by_pk.is_canceled ||
                        !!projectData?.project_by_pk.deleted_at
                    }
                    sx={{
                        width: 180,
                        height: 36,
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                    onClick={onClickCancelProject}
                >
                    해지
                </Button>
            </div>
        </div>
    );
};

export default VCustomizeProjectDetail;

const rootStyle = (isMedium: boolean) => css`
    .group {
        display: flex;
        flex-direction: column;
    }
    .contents {
        width: 100%;
        height: 100%;
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .row-section {
        width: 100%;
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
        .space {
            width: 6vw;
        }
    }
    .divider,
    .data-gird,
    .tab-contents {
        width: 100%;
    }
    .tab-tool {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        margin: 4px 0px;
    }
    .data-gird {
        border-radius: 0px;
        border: none;
    }
    .tab-group {
        border-bottom: 1px solid ${Colors.lightGray};
        width: 100%;
    }
    .tab-btn {
        height: 28px;
        font-size: 16px;
    }
    .btn-group {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
        .space {
            width: 10px;
        }
    }

    .MuiTabs-indicator {
        background-color: ${Colors.oceanBlue};
        height: 1.6px;
    }

    .MuiTab-root {
        min-height: 32px;
        font-size: 14px;
        padding: 0px 36px;
    }
`;
