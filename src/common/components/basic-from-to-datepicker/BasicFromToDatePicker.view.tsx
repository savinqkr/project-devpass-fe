import { css } from "@emotion/react";
import { IBasicFromToDatePicker } from "./BasicFromToDatePicker.interface";
import { Colors } from "@configs/colors";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const VBasicFromToDatePicker: React.FC<
    IBasicFromToDatePicker.IVProps
> = props => {
    const {
        control,
        fromRegisterKey,
        toRegisterKey,
        spaceWidth,
        fieldWidth,
        width,
        height,
        label,
        errMsg,
        fromPlaceholder,
        toPlaceholder,
        isRequired,
        isDisabled,
        iconColor,
        icon,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                Boolean(control.getFieldState(fromRegisterKey).error?.message),
                width,
                height,
                iconColor
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div id="picker-group">
                        <Controller
                            control={control}
                            name={fromRegisterKey}
                            defaultValue={null}
                            rules={{
                                required: isRequired ? errMsg?.from : false,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    ref={control.register(fromRegisterKey).ref}
                                    format="YYYY/MM/DD"
                                    className="input"
                                    disabled={isDisabled}
                                    label={fromPlaceholder ?? "From"}
                                    slots={{
                                        openPickerIcon:
                                            icon ?? CalendarTodayOutlinedIcon,
                                    }}
                                    onChange={(e: any) => {
                                        onChange(dayjs(e).utc(true));
                                    }}
                                    value={value}
                                    sx={{
                                        width: fieldWidth ? fieldWidth : "100%",
                                    }}
                                />
                            )}
                        />
                        <p id="seperator">~</p>
                        <Controller
                            control={control}
                            name={toRegisterKey}
                            defaultValue={null}
                            rules={{
                                required: isRequired ? errMsg?.to : false,
                            }}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    ref={control.register(toRegisterKey).ref}
                                    format="YYYY/MM/DD"
                                    className="input"
                                    disabled={isDisabled}
                                    label={toPlaceholder ?? "To"}
                                    slots={{
                                        openPickerIcon:
                                            icon ?? CalendarTodayOutlinedIcon,
                                    }}
                                    onChange={(e: any) => {
                                        onChange(dayjs(e).utc(true));
                                    }}
                                    value={value}
                                    sx={{
                                        width: fieldWidth ? fieldWidth : "100%",
                                    }}
                                />
                            )}
                        />
                    </div>
                </LocalizationProvider>
                <p id="err-msg">
                    {control.getFieldState(fromRegisterKey).error?.message ??
                        control.getFieldState(toRegisterKey).error?.message}
                </p>
            </div>
        </div>
    );
};

export default VBasicFromToDatePicker;

const rootStyle = (
    spaceWidth: string,
    isErrVisible: boolean,
    width?: string,
    height?: string,
    iconColor?: any
) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${width ? width : "100%"};

    #seperator {
        margin: 0px 12px;
        font-size: 18px;
        color: ${Colors.charcoalGray};
    }

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

    #input {
        height: ${height};
    }

    #input-group {
        display: flex;
        flex: 1;
        flex-direction: column;
        #picker-group {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            label {
                color: ${Colors.softGray};
            }

            svg {
                color: ${iconColor ?? Colors.oceanBlue};
            }
        }

        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: ${isErrVisible && "10px"};
            font-size: 14px;
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
        top: -3px;
    }
`;
