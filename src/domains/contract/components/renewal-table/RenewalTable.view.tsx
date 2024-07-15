import { css } from "@emotion/react";
import { IRenewalTable } from "./RenewalTable.interface";
import { TextField, useMediaQuery } from "@mui/material";
import { ButtonType, ScreenType } from "@enums";
import SearchTextfield from "@common/components/search-textfield";
import BasicIconButton from "@common/components/basic-icon-button";
import { IoIosSearch } from "react-icons/io";
import { MuiDataGrid, SearchSelector } from "@common/components";
import { Colors } from "@configs/colors";
import { Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { MdCalendarMonth } from "react-icons/md";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const VRenewalTable: React.FC<IRenewalTable.IVProps> = props => {
    const {
        columns,
        rows,
        onClickRow,
        onClickSearch,
        clients,
        projects,
        types,
        control,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <div id="filter-section">
                <div className="filter-row">
                    <SearchSelector
                        control={control}
                        registerKey="type"
                        options={types}
                        width="180px"
                        placeholder="구분"
                    />

                    <div className="space" />
                    <SearchTextfield
                        control={control}
                        registerKey="project"
                        options={projects}
                        spaceWidth="0px"
                        width="180px"
                        height="32px"
                        isRoundStyle={true}
                        isClearBtn={false}
                        placeholder="사업명"
                    />
                    <div className="space" />
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
                </div>
                <div style={{ height: "8px" }} />
                <div className="filter-row">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Controller
                            control={control}
                            name={"start_date"}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    format="YYYY/MM/DD"
                                    className="input"
                                    slots={{
                                        openPickerIcon: MdCalendarMonth,
                                    }}
                                    onChange={(e: any) => {
                                        onChange(
                                            e ? dayjs(e).utc(true) : undefined
                                        );
                                    }}
                                    value={value || null}
                                    slotProps={{
                                        field: {
                                            clearable: true,
                                        },
                                        textField: {
                                            variant: "outlined",
                                            sx: {
                                                "& .MuiInputBase-root": {
                                                    minWidth: "80px",
                                                    maxWidth: "180px",
                                                    borderRadius: "50px",
                                                    height: "32px",
                                                    fontSize: "12px",
                                                },
                                                "& .MuiFormLabel-root": {
                                                    top: "-8px",
                                                    fontSize: "13px",
                                                    textAlign: "center",
                                                },
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                        <div className="space" />
                        <Controller
                            control={control}
                            name={"end_date"}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    format="YYYY/MM/DD"
                                    className="input"
                                    slots={{
                                        openPickerIcon: MdCalendarMonth,
                                    }}
                                    onChange={(e: any) => {
                                        onChange(
                                            e ? dayjs(e).utc(true) : undefined
                                        );
                                    }}
                                    value={value || null}
                                    slotProps={{
                                        field: {
                                            clearable: true,
                                        },
                                        textField: {
                                            variant: "outlined",
                                            sx: {
                                                "& .MuiInputBase-root": {
                                                    minWidth: "80px",
                                                    maxWidth: "180px",
                                                    borderRadius: "50px",
                                                    height: "32px",
                                                    fontSize: "12px",
                                                },
                                                "& .MuiFormLabel-root": {
                                                    top: "-8px",
                                                    fontSize: "13px",
                                                    textAlign: "center",
                                                },
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    <div className="space" />
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
                {!isMedium && (
                    <p
                        style={{
                            marginRight: "58px",
                            marginTop: "5px",
                            fontSize: "12px",
                            color: Colors.charcoalGray,
                        }}
                    >
                        기간 필터 미적용 시 계약 종료일까지 90일 미만인 대상을
                        조회합니다.
                    </p>
                )}
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

export default VRenewalTable;

const rootStyle = (isMedium: boolean) => css`
    #filter-section {
        display: flex;
        flex-direction: column;

        align-items: end;
        margin-bottom: 35px;

        .space {
            width: ${!isMedium && "10px"};
            height: ${isMedium && "5px"};
        }

        .filter-row {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
            align-items: end;

            &:first-of-type {
                margin-right: ${!isMedium && "58px"};
            }
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
