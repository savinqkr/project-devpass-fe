import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import SalesDetailsTable from "@domains/sales/components/sales-details-table";
import { ProductType } from "@enums";
import { css } from "@mui/material";
import type { NextPage } from "next";

const CustomizeSalesDetails: NextPage = () => {
    return (
        <div css={rootStyle}>
            <BasicTemplate>
                <PageTitle
                    title="커스터마이징 개발 검수 & 매출 상세"
                    isVisible
                    path={PATH.CUSTOMIZE.SALES.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"커스터마이징 개발 > 커스터마이징 개발 검수 & 매출 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            검수 & 매출 상세
                        </span>
                    </p>
                </div>
                <SalesDetailsTable type={ProductType.CUSTOMIZE} />
            </BasicTemplate>
        </div>
    );
};

export default CustomizeSalesDetails;

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
