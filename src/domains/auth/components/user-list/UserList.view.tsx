import { css } from "@emotion/react";
import { IUserList } from "./UserList.interface";
import { Colors } from "@configs/colors";
import { MuiDataGrid, SearchAutoComplete } from "@common/components";
import { Button, Switch } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { Permission } from "@enums";

const VUserList: React.FC<IUserList.IVProps> = props => {
    const {
        rows,
        columns,
        onClickRow,
        userOptions,
        roleOptions,
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
                    <SearchAutoComplete
                        width="180px"
                        placeholder="역할명"
                        register={register}
                        setValue={setValue}
                        registerKey={"role_name"}
                        options={roleOptions}
                    />
                    <div className="space" />
                    <SearchAutoComplete
                        width="180px"
                        placeholder="사용자명"
                        register={register}
                        setValue={setValue}
                        registerKey={"user_name"}
                        options={userOptions}
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
                <div className="msg">사용자를 등록해주세요.</div>
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

export default VUserList;

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