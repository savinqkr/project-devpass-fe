import { css } from "@emotion/react";
import { IInputNote } from "./InputNote.interface";
import { Colors } from "@configs/colors";
import TextField from "@mui/material/TextField";

const VInputNote: React.FC<IInputNote.IVProps> = props => {
    const { register, defaultValue } = props;

    return (
        <div css={rootStyle}>
            <div className="label">
                <p className="Note">비고</p>
            </div>

            <TextField
                id="outlined-basic"
                className={"field"}
                multiline
                defaultValue={defaultValue}
                {...register("note")}
            />
        </div>
    );
};

export default VInputNote;

const rootStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: start;
    padding-left: 32px;

    .label {
        margin-top: 20px;
        margin-right: 90px;
        width: 30px;
        display: flex;

        .Note {
            color: ${Colors.charcoalGray};
        }

        .required-mark {
            margin-left: 2px;
            font-size: 16px;
            color: ${Colors.wildStrawberry};
        }
    }

    .field {
        flex: 1;
        height: 250px;

        div {
            height: 250px;
        }

        input {
            color: ${Colors.charcoalGray};
            font-size: 16px;
        }
    }
`;
