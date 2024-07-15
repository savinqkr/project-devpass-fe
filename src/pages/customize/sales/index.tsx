import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import SalesTable from "@domains/sales/components/sales-table";
import { ProductType } from "@enums";
import { css, IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const CustomizeSales: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="커스터마이징 개발 검수 & 매출"
                    isVisible={false}
                />
                <div className="group">
                    <p className="menu-info">
                        {"커스터마이징 개발 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            커스터마이징 개발 검수 & 매출
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.CUSTOMIZE.SALES.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <SalesTable type={ProductType.CUSTOMIZE} />
            </div>
        </BasicTemplate>
    );
};

export default CustomizeSales;

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
