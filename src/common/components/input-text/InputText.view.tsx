import { css } from "@emotion/react";
import { IInputText } from "./InputText.interface";
import { Colors } from "@configs/colors";
import TextField from "@mui/material/TextField";

const VInputText: React.FC<IInputText.IVProps> = props => {
    const {
        label,
        type,
        isRequired,
        isText,
        register,
        defaultValue,
        inputPriceFormat,
        value,
        setValue,
    } = props;

    return (
        <div css={rootStyle}>
            <div className="label">
                <p className="Text">{label}</p>
                <p className="required-mark">{isRequired ? "*" : ""}</p>
            </div>
            <div>
                {isRequired ? (
                    <TextField
                        type={"text"}
                        id="outlined-basic"
                        className={"field"}
                        value={value}
                        {...register(type, {
                            required: true,
                            onChange(event) {
                                if (!isText) {
                                    setValue(
                                        inputPriceFormat(event.target.value)
                                    );
                                } else if (isText) {
                                    setValue(event.target.value);
                                }
                            },
                        })}
                    />
                ) : (
                    <TextField
                        type={isText ? "text" : "number"}
                        id="outlined-basic"
                        className={"field"}
                        defaultValue={defaultValue}
                        {...register(type)}
                    />
                )}
            </div>
        </div>
    );
};

export default VInputText;

const rootStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 32px;
    width: 570px;

    .label {
        display: flex;

        .Text {
            color: ${Colors.charcoalGray};
        }

        .required-mark {
            margin-left: 2px;
            font-size: 16px;
            color: ${Colors.wildStrawberry};
        }
    }

    .field {
        width: 420px;
        height: 40px;

        div {
            height: 40px;
        }

        input {
            color: ${Colors.charcoalGray};
            font-size: 16px;
            height: 10px;
        }
    }

    .error-msg {
        padding-top: 2px;
        color: ${Colors.wildStrawberry};
        font-size: 10px;
    }
`;
