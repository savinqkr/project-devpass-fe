import { css } from "@emotion/react";
import {
    BasicTemplate,
    MuiDataGrid,
    PageTitle,
    SearchAutoComplete,
} from "@common/components";
import { Colors } from "@configs/colors";
import { ModalMode, Permission } from "@enums";
import type { NextPage } from "next";
import { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Modal,
    Switch,
    Typography,
} from "@mui/material";
import { RoleDetail, RoleForm } from "@domains/role";
import { useQuery } from "react-query";
import roleService from "@domains/role/services/role.service";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { IoAddOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { IOrder_By } from "src/codegen/graphql";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";

const Role: NextPage = () => {
    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, register } = useForm<{
        role_name: string;
    }>();

    // MODAL STATE ( OPEN / MODE )
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<ModalMode>(ModalMode.REGISTER);

    // MODAL MODE에 따라 OPEN
    const onClickOpen = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    // 수정 & 삭제 MUTATION 실행 성공시 SET VALUE ( 역할 조회 QUERY 에 종속걸림 )
    const [isExecuted, setIsExecuted] = useState<boolean>(false);

    // 역할 상세 MODAL 열기
    const onClickOpenDetailModal = (code: number) => {
        setRoleCode(code);
        onClickOpen(ModalMode.DETAIL);
    };

    // 역할 수정용 MODAL 열기
    const [roleCode, setRoleCode] = useState<number | null>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "역할명",
            flex: 1.5,
            minWidth: 200,
            renderCell({ id, row }) {
                return (
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {row.name}
                        </Typography>
                    </Box>
                );
            },
        },
        { field: "special_role", headerName: "역할 구분", flex: 1 },
        { field: "updated_at", headerName: "최근 수정일", width: 120 },
        {
            field: "deleted_at",
            headerName: "삭제일",
            width: 120,
            renderCell({ id, row }) {
                return (
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {!!row.deleted_at && (
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: Colors.wildStrawberry,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {row.deleted_at}
                            </Typography>
                        )}
                    </Box>
                );
            },
        },
    ];

    // TABLE ROW CLICK 라우팅
    const onClickRow = (id: number) => {
        onClickOpenDetailModal(id);
    };

    // ------------------------------------------------
    // 역할 조회 ( QUERY )
    // ------------------------------------------------
    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };

    // 역할 조회 ( QUERY )
    const { data: roleData, refetch: fetchRoles } = useQuery(
        ["get all role data", isExecuted, showDeleted],
        () =>
            roleService.getAllRoleCode({
                where: {
                    _and: [
                        getValues("role_name") !== ""
                            ? {
                                  value: {
                                      _like: `%${getValues("role_name")}%`,
                                  },
                              }
                            : {},
                        showDeleted
                            ? {}
                            : {
                                  deleted_at: { _is_null: true },
                              },
                    ],
                },
                order_by: [
                    {
                        deleted_at: IOrder_By.DescNullsFirst,
                    },
                    {
                        updated_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const gridRows = data.role_code.map((role, idx) => {
                    return {
                        id: idx + 1,
                        pk: role.code,
                        name: role.value,
                        special_role: role.special_role
                            ? role.special_role.value
                            : "-",
                        updated_at: dayjs(role.updated_at).format("YYYY/MM/DD"),
                        deleted_at: role.deleted_at
                            ? dayjs(role.deleted_at).format("YYYY/MM/DD")
                            : role.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );
    // 검색어 조회
    const [roleOptions, setRoleOptions] = useState<string[]>([]);
    useQuery(["get role options"], () => roleService.getAllRoleCode({}), {
        enabled: true,
        retry: true,
        cacheTime: 0,
        staleTime: 0,
        keepPreviousData: false,
        onSuccess(data) {
            const options: string[] = data.role_code
                .map(role => role?.value || "")
                .filter((item, index, self) => self.indexOf(item) === index);
            setRoleOptions(options);
        },
    });
    const onClickSearch = () => {
        fetchRoles();
    };
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="역할 설정" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>역할 설정</span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() => onClickOpen(ModalMode.REGISTER)}
                    >
                        <IoAddOutline />
                    </IconButton>
                </div>
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
                {roleData?.role_code.length === 0 ? (
                    <div className="msg">역할을 등록해주세요.</div>
                ) : (
                    <MuiDataGrid
                        rows={rows}
                        columns={columns
                            .filter((col, idx) => {
                                if (
                                    loginUser.permission === Permission.ADMIN &&
                                    showDeleted
                                ) {
                                    return true;
                                }
                                return col.field !== "deleted_at";
                            })
                            .map(col => {
                                return {
                                    ...col,
                                    field: col.field,
                                    headerName: col.headerName,
                                    flex: col.flex,
                                    sortable: true,
                                    align: "center",
                                    headerAlign: "center",
                                };
                            })}
                        rowLimit={10}
                        onClickRow={onClickRow}
                    />
                )}
            </div>
            {/* ---------- 모달창 ( 등록 / 수정 / 상세 ) ---------- */}
            <Modal
                id="modal"
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                disableScrollLock
            >
                <div>
                    {modalMode === ModalMode.REGISTER ? (
                        <RoleForm
                            mode={ModalMode.REGISTER}
                            title="역할 등록"
                            onClickClose={() => setIsModalOpen(false)}
                            isExecuted={isExecuted}
                            setIsExecuted={setIsExecuted}
                        />
                    ) : modalMode === ModalMode.EDIT ? (
                        <RoleForm
                            mode={ModalMode.EDIT}
                            title="역할 수정"
                            code={roleCode!}
                            onClickClose={() => setIsModalOpen(false)}
                            isExecuted={isExecuted}
                            setIsExecuted={setIsExecuted}
                        />
                    ) : (
                        <RoleDetail
                            title="역할 상세"
                            code={roleCode!}
                            onClickClose={() => setIsModalOpen(false)}
                            isExecuted={isExecuted}
                            setIsExecuted={setIsExecuted}
                            setModalMode={setModalMode}
                        />
                    )}
                </div>
            </Modal>
        </BasicTemplate>
    );
};

export default Role;

const rootStyle = css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }

    .menu-info {
        color: ${Colors.gray};
    }

    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }

    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 120px;
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
