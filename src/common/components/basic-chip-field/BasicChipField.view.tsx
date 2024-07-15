import { css } from "@emotion/react";
import { IBasicChipField } from "./BasicChipField.interface";
import { Colors } from "@configs/colors";
import React from "react";
import { Chip } from "@mui/material";

const VBasicChipField: React.FC<IBasicChipField.IVProps> = props => {
    const {
        isCompleted,
        label,
        chipLabel,
        spaceWidth,
        chipStyle,
        chipWidth,
        width,
        height,
        errMsg,
        color,
        isRequired,
        isDisabled,
    } = props;

    return (
        <div css={rootStyle(spaceWidth, label, width, height)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <Chip
                    label={chipLabel}
                    color={isCompleted ? color : "softGray"}
                    variant={chipStyle}
                    disabled={isDisabled}
                    sx={{ width: chipWidth ?? "120px", height: 24 }}
                />
                {!isCompleted && <p id="msg-section">{errMsg}</p>}
            </div>
        </div>
    );
};

export default VBasicChipField;

const rootStyle = (
    spaceWidth: string,
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
            word-break: keep-all;
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

        label {
            color: ${Colors.softGray};
        }

        #msg-section {
            color: ${Colors.wildStrawberry};
            margin-top: 10px;
            font-size: 14px;
        }
    }
`;
