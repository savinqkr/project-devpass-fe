import { css } from "@emotion/react";
import { IFormattedTextfield } from "./FormattedTextfield.interface";
import { IMaskInput } from "react-imask";
import { TextField } from "@mui/material";
import React from "react";
import { Colors } from "@configs/colors";
import { Controller } from "react-hook-form";

interface CustomProps {
    mask: {
        mask: string;
    }[];
    name: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
}

const TextMaskAdapter = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskAdapter(props, ref) {
        const { name, mask, onChange, ...other } = props;

        return (
            <IMaskInput
                {...other}
                mask={mask}
                dispatch={(appended, dynamicMasked) => {
                    if (mask.length > 1) {
                        const number = (dynamicMasked.value + appended).replace(
                            /\D/g,
                            ""
                        );

                        // 서울: 02, 경기: 031, 인천: 032, 강원: 033, 부산: 051, 충북: 043, 충남: 041, 경북: 054, 경남: 055, 전남: 061, 전북: 063
                        // 앞자리가 02 인지 체크
                        if (number.length === 10) {
                            if (number.startsWith("02")) {
                                return dynamicMasked.compiledMasks[1]; // ( 10 자리 ) 00-0000-0000
                            } else {
                                return dynamicMasked.compiledMasks[2]; // ( 10 자리 ) 000-000-0000
                            }
                        }

                        if (number.length === 11) {
                            return dynamicMasked.compiledMasks[3]; // ( 11 자리 ) 000-0000-0000
                        }

                        return dynamicMasked.compiledMasks[0]; // ( 9 자리 ) 00-000-0000
                    } else {
                        return dynamicMasked.compiledMasks[0];
                    }
                }}
                definitions={{
                    "#": /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name, value } })}
                overwrite
            />
        );
    }
);

const VFormattedTextfield: React.FC<IFormattedTextfield.IVProps> = props => {
    const {
        control,
        registerKey,
        msg,
        label,
        placeholder,
        defaultValue,
        isRequired,
        isDisabled,
        spaceWidth,
        width,
        height,
        handleChange,
        mask,
        name,
    } = props;

    return (
        <div css={rootStyle(spaceWidth, width, height, isDisabled)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <Controller
                    control={control}
                    name={registerKey}
                    defaultValue={defaultValue}
                    rules={{
                        required: isRequired ? msg : "",
                        validate: {
                            check: value => {
                                return value !== "default" || msg;
                            },
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            className="input"
                            value={value}
                            onChange={e => {
                                onChange(e.target.value);
                            }}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            InputProps={{
                                inputComponent: TextMaskAdapter as any,
                                inputProps: {
                                    mask,
                                    name,
                                    onChange: handleChange,
                                },
                                style: {
                                    height: 40,
                                    minHeight: "auto",
                                    fontSize: 12.5,
                                    color: `${Colors.charcoalGray}`,
                                },
                            }}
                        />
                    )}
                />
                {control.getFieldState(registerKey).error && (
                    <p id="err-msg">
                        {control.getFieldState(registerKey).error?.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VFormattedTextfield;

const rootStyle = (
    spaceWidth: string,
    width?: string,
    height?: string,
    isDisabled?: boolean,
    label?: boolean
) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};

    #head {
        width: 110px;
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
            color: ${Colors.wildStrawberry};
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
