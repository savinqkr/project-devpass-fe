import { css } from "@emotion/react";
import { IBasicMoneyField } from "./BasicMoneyField.interface";
import { Colors } from "@configs/colors";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { InputAdornment } from "@mui/material";

const VBasicMoneyField: React.FC<IBasicMoneyField.IVProps> = props => {
    const {
        control,
        registerKey,
        spaceWidth,
        width,
        height,
        label,
        placeholder,
        isRequired,
        isDisabled,
        isMultiline,
        rows,
        minRows,
        maxRows,
        inputPriceFormat,
        defaultValue,
        startAdornment,
        endAdornment,
        errMsg,
        noHeader,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                Boolean(control.getFieldState(registerKey).error?.message),
                width,
                height,
                noHeader,
                isDisabled
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-section">
                <Controller
                    control={control}
                    name={registerKey}
                    defaultValue={defaultValue ?? ""}
                    rules={{
                        required: isRequired ? errMsg : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            ref={control.register(registerKey).ref}
                            error={!!control.getFieldState(registerKey).error}
                            onChange={(e: any) => {
                                onChange(inputPriceFormat(e.target.value));
                            }}
                            value={value}
                            id="input"
                            placeholder={placeholder}
                            sx={{ flex: 1 }}
                            disabled={isDisabled}
                            multiline={isMultiline}
                            rows={rows}
                            minRows={minRows}
                            maxRows={maxRows}
                            InputProps={{
                                style: {
                                    height: 40,
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
                        />
                    )}
                />
                {control.getFieldState(registerKey).error?.message && (
                    <p id="err-msg">
                        {control.getFieldState(registerKey).error?.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VBasicMoneyField;

const rootStyle = (
    spaceWidth: string,
    isErrVisible: boolean,
    width?: string,
    height?: string,
    noHeader?: boolean,
    isDisabled?: boolean
) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};
    opacity: ${isDisabled ? "50%" : "100%"};
    #head {
        width: ${noHeader ? "0px" : "110px"};
        display: flex;
        flex-direction: row;
        align-items: center;
        #label {
            color: ${Colors.gray};
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

    #input-section {
        display: flex;
        flex: 1;
        flex-direction: column;

        #input {
            height: ${height};
        }

        .adornment {
            p {
                color: ${Colors.softGray};
                font-size: 12.5px;
            }
        }
        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: ${isErrVisible && "10px"};
            font-size: 14px;
        }
    }
`;
