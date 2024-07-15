import { css } from "@emotion/react";
import { ITailTable } from "./TailTable.interface";
import { CircularProgress, Switch, useMediaQuery } from "@mui/material";
import { Colors } from "@configs/colors";
import { MuiDataGrid, SearchSelector } from "@common/components";
import { ScreenType } from "@enums";

const VTailTable: React.FC<ITailTable.IVProps> = props => {
    const {
        control,
        rows,
        onClickRow,
        columns,
        allTailLength,
        typeOptions,
        showDeleted,
        handleShowDeleted,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            {rows ? (
                rows.length === 0 && allTailLength === 0 ? (
                    <p className="msg">견적서 TAIL을 등록해주세요.</p>
                ) : (
                    <div>
                        <div className="filter-section">
                            <div id="switch-group">
                                <Switch
                                    color="wildStrawberry"
                                    checked={showDeleted}
                                    defaultChecked={false}
                                    onChange={e => {
                                        handleShowDeleted(e.target.checked);
                                    }}
                                />
                                <span
                                    css={{
                                        fontSize: 14,
                                        color: Colors.charcoalGray,
                                    }}
                                >
                                    삭제 포함
                                </span>
                            </div>
                            <div id="filter-group">
                                <SearchSelector
                                    placeholder="구분"
                                    control={control}
                                    registerKey="type"
                                    width="160px"
                                    options={typeOptions}
                                />
                            </div>
                        </div>
                        <div className="table-section">
                            {rows.length <= 0 ? (
                                <div id="no-data">NO DATA</div>
                            ) : (
                                <MuiDataGrid
                                    rows={rows}
                                    columns={columns}
                                    onClickRow={onClickRow}
                                />
                            )}
                        </div>
                    </div>
                )
            ) : (
                <div css={loadingStyle}>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default VTailTable;

const rootStyle = (isMedium: boolean) => css`
    justify-content: space-between;
    align-items: start;

    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 72px;
    }
    .filter-section {
        display: flex;
        justify-content: space-between;
        align-items: ${isMedium ? "start" : "center"};
        flex-direction: ${isMedium ? "column" : "row"};
        margin-bottom: 16px;

        #switch-group {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        #filter-group {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
        }
    }

    .table-section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #no-data {
        width: 100%;
        height: 20vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${Colors.softGray};
    }
`;

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;
