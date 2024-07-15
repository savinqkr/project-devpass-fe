import { css } from "@emotion/react";
import { ITailDetailsTable } from "./TailDetailsTable.interface";
import DetailInfoRow from "@common/components/details-info-row/DetailInfoRow.impl";
import {
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import { Colors } from "@configs/colors";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { ScreenType } from "@enums";

const VTailDetailsTable: React.FC<ITailDetailsTable.IVProps> = props => {
    const { tail, onClickDelete } = props;
    const router = useRouter();
    const id = router.query.id as string;
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return tail ? (
        <div css={rootStyle(isMedium)}>
            <div className="btn-group">
                <IconButton
                    color="oceanBlue"
                    onClick={() =>
                        router.push(`${PATH.ADMIN.SETTINGS.TAIL.EDIT}/${id}`)
                    }
                >
                    <MdOutlineEdit size={20} />
                </IconButton>
                <div className="space" />
                <IconButton color="wildStrawberry" onClick={onClickDelete}>
                    <MdOutlineDelete size={20} />
                </IconButton>
            </div>
            <div>
                <DetailInfoRow
                    label="구분"
                    value={tail.type}
                    col={1}
                    isNote={false}
                />
                <DetailInfoRow
                    label="TAIL 명"
                    value={tail.name}
                    col={1}
                    isNote={false}
                    tag={
                        tail.deleted_at && (
                            <Chip
                                label="Deleted"
                                sx={{
                                    height: 24,
                                    padding: "0px 4px",
                                    color: Colors.wildStrawberry,
                                    fontSize: "12px",
                                    backgroundColor: "rgba(255, 51, 99, 0.08)",
                                    border: "none",
                                }}
                            />
                        )
                    }
                />
                <DetailInfoRow
                    label="TAIL 내용"
                    col={4}
                    isNote={false}
                    isMarkdown
                >
                    {ReactHtmlParser(tail.contents)}
                </DetailInfoRow>
                <Divider />
            </div>
        </div>
    ) : (
        <div css={loadingStyle}>
            <CircularProgress />
        </div>
    );
};

export default VTailDetailsTable;

const rootStyle = (isMedium: boolean) => css`
    position: relative;
    margin-top: 35px;

    .btn-group {
        position: absolute;
        width: 80px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        top: ${isMedium ? "-40px" : "-50px"};
        right: 0;

        .space {
            width: 16px;
        }
    }
`;

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;
