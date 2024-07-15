import { css } from "@emotion/react";
import { IBasicAutoCompleteSelector } from "./BasicAutoCompleteSelector.interface";
import { Colors } from "@configs/colors";
import { Autocomplete, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const VBasicAutoCompleteSelector: React.FC<
    IBasicAutoCompleteSelector.IVProps
> = props => {
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
        size,
        errMsg,
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
                    disabled={isDisabled}
                    defaultValue={options[0]}
                    rules={{
                        required: isRequired ? errMsg : false,
                        validate: {
                            check: value => {
                                return value?.value !== "default" || errMsg;
                            },
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            size={size ?? "medium"}
                            options={options}
                            disabled={isDisabled}
                            id="autocomplete-input"
                            sx={{
                                flex: 1,
                                "& .MuiInputBase-root": { height: height },
                                height: 40,
                                fontSize: 12.5,
                                color:
                                    value === "default"
                                        ? Colors.softGray
                                        : Colors.black,
                            }}
                            onChange={(e, item) => {
                                onChange(item || "");
                            }}
                            value={value}
                            defaultValue={options[0]}
                            getOptionLabel={option => option.label || ""}
                            isOptionEqualToValue={(option, value) => {
                                return option.value === value.value;
                                // return true;
                            }}
                            getOptionDisabled={option => option === options[0]}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    disabled={isDisabled}
                                    ref={control.register(registerKey).ref}
                                    error={
                                        !!control.getFieldState(registerKey)
                                            .error
                                    }
                                    sx={{
                                        ".MuiInputBase-input": {
                                            height: 7,
                                            fontSize: 12.5,
                                            color:
                                                value?.value === "default"
                                                    ? Colors.softGray
                                                    : Colors.black,
                                        },
                                    }}
                                />
                            )}
                            renderOption={(props, option) => {
                                return (
                                    <MenuItem
                                        {...props}
                                        key={`${option.value}-${option.label}`}
                                        value={option.value}
                                        disabled={option.value === "default"}
                                        sx={{
                                            height: 36,
                                            fontSize: 13,
                                            color: Colors.charcoalGray,
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                );
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

export default VBasicAutoCompleteSelector;

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
            height: height;
            padding: ${height && 0};
        }
    }
`;
