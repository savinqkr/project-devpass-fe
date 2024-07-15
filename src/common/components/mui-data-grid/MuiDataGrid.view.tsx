import { css } from "@emotion/react";
import { IMuiDataGrid } from "./MuiDataGrid.interface";
import { Colors } from "@configs/colors";
import {
    DataGrid,
    GridCallbackDetails,
    GridRowParams,
    MuiEvent,
    gridPageCountSelector,
    gridPaginationModelSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import { Pagination } from "@mui/material";

// CUSTOM PAGINATION
function CustomPagination() {
    const apiRef = useGridApiContext();
    const paginationModel = useGridSelector(
        apiRef,
        gridPaginationModelSelector
    );
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            className="pagination"
            count={pageCount}
            page={paginationModel.page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

const VMuiDataGrid: React.FC<IMuiDataGrid.IVProps> = props => {
    const {
        rows,
        columns,
        rowLimit,
        onClickRow,
        onRowSelectionModelChange,
        checkboxSelection,
        apiRef,
        msg,
    } = props;

    return (
        <div css={rootStyle}>
            {rows.length === 0 ? (
                <p id="msg">{!!msg ? msg : "선택된 옵션이 없습니다."}</p>
            ) : (
                <DataGrid
                    className="data-gird"
                    editMode="cell"
                    rows={rows}
                    columns={columns}
                    sx={{
                        width: "100%",
                        border: "none",
                        borderTop: `1px solid ${Colors.lightGray}`,
                        borderRadius: 0,
                        fontSize: 13,
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: 0,
                                pageSize: !!rowLimit ? rowLimit : 10, // row limit : 한페이지에 표시되는 행의 수
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    getRowHeight={() => 48}
                    slots={{
                        pagination: CustomPagination,
                    }}
                    disableVirtualization
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    disableDensitySelector
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    checkboxSelection={checkboxSelection}
                    apiRef={apiRef}
                    getRowId={row => row.id}
                    onRowClick={(
                        params: GridRowParams,
                        event: MuiEvent,
                        details: GridCallbackDetails
                    ) => {
                        !!onClickRow && onClickRow(params.row.pk);
                    }}
                    onRowSelectionModelChange={params => {
                        !!onRowSelectionModelChange &&
                            onRowSelectionModelChange(params);
                    }}
                />
            )}
        </div>
    );
};

export default VMuiDataGrid;

const rootStyle = css`
    width: 100%;
    min-height: 100px;
    height: 100%;

    #msg {
        color: ${Colors.softGray};
        font-size: 16px;
        text-align: center;
        margin: 56px auto;
    }

    /* DATA GRID */
    .MuiDataGrid-root {
        .MuiDataGrid-cell:focus,
        .MuiDataGrid-cell:focus-within,
        .MuiDataGrid-columnHeader:focus,
        .MuiDataGrid-columnHeader:focus-within {
            outline: none;
        }
        .MuiDataGrid-columnHeader {
            color: ${Colors.softGray};
        }
        .MuiDataGrid-row {
            cursor: pointer;
        }
        .MuiCheckbox-root {
            transform: scale(0.7);
        }
        .MuiDataGrid-footerContainer {
            border: none;
            margin-top: 8px;
        }
    }

    /* PAGINATION */
    .MuiPagination-root {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .Mui-selected {
        color: ${Colors.black};
        background-color: transparent;
    }
    .MuiPaginationItem-text {
        color: ${Colors.softGray};
    }

    .MuiPaginationItem-root.Mui-selected {
        color: ${Colors.black};
        background-color: transparent;
    }
`;
