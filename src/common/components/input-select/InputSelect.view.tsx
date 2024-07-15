import { css } from "@emotion/react";
import { IInputSelect } from "./InputSelect.interface";
import { Colors } from "@configs/colors";
import { FormControl, MenuItem, Select } from "@mui/material";

const VInputSelect: React.FC<IInputSelect.IVProps> = props => {
    const {
        label,
        type,
        optionItems,
        isRequired,
        register,
        selectedValue,
        onChange,
    } = props;

    return (
        <div className="input-section" css={rootStyle}>
            <div className="label">
                <p className="text">{label}</p>
                <p className="required-mark">{isRequired ? "*" : ""}</p>
            </div>
            {optionItems ? (
                <div>
                    <FormControl>
                        {isRequired ? (
                            // --- required : true ---
                            <Select
                                value={selectedValue}
                                className={"select"}
                                {...register(type, {
                                    required: true,
                                    onChange(event) {
                                        onChange(event);
                                    },
                                })}
                            >
                                {optionItems.map(item => {
                                    return (
                                        <MenuItem
                                            value={item.code}
                                            key={`${item.code}${item.value}`}
                                        >
                                            {item.value}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        ) : (
                            // --- required : false ---
                            <Select
                                value={selectedValue}
                                className={"select"}
                                {...register(type, {
                                    onChange(event) {
                                        onChange(event);
                                    },
                                })}
                            >
                                {optionItems.map(item => {
                                    return (
                                        <MenuItem
                                            value={item.code}
                                            key={`${item.code}${item.value}`}
                                        >
                                            {item.value}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        )}
                    </FormControl>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default VInputSelect;

const rootStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 32px;
    width: 570px;

    .label {
        display: flex;

        .text {
            color: ${Colors.charcoalGray};
        }

        .required-mark {
            margin-left: 2px;
            font-size: 16px;
            color: ${Colors.wildStrawberry};
        }
    }

    .select {
        width: 420px;
        height: 40px;
    }

    .error-msg {
        padding-top: 2px;
        font-size: 11px;
        color: ${Colors.wildStrawberry};
    }
`;
