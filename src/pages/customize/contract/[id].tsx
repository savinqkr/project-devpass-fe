import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import ContractDetailsTable from "@domains/contract/components/contract-details-table";
import { ProductType } from "@enums";
import { css } from "@mui/material";
import type { NextPage } from "next";

const CustomizeContractDetails: NextPage = () => {
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="커스터마이징 개발 계약 상세"
                    isVisible
                    path={PATH.CUSTOMIZE.CONTRACT.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"커스터마이징 개발 > 커스터마이징 개발 계약 > "}
                        <span css={{ color: Colors.oceanBlue }}>계약 상세</span>
                    </p>
                </div>
                <ContractDetailsTable type={ProductType.CUSTOMIZE} />
            </div>
        </BasicTemplate>
    );
};

export default CustomizeContractDetails;

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
