import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import ContractTable from "@domains/contract/components/contract-table";
import { ProductType } from "@enums";
import { css, IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const LicenseContract: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="라이선스 전체 계약" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            라이선스 계약
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.LICENSE.CONTRACT.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <ContractTable
                    type={ProductType.LICENSE}
                    routePath={PATH.LICENSE.CONTRACT.MAIN}
                />
            </div>
        </BasicTemplate>
    );
};

export default LicenseContract;

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
