import { css } from "@emotion/react";
import { ISearchTextfield } from "./SearchTextfield.interface";
import { Colors } from "@configs/colors";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const VSearchTextfield: React.FC<ISearchTextfield.IVProps> = props => {
    const {
        control,
        registerKey,
        options,
        isDisabled,
        width,
        height,
        placeholder,
        isClearBtn,
        isRoundStyle,
    } = props;

    return (
        <div css={rootStyle(width, height)}>
            <div id="input-section">
                <Controller
                    control={control}
                    name={registerKey}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            freeSolo
                            id={`search-textfield-${registerKey}`}
                            disabled={isDisabled}
                            disableClearable={true}
                            clearIcon={null}
                            defaultValue={null}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason !== "reset") {
                                    onChange({
                                        label: newInputValue,
                                        value: null,
                                    });
                                }
                            }}
                            onChange={(e, item) => {
                                onChange(item);
                            }}
                            value={value || ""}
                            options={options}
                            getOptionLabel={option => option.label || ""}
                            isOptionEqualToValue={(option, value) => {
                                return option.value === value.value;
                            }}
                            renderOption={(props, option) => (
                                <MenuItem
                                    {...props}
                                    value={option.value}
                                    sx={{
                                        width,
                                        height: 36,
                                    }}
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
                                        {option.label}
                                    </Box>
                                </MenuItem>
                            )}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={!value && placeholder}
                                    InputProps={{
                                        ...params.InputProps,
                                        style: {
                                            width,
                                            height: 32,
                                            borderRadius: 32,
                                            fontSize: 12.5,
                                            padding: "1px 10px",
                                        },
                                        endAdornment: null,
                                    }}
                                    InputLabelProps={{
                                        ...params.InputLabelProps,
                                        shrink: false,
                                        style: {
                                            fontSize: 13,
                                            textAlign: "center",
                                            top: "-8px",
                                        },
                                    }}
                                />
                            )}
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default VSearchTextfield;

const rootStyle = (width?: string, height?: string) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};

    #label {
        color: ${Colors.softGray};
    }

    #input-section {
        flex: 1;

        #autocomplete-input {
            height: height;
            padding: ${height && 0};
        }
    }
`;
