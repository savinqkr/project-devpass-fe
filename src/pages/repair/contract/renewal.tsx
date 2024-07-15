import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import RenewalTable from "@domains/contract/components/renewal-table/RenewalTable.impl";
import { css } from "@emotion/react";
import type { NextPage } from "next";

const RepairContractRenewal: NextPage = () => {
    return (
        <div css={rootStyle}>
            <BasicTemplate>
                <PageTitle title="유지보수 계약 대상 고객" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > 유지보수 계약 대상 고객 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            유지보수 계약 대상 고객
                        </span>
                    </p>
                </div>
                <RenewalTable />
            </BasicTemplate>
        </div>
    );
};

export default RepairContractRenewal;

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
