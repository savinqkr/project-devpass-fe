import { css } from "@emotion/react";
import { IBasicMoneyDatePicker } from "./BasicMoneyDatePicker.interface";
import { Colors } from "@configs/colors";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { InputAdornment } from "@mui/material";
import dayjs from "dayjs";

const VBasicMoneyDatePicker: React.FC<
    IBasicMoneyDatePicker.IVProps
> = props => {
    const {
        moneyRegisterKey,
        dateRegisterKey,
        control,
        spaceWidth,
        width,
        height,
        label,
        errMsg,
        placeholder,
        isRequired,
        isDisabled,
        inputPriceFormat,
        startAdornment,
        endAdornment,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                Boolean(control.getFieldState(moneyRegisterKey).error?.message),
                width,
                height
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-section">
                <div id="input-group">
                    <div id="text-field">
                        <Controller
                            control={control}
                            name={moneyRegisterKey}
                            defaultValue={""}
                            rules={{
                                required: isRequired ? errMsg?.money : false,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    value={value}
                                    onChange={(e: any) => {
                                        onChange(
                                            inputPriceFormat(e.target.value)
                                        );
                                    }}
                                    type="text"
                                    id="text-input"
                                    placeholder={placeholder}
                                    disabled={isDisabled}
                                    sx={{ width: "100%" }}
                                    InputProps={{
                                        style: {
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
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div id="date-picker">
                            <Controller
                                control={control}
                                name={dateRegisterKey}
                                defaultValue={null}
                                rules={{
                                    required: isRequired ? errMsg?.date : false,
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker
                                        format="YYYY/MM/DD"
                                        sx={{ width: "100%" }}
                                        className="input"
                                        value={value}
                                        onChange={(e: any) => {
                                            onChange(dayjs(e).utc(true));
                                        }}
                                        disabled={isDisabled}
                                        label={placeholder ?? "대금 청구 일자"}
                                        slots={{
                                            openPickerIcon:
                                                CalendarTodayOutlinedIcon,
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </LocalizationProvider>
                </div>
                <p id="err-msg">
                    {control.getFieldState(moneyRegisterKey).error?.message ??
                        control.getFieldState(dateRegisterKey).error?.message}
                </p>
            </div>
        </div>
    );
};

export default VBasicMoneyDatePicker;

const rootStyle = (
    spaceWidth: string,
    isErrVisible: boolean,
    width?: string,
    height?: string
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
        flex: 1;

        #input-group {
            display: flex;
            justify-content: space-between;

            #text-field {
                width: 55%;
                height: ${height ?? "40px"};
                font-size: 12.5px;
                color: ${Colors.charcoalGray};

                div {
                    height: ${height ?? "40px"};
                }

                label: {
                    font-size: 12.5px;
                }

                .adornment {
                    p {
                        color: ${Colors.softGray};
                        font-size: 12.5px;
                    }
                }
            }

            #date-picker {
                padding-left: 10px;
                width: 45%;
                height: ${height ?? "40px"};
                font-size: 12.5px;

                div {
                    height: ${height ?? "40px"};
                }

                label {
                    color: ${Colors.softGray};
                    top: ${height ?? "-4px"};
                    font-size: 12.5px;
                }

                input {
                    font-size: 12.5px;
                }

                svg {
                    color: ${Colors.oceanBlue};
                }
            }
        }

        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: ${isErrVisible && "10px"};
            font-size: 13px;
        }
    }

    .MuiInputBase-root {
        height: 40px;
        display: flex;
        align-items: center;
    }
    .MuiInputBase-input {
        font-size: 12.5px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
    }
    .MuiIconButton-root {
        padding-right: 10px;
    }
    .MuiSvgIcon-root {
        width: 20px;
        height: 20px;
    }
    .MuiInputLabel-root {
        font-size: 12.5px;
        color: ${Colors.softGray};
        position: absolute;
        top: -2px;
    }
`;
