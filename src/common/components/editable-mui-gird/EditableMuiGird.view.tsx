import { css } from "@emotion/react";
import { IEditableMuiGird } from "./EditableMuiGird.interface";
import {
    DataGrid,
    GridToolbarContainer,
    gridPageCountSelector,
    gridPaginationModelSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "@configs/colors";
import { Pagination } from "@mui/material";
import { IoRemoveOutline } from "react-icons/io5";

// ---------------------------------------------
// CUSTOM PAGINATION
// ---------------------------------------------
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

// ---------------------------------------------
// EDIT TOOLBAR
// ---------------------------------------------
function EditToolbar(props: IEditableMuiGird.EditToolbarProps) {
    const { handleClickAddRow, handleClickDeleteRow } = props;
    return (
        <GridToolbarContainer
            sx={{
                padding: "8px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
            }}
        >
            <Button
                color="oceanBlue"
                startIcon={
                    <AddIcon sx={{ width: 16, padding: 0, margin: 0 }} />
                }
                onClick={handleClickAddRow}
                sx={{
                    height: 32,
                    fontSize: 13,
                }}
            >
                추가
            </Button>
            <Button
                color="wildStrawberry"
                startIcon={
                    <IoRemoveOutline
                        css={{ width: 16, padding: 0, margin: 0 }}
                    />
                }
                onClick={handleClickDeleteRow}
                sx={{
                    height: 32,
                    fontSize: 13,
                }}
            >
                제거
            </Button>
        </GridToolbarContainer>
    );
}

const VEditableMuiGird: React.FC<IEditableMuiGird.IVProps> = props => {
    const {
        apiRef,
        columns,
        rows,
        setRows,
        handleClickAddRow,
        handleClickDeleteRow,
        onCellEditStart,
    } = props;

    return (
        <div css={rootStyle}>
            <DataGrid
                rows={rows}
                columns={columns}
                editMode="cell"
                sx={{
                    width: "100%",
                    borderRadius: 0,
                    fontSize: 13,
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            page: 0,
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                getRowHeight={() => 50}
                disableVirtualization
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                checkboxSelection={true}
                slots={{
                    pagination: CustomPagination,
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { handleClickAddRow, handleClickDeleteRow },
                }}
                apiRef={apiRef}
                getRowId={row => row.id}
                processRowUpdate={newRow => {
                    setRows(
                        rows.map(row => (row.id === newRow.id ? newRow : row))
                    );
                    return newRow;
                }}
                onCellKeyDown={(params, event) => {
                    if (event.key === "Enter") {
                        event.stopPropagation();
                    }
                }}
                onCellEditStart={onCellEditStart}
            />
        </div>
    );
};

export default VEditableMuiGird;

const rootStyle = css`
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
            margin-top: 20px;
        }
        .MuiDataGrid-editInputCell {
            font-size: 13px;
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
