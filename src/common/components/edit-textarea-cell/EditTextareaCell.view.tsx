import { css } from "@emotion/react";
import { IEditTextareaCell } from "./EditTextareaCell.interface";
import { InputBase, Paper, Popper } from "@mui/material";
import { GridStateColDef } from "@mui/x-data-grid/internals";

const VEditTextareaCell: React.FC<IEditTextareaCell.IVProps> = props => {
    const {
        handleRef,
        anchorEl,
        colDef,
        valueState,
        handleChange,
        setInputRef,
    } = props;
    return (
        <div css={rootStyle(colDef)}>
            <div ref={handleRef} className="popper-parent" />
            {anchorEl && (
                <Popper open anchorEl={anchorEl} placement="bottom-start">
                    <Paper
                        elevation={1}
                        sx={{ p: 1, minWidth: colDef.computedWidth }}
                    >
                        <InputBase
                            multiline
                            rows={6}
                            value={valueState}
                            sx={{
                                textarea: { resize: "both" },
                                width: "100%",
                                minWidth: colDef.computedWidth,
                            }}
                            onChange={handleChange}
                            inputRef={ref => setInputRef(ref)}
                        />
                    </Paper>
                </Popper>
            )}
        </div>
    );
};

export default VEditTextareaCell;

const rootStyle = (colRef: GridStateColDef) => css`
    width: 200%;
    height: 100%;
    position: relative;
    align-self: flex-start;

    .popper-parent {
        display: block;
        position: absolute;
        width: ${colRef.computedWidth};
        top: 0;
        left: 0;
        right: 0;
    }
`;
