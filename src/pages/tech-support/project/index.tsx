import type { NextPage } from "next";
import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import { BasicTemplate, PageTitle } from "@common/components";
import TechSupportProjectList from "@domains/project/components/tech-support-project-list";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import PATH from "@constants/path";

const TechSupportProject: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="기술지원 전체 사업" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"기술지원 > 기술지원 사업 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            기술지원 전체 사업
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => {
                            return router.push(
                                PATH.TECHSUPPORT.PROJECT.REGISTER
                            );
                        }}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <TechSupportProjectList />
            </div>
        </BasicTemplate>
    );
};

export default TechSupportProject;

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
