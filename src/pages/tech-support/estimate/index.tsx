import type { NextPage } from "next";
import { css } from "@emotion/react";
import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import TechSupportEstimateList from "@domains/estimate/components/tech-support-estimate-list";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import PATH from "@constants/path";
import { IoAddOutline } from "react-icons/io5";

const TechSupportEstimate: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="기술지원 전체 견적" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"기술지원 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            기술지원 견적
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.TECHSUPPORT.ESTIMATE.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <TechSupportEstimateList />
            </div>
        </BasicTemplate>
    );
};

export default TechSupportEstimate;

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
