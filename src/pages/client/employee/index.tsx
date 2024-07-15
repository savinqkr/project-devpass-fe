import { css } from "@emotion/react";
import {
    BasicTemplate,
    MuiDataGrid,
    PageTitle,
    SearchAutoComplete,
} from "@common/components";
import type { NextPage } from "next";
import { Colors } from "@configs/colors";
import employeeService from "@domains/employee/services/employee.service";
import { useQuery } from "react-query";
import { useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Chip,
    IconButton,
    Switch,
    Typography,
} from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { useForm } from "react-hook-form";
import roleService from "@domains/role/services/role.service";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { IoAddOutline } from "react-icons/io5";
import loginState from "@recoils/login-state.atom";
import { useRecoilValue } from "recoil";
import { Permission } from "@enums";
import { IOrder_By } from "src/codegen/graphql";

const ClientEmployee: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, register } = useForm<{
        company_name: string;
        role_name: string;
        employee_name: string;
    }>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "담당자명",
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
        router.push(`${PATH.CLIENT.EMPLOYEE.MAIN}/${id}`);
    };

    // -------------------------------------------------
    // 담당자 전체 조회
    // -------------------------------------------------
    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };

    // 담당자 전체 조회
    const { data: allEmployeesData, refetch: fetchEmployees } = useQuery(
        ["get all employees", showDeleted],
        () =>
            employeeService.getAllEmployees({
                where: {
                    _and: [
                        getValues("company_name") === ""
                            ? {}
                            : {
                                  company: {
                                      name: {
                                          _like: `%${getValues(
                                              "company_name"
                                          )}%`,
                                      },
                                  },
                              },
                        getValues("employee_name") === ""
                            ? {}
                            : {
                                  name: {
                                      _like: `%${getValues("employee_name")}%`,
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
                    account_id: { _is_null: true },
                    account_pw: { _is_null: true },
                    refresh_token: { _is_null: true },
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
            onSuccess(data) {
                const gridRows = data.employee.map((employee, idx) => {
                    return {
                        id: idx + 1,
                        pk: employee?.id,
                        name: employee?.name,
                        department: employee?.department || "-",
                        position: employee?.position || "-",
                        updated_at: dayjs(employee!.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: employee?.deleted_at
                            ? dayjs(employee?.deleted_at).format("YYYY/MM/DD")
                            : employee?.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // 검색어 조회
    const [employeeOptions, setEmployeeOptions] = useState<string[]>([]);
    useQuery(
        ["get employee options"],
        () =>
            employeeService.getAllEmployees({
                where: {
                    account_id: { _is_null: true },
                    account_pw: { _is_null: true },
                    refresh_token: { _is_null: true },
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
                    .map(employee => employee?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setEmployeeOptions(options);
            },
        }
    );
    const [companyNameOptions, setCompanyNameOptions] = useState<string[]>([]);
    useQuery(
        ["get company name options"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _eq: CompanyType.CLIENT,
                        },
                    },
                },
            }),

        {
            enabled: true,
            onSuccess(data) {
                const options: string[] = data
                    .map(comapny => comapny?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setCompanyNameOptions(options);
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
        fetchEmployees();
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="전체 담당자" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"거래처 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            전체 담당자
                        </span>
                    </p>
                    <IconButton
                        color="oceanBlue"
                        onClick={() =>
                            router.push(PATH.CLIENT.EMPLOYEE.REGISTER)
                        }
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
                            placeholder="거래처명"
                            register={register}
                            setValue={setValue}
                            registerKey={"company_name"}
                            options={companyNameOptions}
                        />
                        <div className="space" />
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
                            placeholder="담당자명"
                            register={register}
                            setValue={setValue}
                            registerKey={"employee_name"}
                            options={employeeOptions}
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
                {allEmployeesData?.employee.length === 0 ? (
                    <div className="msg">담당자를 등록해주세요.</div>
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
        </BasicTemplate>
    );
};

export default ClientEmployee;

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
