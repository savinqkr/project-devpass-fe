import { css } from "@emotion/react";
import { IBasicSnackBar } from "./BasicSnackBar.interface";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Alarm } from "@mui/icons-material";

const VBasicSnackBar: React.FC<IBasicSnackBar.IVProps> = props => {
    const { isOpen, onClose, message } = props;

    return (
        <div css={rootStyle}>
            <Snackbar
                open={isOpen}
                onClose={onClose}
                message={message}
                autoHideDuration={3000}
                action={
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                }
            ></Snackbar>
        </div>
    );
};

export default VBasicSnackBar;

const rootStyle = css`
    display: flex;

    button:last-child {
        margin-left: 20px;
    }
`;
