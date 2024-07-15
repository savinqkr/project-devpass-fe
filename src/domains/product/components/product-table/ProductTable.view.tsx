import { css } from "@emotion/react";
import { IProductTable } from "./ProductTable.interface";
import {
    CircularProgress,
    FormControlLabel,
    Switch,
    useMediaQuery,
} from "@mui/material";
import { MuiDataGrid, SearchSelector } from "@common/components";
import { Colors } from "@configs/colors";
import { ScreenType } from "@enums";

const VProductTable: React.FC<IProductTable.IVProps> = props => {
    const {
        onClickRow,
        productsData,
        header,
        typeOptions,
        control,
        showDeleted,
        handleShowDeleted,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <div id="filter">
                <div id="switch-group">
                    <Switch
                        checked={showDeleted}
                        defaultChecked={false}
                        color="wildStrawberry"
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
                        control={control}
                        registerKey="type"
                        options={typeOptions}
                        placeholder="구분"
                        width="180px"
                    />
                </div>
            </div>
            {productsData ? (
                productsData.length === 0 ? (
                    <div className="msg">제품을 등록해주세요.</div>
                ) : (
                    <MuiDataGrid
                        rows={productsData}
                        columns={header}
                        rowLimit={10}
                        onClickRow={onClickRow}
                    />
                )
            ) : (
                <div css={loadingStyle}>
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default VProductTable;

const rootStyle = (isMedium: boolean) => css`
    .msg {
        color: ${Colors.softGray};
        font-size: 20px;
        text-align: center;
        margin-top: 72px;
    }

    #filter {
        display: flex;
        justify-content: space-between;
        align-items: ${isMedium ? "start" : "space-between"};
        margin-bottom: 20px;

        #switch-group {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
`;
const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;
