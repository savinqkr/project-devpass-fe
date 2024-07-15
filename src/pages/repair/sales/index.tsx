import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import SalesTable from "@domains/sales/components/sales-table";
import { css } from "@emotion/react";
import { ProductType } from "@enums";
import { IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const RepairSales: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="유지보수 검수 & 매출" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            유지보수 검수 & 매출
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => router.push(PATH.REPAIR.SALES.REGISTER)}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <SalesTable type={ProductType.MAINTENANCE} />
            </div>
        </BasicTemplate>
    );
};

export default RepairSales;

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
