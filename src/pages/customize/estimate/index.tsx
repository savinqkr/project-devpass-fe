import type { NextPage } from "next";
import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import { BasicTemplate, PageTitle } from "@common/components";
import { CustomizeEstimateList } from "@domains/estimate/components";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import PATH from "@constants/path";
import { IoAddOutline } from "react-icons/io5";

const CustomizeEstimate: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="커스터마이징 개발 전체 견적"
                    isVisible={false}
                />
                <div className="group">
                    <p className="menu-info">
                        {"커스터마이징 개발 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            커스터마이징 개발 견적
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.CUSTOMIZE.ESTIMATE.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <CustomizeEstimateList />
            </div>
        </BasicTemplate>
    );
};

export default CustomizeEstimate;

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
