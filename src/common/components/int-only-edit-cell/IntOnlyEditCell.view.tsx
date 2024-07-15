import { css } from "@emotion/react";
import { IIntOnlyEditInputCell } from "./IntOnlyEditCell.interface";
import { TextField } from "@mui/material";

const VIntOnlyEditInputCell: React.FC<
    IIntOnlyEditInputCell.IVProps
> = props => {
    const { value, handleChange } = props;
    return (
        <TextField
            value={value || ""}
            onChange={handleChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            variant="outlined"
            fullWidth
        />
    );
};

export default VIntOnlyEditInputCell;

const rootStyle = css``;
