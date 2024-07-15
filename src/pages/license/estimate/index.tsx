import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { LicenseEstimateList } from "@domains/estimate/components";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import PATH from "@constants/path";
import { useRouter } from "next/router";

const LicenseEstimate: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="라이선스 전체 견적" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            라이선스 견적
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.LICENSE.ESTIMATE.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <LicenseEstimateList />
            </div>
        </BasicTemplate>
    );
};

export default LicenseEstimate;

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
