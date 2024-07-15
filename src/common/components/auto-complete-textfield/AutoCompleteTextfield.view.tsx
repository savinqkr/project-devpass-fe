import { css } from "@emotion/react";
import { IAutoCompleteTextfield } from "./AutoCompleteTextfield.interface";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { Colors } from "@configs/colors";
import { Controller } from "react-hook-form";

const VAutoCompleteTextfield: React.FC<
    IAutoCompleteTextfield.IVProps
> = props => {
    const {
        registerKey,
        control,
        watch,
        msg,
        options,
        width,
        label,
        placeholder,
        isRequired,
        isDisabled,
        spaceWidth,
        height,
        noHeader,
    } = props;

    return (
        <div css={rootStyle(spaceWidth, width, height, isDisabled, noHeader)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <Controller
                    control={control}
                    name={registerKey}
                    rules={{ required: isRequired && msg }}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            freeSolo
                            disableClearable
                            options={options}
                            value={watch(registerKey) || ""}
                            onChange={(event, value) => {
                                onChange(value);
                            }}
                            sx={{
                                ".MuiOutlinedInput-root .MuiAutocomplete-input":
                                    {
                                        padding: 0,
                                    },
                            }}
                            renderOption={(props, option) => (
                                <MenuItem
                                    {...props}
                                    value={option}
                                    sx={{
                                        width,
                                        height: 36,
                                    }}
                                    key={option}
                                >
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            fontSize: 12.5,
                                            color: Colors.charcoalGray,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "start",
                                        }}
                                    >
                                        {option}
                                    </Box>
                                </MenuItem>
                            )}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    ref={control.register(registerKey).ref}
                                    error={
                                        !!control.getFieldState(registerKey)
                                            .error
                                    }
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            height: 40,
                                            minHeight: "auto",
                                            fontSize: 12.5,
                                            color: `${Colors.charcoalGray}`,
                                        },
                                        endAdornment: null,
                                    }}
                                    sx={{ flex: 1 }}
                                    InputLabelProps={{
                                        ...params.InputLabelProps,
                                        shrink: false,
                                    }}
                                    placeholder={placeholder}
                                    onChange={e => {
                                        onChange(e.target.value);
                                    }}
                                />
                            )}
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

export default VAutoCompleteTextfield;

const rootStyle = (
    spaceWidth: string,
    width?: string,
    height?: string,
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
