import { css } from "@emotion/react";
import { IPageTitle } from "./PageTitle.interface";
import { IoArrowBack } from "react-icons/io5";
import Divider from "@mui/material/Divider";
import { Colors } from "@configs/colors";
import { IconButton } from "@mui/material";

const VPageTitle: React.FC<IPageTitle.IVProps> = props => {
    const { title, isVisible, onClickRouteBack } = props;
    return (
        <div css={rootStyle}>
            <div className="head">
                {isVisible && (
                    <IconButton className="back-btn" onClick={onClickRouteBack}>
                        <IoArrowBack size={20} color={Colors.charcoalGray} />
                    </IconButton>
                )}
                <div className="title">{title}</div>
            </div>
            <Divider />
        </div>
    );
};

export default VPageTitle;

const rootStyle = css`
    width: 100%;
    .head {
        padding-bottom: 12px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        color: ${Colors.charcoalGray};
    }

    .title {
        font-size: 20px;
    }

    .back-btn {
        margin-right: 16px;
        cursor: pointer;
    }
`;
