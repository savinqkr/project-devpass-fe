import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import CustomizeProjectList from "@domains/project/components/customize-project-list";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import PATH from "@constants/path";

const CustomizeProject: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="커스터마이징 개발 전체 사업"
                    isVisible={false}
                />
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
                            return router.push(PATH.CUSTOMIZE.PROJECT.REGISTER);
                        }}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <CustomizeProjectList />
            </div>
        </BasicTemplate>
    );
};

export default CustomizeProject;

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
