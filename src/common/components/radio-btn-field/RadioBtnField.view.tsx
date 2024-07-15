import { css } from "@emotion/react";
import { IRadioBtnField } from "./RadioBtnField.interface";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Colors } from "@configs/colors";
import { Controller } from "react-hook-form";

const VRadioBtnField: React.FC<IRadioBtnField.IVProps> = props => {
    const {
        label,
        isRequired,
        options,
        control,
        registerKey,
        spaceWidth,
        defaultValue,
    } = props;

    return (
        <div css={rootStyle(spaceWidth)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div className="radio-btn-group">
                <Controller
                    control={control}
                    name={registerKey}
                    defaultValue={defaultValue}
                    render={({ field: { onChange, value } }) => {
                        return (
                            <RadioGroup
                                row
                                value={value || options[0]?.value}
                                onChange={onChange}
                            >
                                {options.map(option => (
                                    <FormControlLabel
                                        sx={{
                                            "& .MuiFormControlLabel-label": {
                                                fontSize: "13px",
                                                color: Colors.charcoalGray,
                                            },
                                        }}
                                        key={option.value}
                                        value={option.value}
                                        control={
                                            <Radio
                                                size="small"
                                                sx={{
                                                    "&.Mui-checked": {
                                                        color: Colors.wildStrawberry,
                                                    },
                                                }}
                                            />
                                        }
                                        label={option.label}
                                    />
                                ))}
                            </RadioGroup>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default VRadioBtnField;

const rootStyle = (spaceWidth: string) => css`
    display: flex;
    flex-direction: row;
    align-items: start;
    width: 100%;

    #head {
        width: 110px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 6px;
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
`;
