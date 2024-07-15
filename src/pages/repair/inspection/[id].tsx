import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import RepairReportDetailsTable from "@domains/repair-report/components/repair-report-details/RepairReportDetailsTable.impl";
import { css } from "@emotion/react";
import type { NextPage } from "next";

const RepairInspectionDetails: NextPage = () => {
    return (
        <div css={rootStyle}>
            <BasicTemplate>
                <PageTitle
                    title="정기점검 상세"
                    isVisible
                    path={PATH.REPAIR.INSPECTION.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > 정기점검 > 전체 정기점검 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            정기점검 상세
                        </span>
                    </p>
                </div>
                <RepairReportDetailsTable />
            </BasicTemplate>
        </div>
    );
};

export default RepairInspectionDetails;

const rootStyle = css`
    margin-bottom: 50px;

    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }
    .menu-info {
        color: ${Colors.gray};
    }
`;
