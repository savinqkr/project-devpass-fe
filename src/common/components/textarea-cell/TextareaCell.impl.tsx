import { useState } from "react";
import { ITextareaCell } from "./TextareaCell.interface";
import VTextareaCell from "./TextareaCell.view";

const TextareaCell: React.FC<ITextareaCell.IProps> = props => {
    const { id, field, value, colDef, hasFocus } = props;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
    };

    const numberOfLines = value ? value.split("\n").length : 1;

    return (
        <VTextareaCell
            {...props}
            numberOfLines={numberOfLines}
            anchorEl={anchorEl}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
        />
    );
};

export default TextareaCell;
