import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import TailTable from "@domains/tail/components/tail-table/TailTable.impl";
import { IconButton, css } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { IoAddOutline } from "react-icons/io5";

const Tail: NextPage = () => {
    const router = useRouter();

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="견적서 TAIL 설정" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            견적서 TAIL 설정
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.ADMIN.SETTINGS.TAIL.REGISTER)
                        }
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
                <TailTable />
            </div>
        </BasicTemplate>
    );
};

export default Tail;

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
        width: 80px;
        height: 42px;
        color: #1976d2;
    }
`;
