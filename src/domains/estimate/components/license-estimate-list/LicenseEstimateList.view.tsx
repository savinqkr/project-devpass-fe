import { css } from "@emotion/react";
import { ILicenseEstimateList } from "./LicenseEstimateList.interface";
import { Colors } from "@configs/colors";
import { MuiDataGrid, SearchAutoComplete } from "@common/components";
import { Button, Switch } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import SearchTextfield from "@common/components/search-textfield";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { Permission } from "@enums";

const VLicenseEstimateList: React.FC<ILicenseEstimateList.IVProps> = props => {
    const {
        isLoading,
        register,
        control,
        setValue,
        onClickSearch,
        rows,
        columns,
        onClickRow,
        clientOptions,
        caseNameOptions,
        projectOptions,
        destinationOptions,
        showDeleted,
        handleChange,
    } = props;

    const loginUser = useRecoilValue(loginState);

    return (
        <div css={rootStyle}>
            {" "}
            <div className="search-bar">
                <div id="search-start">
                    {loginUser.permission === Permission.ADMIN && (
                        <>
                            <Switch
                                color="wildStrawberry"
                                checked={showDeleted}
                                onChange={handleChange}
                            />
                            <span
                                css={{
                                    fontSize: 14,
                                    color: Colors.charcoalGray,
                                }}
                            >
                                삭제 포함
                            </span>
                        </>
                    )}
                </div>
                <div id="search-end">
                    <SearchAutoComplete
                        width="200px"
                        placeholder="사업명"
                        register={register}
                        setValue={setValue}
                        registerKey="project_name"
                        options={projectOptions}
                    />
                    <div className="space" />
                    <SearchAutoComplete
                        width="200px"
                        placeholder="고객사"
                        register={register}
                        setValue={setValue}
                        registerKey="client_name"
                        options={clientOptions}
                    />
                    <div className="space" />
                    <SearchAutoComplete
                        width="200px"
                        placeholder="수신처"
                        register={register}
                        setValue={setValue}
                        registerKey="destination"
                        options={destinationOptions}
                    />
                    <div className="space" />
                    <SearchAutoComplete
                        width="200px"
                        placeholder="건명"
                        register={register}
                        setValue={setValue}
                        registerKey="case_name"
                        options={caseNameOptions}
                    />
                    <div className="space" />
                    <Button
                        color="charcoalGray"
                        variant="contained"
                        disableElevation
                        id="search-btn"
                        onClick={onClickSearch}
                    >
                        <IoIosSearch id="search-icon" />
                    </Button>
                </div>
            </div>
            {rows.length === 0 ? (
                <div className="msg">등록된 견적이 없습니다.</div>
            ) : (
                <MuiDataGrid
                    rows={rows}
                    columns={columns}
                    rowLimit={10}
                    onClickRow={onClickRow}
                />
            )}
        </div>
    );
};

export default VLicenseEstimateList;

const rootStyle = css`
    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 72px;
    }
    .search-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    #search-start {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    #search-end {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        .textfield {
            margin-right: 10px;
        }
        #search-btn {
            min-width: 48px;
            width: 48px;
            height: 32px;
            border-radius: 32px;
        }
        #search-icon {
            min-width: 20px;
            width: 20px;
            height: 20px;
        }
    }
    .space {
        width: 10px;
    }
`;
