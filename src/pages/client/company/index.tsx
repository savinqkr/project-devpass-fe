import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import type { NextPage } from "next";
import { BasicTemplate, PageTitle } from "@common/components";
import { CompanyList } from "@domains/company";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const ClientCompany: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="전체 거래처" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"거래처 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            전체 거래처
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.CLIENT.COMPANY.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <CompanyList />
            </div>
        </BasicTemplate>
    );
};

export default ClientCompany;

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
