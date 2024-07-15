import { css } from "@emotion/react";
import { IBasicDatePicker } from "./BasicDatePicker.interface";
import { Colors } from "@configs/colors";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import React from "react";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const VBasicDatePicker: React.FC<IBasicDatePicker.IVProps> = props => {
    const {
        control,
        registerKey,
        spaceWidth,
        width,
        height,
        label,
        errMsg,
        placeholder,
        isRequired,
        isDisabled,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                Boolean(control.getFieldState(registerKey).error?.message),
                label,
                width,
                height
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <Controller
                    name={registerKey}
                    control={control}
                    defaultValue={null}
                    rules={{
                        required: isRequired ? errMsg : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                ref={control.register(registerKey).ref}
                                format="YYYY/MM/DD"
                                disabled={isDisabled}
                                className="input"
                                label={placeholder ?? "날짜를 선택해주세요."}
                                slots={{
                                    openPickerIcon: CalendarTodayOutlinedIcon,
                                }}
                                value={value}
                                onChange={(e: any) => {
                                    onChange(dayjs(e).utc(true));
                                }}
                                sx={{ flex: 1 }}
                            />
                        </LocalizationProvider>
                    )}
                />

                <p id="msg-section">
                    {control.getFieldState(registerKey).error?.message}
                </p>
            </div>
        </div>
    );
};

export default VBasicDatePicker;

const rootStyle = (
    spaceWidth: string,
    isErrVisible: boolean,
    label?: string,
    width?: string,
    height?: string
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

    #input {
        height: ${height};
    }

    #input-group {
        display: flex;
        flex: 1;
        flex-direction: column;

        svg {
            color: ${Colors.oceanBlue};
        }

        label {
            color: ${Colors.softGray};
        }

        #msg-section {
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
