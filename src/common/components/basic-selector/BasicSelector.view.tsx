import { css } from "@emotion/react";
import { IBasicSelector } from "./BasicSelector.interface";
import { Colors } from "@configs/colors";
import { MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

const VBasicSelector: React.FC<IBasicSelector.IVProps> = props => {
    const {
        control,
        registerKey,
        options,
        label,
        isRequired,
        isDisabled,
        width,
        height,
        spaceWidth,
        borderRadius,
        msg,
    } = props;
    return (
        <div
            css={rootStyle(
                spaceWidth,
                width,
                height,
                label,
                !!control.getFieldState(registerKey).error?.message
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
                    defaultValue={"default"}
                    rules={{
                        required: isRequired ? msg : "",
                        validate: {
                            check: value => {
                                return value !== "default" || msg;
                            },
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            id="selector"
                            value={value}
                            disabled={isDisabled}
                            ref={control.register(registerKey).ref}
                            error={!!control.getFieldState(registerKey).error}
                            onChange={e => {
                                onChange(e.target.value);
                            }}
                            sx={{
                                flex: 1,
                                height: height ?? "40px",
                                maxHeight: height ?? "40px",
                                fontSize: 12.5,
                                color:
                                    value === "default"
                                        ? Colors.softGray
                                        : Colors.black,
                                borderRadius: borderRadius,
                            }}
                            inputProps={{
                                style: {
                                    height: 40,
                                    fontSize: 12.5,
                                    color: `${Colors.charcoalGray}`,
                                },
                                MenuProps: { disableScrollLock: true },
                            }}
                        >
                            {options?.map(option => {
                                return option?.value === "default" ? (
                                    <MenuItem
                                        key={`${option?.value}-${option?.label}`}
                                        value={option?.value}
                                        disabled
                                        sx={{
                                            height: 36,
                                            fontSize: 12,
                                            color: Colors.charcoalGray,
                                        }}
                                    >
                                        {option?.label}
                                    </MenuItem>
                                ) : (
                                    <MenuItem
                                        key={`${option?.value}-${option?.label}`}
                                        value={option?.value}
                                        sx={{
                                            height: 36,
                                            fontSize: 13,
                                            color: Colors.charcoalGray,
                                        }}
                                    >
                                        {option?.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
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

export default VBasicSelector;

const rootStyle = (
    spaceWidth: string,
    width?: string,
    height?: string,
    label?: string,
    errorExists?: boolean
) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};

    #head {
        width: ${label ? "110px" : "0px"};
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
        height: ${errorExists ? "66px" : "40px"};
        display: flex;
        flex: 1;
        flex-direction: column;

        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: 10px;
            font-size: 13px;
        }

        #autocomplete-input {
            height: 40px;
            padding: ${height && 0};
        }
    }
`;
