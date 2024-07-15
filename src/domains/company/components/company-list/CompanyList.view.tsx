import { css } from "@emotion/react";
import { ICompanyList } from "./Company.interface";
import { Colors } from "@configs/colors";
import {
    MuiDataGrid,
    SearchAutoComplete,
    SearchSelector,
} from "@common/components";
import { Button, Switch } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { Permission } from "@enums";
import loginState from "@recoils/login-state.atom";
import { useRecoilValue } from "recoil";

const VCompanyList: React.FC<ICompanyList.IVProps> = props => {
    const {
        rows,
        columns,
        onClickRow,
        companyNameOptions,
        // companyTypeOptions,
        control,
        register,
        setValue,
        onClickSearch,
        showDeleted,
        handleChange,
    } = props;

    const loginUser = useRecoilValue(loginState);

    return (
        <div css={rootStyle}>
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
                    {/* <SearchSelector
                    control={control}
                    registerKey={"company_type"}
                    options={companyTypeOptions}
                    placeholder="구분"
                    width="180px"
                />
                <div className="space" /> */}
                    <SearchAutoComplete
                        width="200px"
                        placeholder="거래처명"
                        register={register}
                        setValue={setValue}
                        registerKey={"company_name"}
                        options={companyNameOptions}
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
                <div className="msg">등록된 거래처가 없습니다.</div>
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

export default VCompanyList;

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
