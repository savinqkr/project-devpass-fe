import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import TailDetailsTable from "@domains/tail/components/tail-details-table";
import { css } from "@mui/material";
import type { NextPage } from "next";

const TailDetails: NextPage = () => {
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="견적서 TAIL 상세"
                    isVisible={true}
                    path={PATH.ADMIN.SETTINGS.TAIL.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            견적서 TAIL 상세
                        </span>
                    </p>
                </div>
                <TailDetailsTable />
            </div>
        </BasicTemplate>
    );
};

export default TailDetails;

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

    .regi-btn {
        width: 18px;
        height: 42px;
        color: #1976d2;
    }
`;
