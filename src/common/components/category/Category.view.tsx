import { css } from "@emotion/react";
import { ICategory } from "./Category.interface";
import { Colors } from "@configs/colors";

const VCategory: React.FC<ICategory.IVProps> = props => {
    return (
        <div css={rootStyle}>
            <span>{props.category}</span>
        </div>
    );
};

export default VCategory;

const rootStyle = css`
    padding: 8px 0px 8px 18px;
    font-size: 14px;
    font-weight: 500;
    color: ${Colors.softGray};
`;
