import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { BasicTemplate, PageTitle } from "@common/components";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import PATH from "@constants/path";
import { RepairEstiamteList } from "@domains/estimate/components";

const RepairEstimate: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="유지보수 전체 견적" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            유지보수 견적
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.REPAIR.ESTIMATE.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <RepairEstiamteList />
            </div>
        </BasicTemplate>
    );
};

export default RepairEstimate;

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
