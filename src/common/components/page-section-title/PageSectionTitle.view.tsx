import { css } from "@emotion/react";
import { IPageSectionTitle } from "./PageSectionTitle.interface";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { Colors } from "@configs/colors";

const VPageSectionTitle: React.FC<IPageSectionTitle.IVProps> = props => {
    const { title } = props;
    return (
        <div css={rootStyle}>
            <SquareRoundedIcon
                fontSize="small"
                sx={{ width: 16, color: Colors.oceanBlue }}
            />
            <h2>{title}</h2>
        </div>
    );
};

export default VPageSectionTitle;

const rootStyle = css`
    display: flex;
    align-items: center;
    flex: 1;

    h2 {
        margin-left: 12px;
        font-size: 16px;
        font-weight: 400;
    }
`;
