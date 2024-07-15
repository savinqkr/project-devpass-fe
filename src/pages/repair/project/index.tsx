import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import { IconButton } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";
import { css } from "@emotion/react";
import { RepairProjectList } from "@domains/project";

const RepairProject: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="유지보수 전체 사업" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            유지보수 사업
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.REPAIR.PROJECT.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <RepairProjectList />
            </div>
        </BasicTemplate>
    );
};

export default RepairProject;
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
