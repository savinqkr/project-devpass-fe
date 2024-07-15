import { css } from "@emotion/react";
import { ISearchSelector } from "./SearchSelector.interface";
import { Colors } from "@configs/colors";
import { MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

const VSearchSelector: React.FC<ISearchSelector.IVProps> = props => {
    const { control, registerKey, options, placeholder, isDisabled, width } =
        props;
    return (
        <div css={rootStyle(width)}>
            <Controller
                control={control}
                name={registerKey}
                defaultValue={"default"}
                render={({ field: { onChange, value } }) => (
                    <Select
                        id="selector"
                        value={value}
                        disabled={isDisabled}
                        onChange={e => {
                            onChange(e.target.value);
                        }}
                        sx={{
                            flex: 1,
                            height: 32,
                            fontSize: 12,
                            paddingTop: 0.5,
                            color:
                                value === "default"
                                    ? Colors.softGray
                                    : Colors.charcoalGray,
                            borderRadius: 32,
                        }}
                        inputProps={{
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
                                        height: 28,
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
                                        height: 28,
                                        fontSize: 12,
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
            <p id="err-msg">
                {control.getFieldState(registerKey).error?.message}
            </p>
        </div>
    );
};

export default VSearchSelector;

const rootStyle = (width?: string) => css`
    width: ${width ? width : "100%"};
    height: 32px;
    display: flex;
    flex-direction: column;
`;
