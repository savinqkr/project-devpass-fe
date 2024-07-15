import { css } from "@emotion/react";
import { IRepairReportTable } from "./RepairReportTable.interface";
import { Switch, useMediaQuery } from "@mui/material";
import { ButtonType, ScreenType } from "@enums";
import { MuiDataGrid } from "@common/components";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector/BasicAutoCompleteSelector.impl";
import BasicIconButton from "@common/components/basic-icon-button/BasicIconButton.impl";
import { IoIosSearch } from "react-icons/io";
import { Colors } from "@configs/colors";
import SearchTextfield from "@common/components/search-textfield/SearchTextfield.impl";

const VRepairReportTable: React.FC<IRepairReportTable.IVProps> = props => {
    const {
        columns,
        rows,
        onClickRow,
        onClickSearch,
        clients,
        projects,
        control,
        showDeleted,
        handleShowDeleted,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <div id="filter-section">
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
                    <SearchTextfield
                        control={control}
                        registerKey="client"
                        options={clients}
                        spaceWidth="0px"
                        width="180px"
                        height="32px"
                        isRoundStyle={true}
                        isClearBtn={false}
                        placeholder="고객사명"
                    />
                    <div className="space" />
                    <SearchTextfield
                        control={control}
                        registerKey="project"
                        options={projects}
                        spaceWidth="1vw"
                        width="180px"
                        height="32px"
                        isRoundStyle={true}
                        isClearBtn={false}
                        placeholder="건명"
                    />
                    <div className="space"></div>
                    <BasicIconButton
                        width="48px"
                        height="32px"
                        type={ButtonType.CONTAINED}
                        icon={<IoIosSearch size={"20px"} />}
                        color={"charcoalGray"}
                        borderRadius="50px"
                        onClick={onClickSearch}
                    />
                </div>
            </div>
            {rows.length === 0 ? (
                <div id="no-data">NO DATA</div>
            ) : (
                <MuiDataGrid
                    rows={rows}
                    columns={columns}
                    onClickRow={onClickRow}
                    rowLimit={10}
                />
            )}
        </div>
    );
};

export default VRepairReportTable;

const rootStyle = (isMedium: boolean) => css`
    #filter-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
        justify-content: ${isMedium ? "end" : "space-between"};
        align-items: ${isMedium ? "end" : "center"};
        margin-bottom: 36px;

        #switch-group {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        #filter-group {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
        }

        .space {
            width: 10px;
        }
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
