import { css } from "@emotion/react";
import { ITechSupportEstimateDetail } from "./TechSupportEstimateDetail.interface";
import { Button, Chip, Divider, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import PageSectionTitle from "@common/components/page-section-title";
import { Colors } from "@configs/colors";
import { DetailInfoRow, MuiDataGrid } from "@common/components";
import dayjs from "dayjs";
import ReactHtmlParser from "react-html-parser";
import { GiCheckMark } from "react-icons/gi";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import { useRouter } from "next/router";
import { RiFileExcel2Fill } from "react-icons/ri";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { IoIosSquare } from "react-icons/io";

const VTechSupportEstimateDetail: React.FC<
    ITechSupportEstimateDetail.IVProps
> = props => {
    const {
        finalBtnDisabled,
        estimateData,
        detailColumns,
        detailRows,
        onClickSetFinalEstimateById,
    } = props;

    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <div className="group">
                <PageSectionTitle title="기본정보" />
                <div className="contents">
                    <DetailInfoRow
                        label="고객사"
                        value={estimateData?.estimate_by_pk.project.client.name}
                    />
                    <DetailInfoRow
                        label="기술지원 사업"
                        value={estimateData?.estimate_by_pk.project.name}
                        tag={
                            estimateData?.estimate_by_pk.project
                                .is_canceled && (
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
                                    {estimateData?.estimate_by_pk.project
                                        .canceled_at && (
                                        <p
                                            css={{
                                                color: Colors.wildStrawberry,
                                                marginLeft: 6,
                                                fontSize: 13,
                                            }}
                                        >
                                            {dayjs(
                                                estimateData?.estimate_by_pk
                                                    .project.canceled_at
                                            ).format(
                                                "  YYYY년 MM월 DD일 HH:mm:ss"
                                            )}
                                        </p>
                                    )}
                                </div>
                            )
                        }
                    />
                    <div className="row-section">
                        <DetailInfoRow
                            label="담당자"
                            value={estimateData?.estimate_by_pk.employee_name}
                        />
                        <DetailInfoRow
                            label="이메일"
                            value={estimateData?.estimate_by_pk.employee_email}
                        />
                    </div>
                    <div className="row-section">
                        <DetailInfoRow
                            label="연락처"
                            value={
                                estimateData?.estimate_by_pk.employee_contact
                            }
                        />
                        <DetailInfoRow
                            label="핸드폰 번호"
                            value={estimateData?.estimate_by_pk.employee_phone}
                        />
                    </div>
                    <DetailInfoRow
                        label="수신처"
                        value={estimateData?.estimate_by_pk.destination}
                    />
                    <DetailInfoRow
                        label="문서번호"
                        value={estimateData?.estimate_by_pk.doc_num}
                        tag={
                            <>
                                {estimateData?.estimate_by_pk.is_final && (
                                    <Chip
                                        label="최종 견적"
                                        sx={{
                                            height: 24,
                                            padding: "0px 4px",
                                            color: Colors.oceanBlue,
                                            fontSize: "12px",
                                            backgroundColor:
                                                "rgba(51, 139, 255, 0.12)",
                                            border: "none",
                                        }}
                                    />
                                )}
                                {estimateData?.estimate_by_pk.deleted_at && (
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
                            </>
                        }
                    />
                    <DetailInfoRow
                        label="건명"
                        value={estimateData?.estimate_by_pk.case_name}
                    />
                    <DetailInfoRow
                        label="견적일자"
                        value={dayjs(
                            estimateData?.estimate_by_pk.estimate_date
                        ).format("YYYY년 MM월 DD일")}
                    />
                    <DetailInfoRow
                        label="유효기간"
                        value={dayjs(
                            estimateData?.estimate_by_pk.validity
                        ).format("YYYY년 MM월 DD일")}
                    />
                    <DetailInfoRow
                        label="견적금액"
                        value={`${numberToMoney(
                            moneyToNumber(
                                estimateData?.estimate_by_pk.estimate_price ||
                                    "0"
                            )
                        )} 원`}
                        tag={
                            estimateData?.estimate_by_pk.vat_include && (
                                <div
                                    css={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <GiCheckMark
                                        className="msg-icon"
                                        color={Colors.wildStrawberry}
                                        size={18}
                                        css={{ marginRight: 6 }}
                                    />
                                    <span>부가세포함</span>
                                </div>
                            )
                        }
                    />
                    <Divider className="divider" />
                </div>
            </div>
            <div className="group">
                <PageSectionTitle title="세부내역" />
                <div className="contents">
                    <Divider className="divider" />
                    <MuiDataGrid
                        rows={detailRows}
                        columns={detailColumns}
                        rowLimit={5}
                    />
                    <div id="estimate-detail-group">
                        <DetailInfoRow
                            label="할인율"
                            value={`${estimateData?.estimate_by_pk.discount_rate} %`}
                        />
                        <DetailInfoRow
                            label="공급금액 합계"
                            value={`${numberToMoney(
                                moneyToNumber(
                                    estimateData?.estimate_by_pk.total_price ||
                                        "0"
                                )
                            )} 원`}
                        />
                        {estimateData?.estimate_by_pk.add_special_discount && (
                            <DetailInfoRow
                                label="특별 할인 금액"
                                value={`${numberToMoney(
                                    moneyToNumber(
                                        estimateData?.estimate_by_pk
                                            .special_discount_price || "0"
                                    )
                                )} 원`}
                            />
                        )}
                        {estimateData?.estimate_by_pk.vat_include && (
                            <DetailInfoRow
                                label={"공급금액 합계\n( 부가세포함 )"}
                                value={`${numberToMoney(
                                    moneyToNumber(
                                        estimateData?.estimate_by_pk
                                            .total_price_vat || "0"
                                    )
                                )} 원`}
                            />
                        )}
                        <Divider className="divider" />
                    </div>
                </div>
            </div>
            <div className="group">
                <PageSectionTitle title="Remark" />
                <div className="contents">
                    <div id="tail-box">
                        {ReactHtmlParser(
                            estimateData?.estimate_by_pk.tail || ""
                        )}
                    </div>
                </div>
            </div>
            <div className="group">
                <div className="contents">
                    <p className="msg">
                        <IoIosSquare className="msg-icon" />
                        본사 소속 견적 담당자 정보입니다. 견적서의 공급자 정보와
                        함께 표기됩니다.
                    </p>
                    <DetailInfoRow
                        label="견적 담당자"
                        value={estimateData?.estimate_by_pk.head_employee_name}
                    />
                    <div className="row-section">
                        <DetailInfoRow
                            label="이메일"
                            value={
                                estimateData?.estimate_by_pk.head_employee_email
                            }
                        />
                        <DetailInfoRow
                            label="연락처"
                            value={
                                estimateData?.estimate_by_pk
                                    .head_employee_contact
                            }
                        />
                    </div>
                    <Divider className="divider" />
                </div>
            </div>
            <div className="btn-group">
                <Button
                    id="export-btn excel"
                    variant="contained"
                    color="wildStrawberry"
                    disableElevation
                    sx={{
                        width: 160,
                        height: 36,
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                    disabled={finalBtnDisabled}
                    onClick={onClickSetFinalEstimateById}
                >
                    최종 견적 확정
                </Button>
                <div className="space" />
                <Button
                    id="export-btn excel"
                    variant="contained"
                    color="excelGreen"
                    disableElevation
                    sx={{
                        width: 120,
                        height: 36,
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                    startIcon={<RiFileExcel2Fill size={16} />}
                >
                    <a
                        id="link"
                        // target="_blank"
                        href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/excel/estimate/${id}`}
                    >
                        EXCEL
                    </a>
                </Button>
                <div className="space" />
                <Button
                    id="export-btn excel"
                    variant="contained"
                    color="black"
                    disableElevation
                    sx={{
                        width: 120,
                        height: 36,
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                    startIcon={<BsFillFileEarmarkPdfFill size={16} />}
                >
                    <a
                        id="link"
                        // target="_blank"
                        href={`${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/pdf/estimate/${id}`}
                    >
                        PDF
                    </a>
                </Button>
                <div className="space" />
            </div>
        </div>
    );
};

export default VTechSupportEstimateDetail;

const rootStyle = (isMedium: boolean) => css`
    .group {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .contents {
        width: 100%;
        height: 100%;
        margin: 20px 0px;
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

    .data-gird {
        border-radius: 0px;
        border: none;
    }
    .tab-group {
        border-bottom: 1px solid ${Colors.lightGray};
        width: 100%;
    }
    .tab-btn {
        height: 60px;
    }
    #tail-box {
        width: 100%;
        min-height: 200px;
        padding: 16px;
        border: 1px solid ${Colors.lightGray};
    }
    #estimate-detail-group {
        width: 100%;
        margin-top: 20px;
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
    .msg {
        font-size: 15px;
        color: #babac0;
        margin: 10px 0px;
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
`;
