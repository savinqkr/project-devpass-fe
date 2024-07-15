import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import SalesDetailsTable from "@domains/sales/components/sales-details-table/SalesDetailsTable.impl";
import { css } from "@emotion/react";
import { ProductType } from "@enums";

import type { NextPage } from "next";

const LicenseSalesDetails: NextPage = () => {
    return (
        <div css={rootStyle}>
            <BasicTemplate>
                <PageTitle
                    title="라이선스 검수 & 매출 상세"
                    isVisible
                    path={PATH.LICENSE.SALES.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > 라이선스 검수 & 매출 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            검수 & 매출 상세
                        </span>
                    </p>
                </div>
                <SalesDetailsTable type={ProductType.LICENSE} />
            </BasicTemplate>
        </div>
    );
};

export default LicenseSalesDetails;

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
