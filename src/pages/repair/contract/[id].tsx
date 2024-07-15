import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import ContractDetailsTable from "@domains/contract/components/contract-details-table";
import { css } from "@emotion/react";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const RepairContractDetails: NextPage = () => {
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="유지보수 계약 상세"
                    isVisible
                    path={PATH.REPAIR.CONTRACT.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > 유지보수 계약 > "}
                        <span css={{ color: Colors.oceanBlue }}>계약 상세</span>
                    </p>
                </div>
                <ContractDetailsTable type={ProductType.MAINTENANCE} />
            </div>
        </BasicTemplate>
    );
};

export default RepairContractDetails;

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
