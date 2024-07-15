import { css } from "@emotion/react";
import { IDetailInfoRow } from "./DetailInfoRow.interface";
import { Colors } from "@configs/colors";
import { Divider } from "@mui/material";

const VDetailInfoRow: React.FC<IDetailInfoRow.IVProps> = props => {
    const { label, value, col, isNote, tag, children, isMarkdown, adornment } =
        props;

    return (
        <div css={rootStyle(col, isNote)}>
            <Divider className="section-divider" />
            <div className="info-section">
                <div className="label">
                    <p>{label}</p>
                </div>
                {children ? (
                    <div id={isMarkdown ? "markdown" : "component-area"}>
                        {children}
                    </div>
                ) : (
                    <pre className="value">
                        {(isNote && value === "") || !value || value === ""
                            ? "-"
                            : value}

                        {value && <div id="adornment">{adornment}</div>}
                    </pre>
                )}
                {tag && <div id="tag">{tag}</div>}
            </div>
        </div>
    );
};

export default VDetailInfoRow;

const rootStyle = (col?: number, isNote?: boolean) => css`
    flex: 1;
    width: 100%;
    word-break: break-all;
    font-size: 13.5px;

    #tag {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 20px;
    }

    .section-divider {
        position: relative;
        padding: 0;
        margin: 0;
    }

    .info-section {
        display: flex;
        height: 100%;
        min-height: ${isNote ? "160px" : col ? `${col * 48}px` : "48px"};

        .label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 140px;
            word-break: keep-all;
            background-color: ${Colors.blackOp30};
            white-space: pre-line;
            text-align: center;
            line-height: 1.6;
        }

        .value {
            display: flex;
            justify-content: start;
            align-items: center;
            flex: 1;
            padding-left: 40px;
            white-space: pre-wrap;
            line-height: 1.6;

            #adornment {
                margin-left: 2px;
            }
        }

        .isNote {
            min-height: 70px;
            height: auto;
        }
    }

    #component-area {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 40px;
    }

    #markdown {
        padding: 20px 40px;
        flex: 1;
        a {
            color: ${Colors.oceanBlue};
            text-decoration: underline solid ${Colors.oceanBlue};
        }
    }
`;
