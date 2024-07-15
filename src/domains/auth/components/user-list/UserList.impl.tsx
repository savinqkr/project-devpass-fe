import { IUserList } from "./UserList.interface";
import VUserList from "./UserList.view";
import dayjs from "dayjs";
import employeeService from "@domains/employee/services/employee.service";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useForm } from "react-hook-form";
import { Permission } from "@enums";
import roleService from "@domains/role/services/role.service";
import { IOrder_By } from "src/codegen/graphql";

const UserList: React.FC<IUserList.IProps> = props => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, register } = useForm<IUserList.ISearch>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "사용자명",
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
        { field: "department", headerName: "부서", flex: 1.2, minWidth: 180 },
        { field: "position", headerName: "직함", flex: 1.2, minWidth: 160 },
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
        router.push(`${PATH.ADMIN.USER.MAIN}/${id}`);
    };

    //-------------------------------------------------
    // 사용자 조회
    //-------------------------------------------------
    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };

    // 사용자 조회
    const { refetch: fetchUsers } = useQuery(
        ["get all users", showDeleted, loginUser.permission],
        () =>
            employeeService.getAllUsers({
                where: {
                    _and: [
                        getValues("user_name") === ""
                            ? {}
                            : {
                                  name: {
                                      _like: `%${getValues("user_name")}%`,
                                  },
                              },
                        getValues("role_name") === ""
                            ? {}
                            : {
                                  roles: {
                                      role: {
                                          value: {
                                              _like: `%${getValues(
                                                  "role_name"
                                              )}%`,
                                          },
                                      },
                                  },
                              },
                        showDeleted
                            ? {}
                            : {
                                  deleted_at: { _is_null: true },
                              },
                    ],
                    permission: {
                        category: { _eq: "permission" },
                        value: { _eq: Permission.USER },
                    },
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
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const gridRows = data.employee.map((user, idx) => {
                    return {
                        id: idx + 1,
                        pk: user?.id,
                        name: user?.name,
                        department: user?.department || "-",
                        position: user?.position || "-",
                        updated_at: dayjs(user!.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: !!user.deleted_at
                            ? dayjs(user!.deleted_at).format("YYYY/MM/DD")
                            : user.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // 검색어 조회
    const [userOptions, setUserOptions] = useState<string[]>([]);
    useQuery(
        ["get user options", loginUser],
        () =>
            employeeService.getAllUsers({
                where: {
                    permission: {
                        category: { _eq: "permission" },
                        value: { _eq: Permission.USER },
                    },
                },
            }),
        {
            enabled: true,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options: string[] = data.employee
                    .map(user => user?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setUserOptions(options);
            },
        }
    );
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
        fetchUsers();
    };

    return (
        <VUserList
            {...props}
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
            rows={rows}
            onClickRow={onClickRow}
            register={register}
            setValue={setValue}
            userOptions={userOptions}
            roleOptions={roleOptions}
            onClickSearch={onClickSearch}
            showDeleted={showDeleted}
            handleChange={handleChange}
        />
    );
};

export default UserList;
