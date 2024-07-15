import { css } from "@emotion/react";
import { IBasicTextField } from "./BasicTextField.interface";
import { Colors } from "@configs/colors";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

const VBasicTextField: React.FC<IBasicTextField.IVProps> = props => {
    const {
        register,
        registerKey,
        errors,
        validate,
        pattern,
        minLength,
        onChange,
        spaceWidth,
        width,
        height,
        label,
        showMsg,
        isErrMsg,
        msg,
        placeholder,
        isRequired,
        isPassword,
        isDisabled,
        isMultiline,
        rows,
        minRows,
        maxRows,
        isNumber,
        noHeader,
        noBorder,
        startAdornment,
        endAdornment,
        handleBeforeInput,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                width,
                height,
                isErrMsg,
                isDisabled,
                noHeader
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <TextField
                    {...register(registerKey, {
                        required: isRequired,
                        validate,
                        pattern,
                        minLength,
                        onChange,
                    })}
                    ref={register(registerKey).ref}
                    error={Boolean(!!errors && errors![registerKey])}
                    onBeforeInput={handleBeforeInput}
                    InputProps={{
                        inputProps: isNumber ? { step: "any" } : {},
                        style: {
                            height: isMultiline ? "auto" : 40,
                            minHeight: isMultiline ? 132 : "auto",
                            fontSize: 12.5,
                            color: `${Colors.charcoalGray}`,
                        },
                        startAdornment: startAdornment && (
                            <InputAdornment
                                className="adornment"
                                position="start"
                            >
                                {startAdornment}
                            </InputAdornment>
                        ),
                        endAdornment: endAdornment && (
                            <InputAdornment
                                className="adornment"
                                position="end"
                            >
                                {endAdornment}
                            </InputAdornment>
                        ),
                    }}
                    className="input"
                    type={
                        isNumber ? "number" : isPassword ? "password" : "text"
                    }
                    placeholder={placeholder}
                    sx={{ flex: 1, overflow: isMultiline ? "auto" : "hidden" }}
                    disabled={isDisabled}
                    multiline={isMultiline}
                    rows={rows}
                    minRows={minRows}
                    maxRows={maxRows}
                />
                {!!showMsg && !!msg && <p id="msg">{msg}</p>}
                {!!errors && errors![registerKey] && (
                    <p id="err-msg">
                        {(errors![registerKey]?.message as string) || msg}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VBasicTextField;

const rootStyle = (
    spaceWidth: string,
    width?: string,
    height?: string,
    isErrMsg?: boolean,
    isDisabled?: boolean,
    noHeader?: boolean
) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};

    #head {
        width: ${noHeader ? "0px" : "110px"};
        display: flex;
        flex-direction: row;
        align-items: center;
        #label {
            color: ${isDisabled ? Colors.lightGray : Colors.gray};
            margin-right: 16px;
            white-space: pre-line;
            line-height: 1.6;
            font-size: 14px;
        }
        #star {
            color: ${Colors.wildStrawberry};
        }
        margin-right: ${spaceWidth};
    }

    .input {
        height: ${height};
    }

    #input-group {
        display: flex;
        flex: 1;
        flex-direction: column;

        #msg {
            color: ${isErrMsg ? Colors.wildStrawberry : Colors.oceanBlue};
            margin-top: 10px;
            font-size: 13px;
        }
        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: 10px;
            font-size: 13px;
        }

        .adornment {
            p {
                color: ${Colors.softGray};
                font-size: 12.5px;
            }
        }
    }
`;
