import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { LicenseProjectList } from "@domains/project";
import { IconButton } from "@mui/material";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import PATH from "@constants/path";

const LicenseProject: NextPage = () => {
    const router = useRouter();
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="라이선스 전체 사업" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"라이선스 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            라이선스 사업
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.LICENSE.PROJECT.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <LicenseProjectList />
            </div>
        </BasicTemplate>
    );
};

export default LicenseProject;

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
