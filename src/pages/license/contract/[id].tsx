import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import LicenseContractDetailsTable from "@domains/contract/components/license-contract-details-table";
import { css } from "@emotion/react";
import type { NextPage } from "next";

const LicenseContractDetails: NextPage = () => {
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="라이선스 계약 상세"
                    isVisible
                    path={PATH.LICENSE.CONTRACT.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > 라이선스 계약 > "}
                        <span css={{ color: Colors.oceanBlue }}>계약 상세</span>
                    </p>
                </div>
                <LicenseContractDetailsTable />
            </div>
        </BasicTemplate>
    );
};

export default LicenseContractDetails;

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
