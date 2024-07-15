import { ISearchAutoComplete } from "./SearchAutoComplete.interface";
import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";
import { Colors } from "@configs/colors";

const VSearchAutoComplete: React.FC<ISearchAutoComplete.IVProps> = props => {
    const { setValue, register, registerKey, options, placeholder, width } =
        props;

    return (
        <Autocomplete
            freeSolo
            disableClearable
            options={options}
            onChange={(event, value) => {
                setValue(registerKey, value);
            }}
            renderOption={(props, option) => (
                <MenuItem
                    {...props}
                    value={option}
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
                        {option}
                    </Box>
                </MenuItem>
            )}
            renderInput={params => (
                <TextField
                    {...params}
                    {...register(registerKey)}
                    placeholder={placeholder || ""}
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
                    }}
                />
            )}
        />
    );
};

export default VSearchAutoComplete;
