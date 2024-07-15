import { css } from "@emotion/react";
import { ITableWithLabel } from "./TableWithLabel.interface";
import EditableMuiGird from "../editable-mui-gird";
import { Colors } from "@configs/colors";

const VTableWithLabel: React.FC<ITableWithLabel.IVProps> = props => {
    const {
        label,
        spaceWidth,
        isRequired,
        columns,
        rows,
        setRows,
        apiRef,
        handleClickAddRow,
        handleClickDeleteRow,
    } = props;

    return (
        <div css={rootStyle(spaceWidth)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="table-area">
                <EditableMuiGird
                    columns={columns}
                    rows={rows}
                    setRows={setRows}
                    apiRef={apiRef}
                    handleClickAddRow={handleClickAddRow}
                    handleClickDeleteRow={handleClickDeleteRow}
                />
            </div>
        </div>
    );
};

export default VTableWithLabel;

const rootStyle = (spaceWidth: string) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: start;

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
    #table-area {
        width: calc(100% - 110px - ${spaceWidth});
    }
`;
