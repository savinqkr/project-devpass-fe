import { css } from "@emotion/react";
import { IContractTable } from "./ContractTable.interface";
import { MuiDataGrid } from "@common/components";
import { Colors } from "@configs/colors";
import SearchTextfield from "@common/components/search-textfield";
import BasicIconButton from "@common/components/basic-icon-button";
import { ButtonType, ScreenType } from "@enums";
import { IoIosSearch } from "react-icons/io";
import {
    FormControlLabel,
    Switch,
    ToggleButton,
    useMediaQuery,
} from "@mui/material";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector/BasicAutoCompleteSelector.impl";

const VContractTable: React.FC<IContractTable.IVProps> = props => {
    const {
        columns,
        rows,
        onClickRow,
        control,
        clientOptions,
        projectOptions,
        onClickSearchBtn,
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
                        options={clientOptions}
                        spaceWidth="0px"
                        width="180px"
                        height="32px"
                        placeholder="고객사명"
                    />
                    <div className="space" />
                    <SearchTextfield
                        placeholder="사업"
                        control={control}
                        registerKey="project"
                        options={projectOptions}
                        spaceWidth="0px"
                        height="32px"
                        width="180px"
                    />
                    <div className="space" />
                    <BasicIconButton
                        width="48px"
                        height="32px"
                        type={ButtonType.CONTAINED}
                        icon={<IoIosSearch size={"20px"} />}
                        color={"charcoalGray"}
                        borderRadius="50px"
                        onClick={onClickSearchBtn}
                    />
                </div>
            </div>
            <div id="table-section">
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
    );
};

export default VContractTable;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    width: 100%;

    #filter-section {
        margin-bottom: 36px;
        display: flex;
        justify-content: space-between;
        align-items: ${isMedium ? "start" : "center"};
        flex-direction: ${isMedium ? "column" : "row"};

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
            width: ${!isMedium && "10px"};
            height: ${isMedium && "10px"};
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
