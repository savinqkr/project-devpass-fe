import PageTitle from "@common/components/page-title";
import { Colors } from "@configs/colors";
import { css } from "@emotion/react";
import type { NextPage } from "next";
import ProductTable from "@domains/product/components/product-table/ProductTable.impl";
import BasicTemplate from "@common/components/templates/basic-template";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const Product: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="전체 제품" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"제품 > "}
                        <span css={{ color: Colors.oceanBlue }}>전체 제품</span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => router.push(PATH.PRODUCT.REGISTER)}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <ProductTable />
            </div>
        </BasicTemplate>
    );
};

export default Product;

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
