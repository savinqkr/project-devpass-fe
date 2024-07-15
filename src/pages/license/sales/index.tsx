import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import SalesTable from "@domains/sales/components/sales-table/SalesTable.impl";
import { css } from "@emotion/react";
import { ProductType } from "@enums";
import { IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const LicenseSales: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="라이선스 검수 & 매출" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            라이선스 검수 & 매출
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => router.push(PATH.LICENSE.SALES.REGISTER)}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <SalesTable type={ProductType.LICENSE} />
            </div>
        </BasicTemplate>
    );
};

export default LicenseSales;

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
