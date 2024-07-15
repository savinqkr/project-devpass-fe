import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import RepairReportTable from "@domains/repair-report/components/repair-report-table/RepairReportTable.impl";
import { css } from "@emotion/react";
import { IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const RepairInspection: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="전체 정기점검" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            전체 정기점검
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.REPAIR.INSPECTION.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <RepairReportTable />
            </div>
        </BasicTemplate>
    );
};

export default RepairInspection;

const rootStyle = css`
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
