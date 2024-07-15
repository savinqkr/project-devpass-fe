import { css } from "@emotion/react";
import { ITextareaCell } from "./TextareaCell.interface";
import { InputBase, Paper, Popper } from "@mui/material";
import { GridStateColDef } from "@mui/x-data-grid/internals";

const VTextareaCell: React.FC<ITextareaCell.IVProps> = props => {
    const {
        id,
        field,
        value,
        colDef,
        hasFocus,
        handleMouseEnter,
        handleMouseLeave,
        anchorEl,
        numberOfLines,
    } = props;

    return (
        <div
            css={rootStyle(colDef)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {value}
            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom-start"
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 1,
                        minWidth: "120%",
                        position: "absoClute",
                    }}
                >
                    <InputBase
                        readOnly
                        multiline
                        rows={numberOfLines}
                        value={value}
                        sx={{
                            textarea: { resize: "both" },
                            width: "100%",
                            minWidth: colDef.computedWidth,
                        }}
                    />
                </Paper>
            </Popper>
        </div>
    );
};

export default VTextareaCell;

const rootStyle = (colRef: GridStateColDef) => css`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
`;
