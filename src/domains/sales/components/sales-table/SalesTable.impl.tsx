import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { ISalesTable } from "./SalesTable.interface";
import VSalesTable from "./SalesTable.view";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import salesService from "@domains/sales/services/sales.service";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { Box, Chip, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { Permission, ProductType } from "@enums";
import projectService from "@domains/project/service/project.service";
import { CodeCategory } from "src/enums/code_category.enum";
import employeeService from "@domains/employee/services/employee.service";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";
import codeService from "@common/services/code/code.service";

const SalesTable: React.FC<ISalesTable.IProps> = props => {
    const { getValues, control, watch, resetField } =
        useForm<ISalesTable.IFilter>();

    const router = useRouter();

    const [loginUser, setLoginUser] = useRecoilState(loginState);

    const { type } = props;

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ D E L E T E  F I L T E R ] ---------------------------------
    const [showDeleted, setShowDeleted] = useState<boolean>(false);

    const handleShowDeleted = (newState: boolean) => {
        setShowDeleted(newState);
    };

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // [ 모든 검수 & 매출 조회]
    const { refetch: getAllSalesRefetch } = useQuery(
        ["getAllSalesQuery", showDeleted],
        () =>
            salesService.getAllSales({
                where: {
                    deleted_at: showDeleted ? {} : { _is_null: true },
                    common_type: {
                        value: {
                            _in: [type],
                        },
                    },
                    _and: [
                        {
                            client: {
                                name: {
                                    _ilike:
                                        getValues("client.label") === "전체"
                                            ? undefined
                                            : `%${
                                                  getValues("client.label") ||
                                                  ""
                                              }%`,
                                },
                            },
                        },
                        {
                            project: {
                                name: {
                                    _ilike:
                                        getValues("project.label") === "전체"
                                            ? undefined
                                            : `%${
                                                  getValues("project.label") ||
                                                  ""
                                              }%`,
                                },
                            },
                        },
                        {
                            sales_representative: {
                                name: {
                                    _ilike:
                                        getValues("employee.label") === "전체"
                                            ? undefined
                                            : `%${
                                                  getValues("employee.label") ||
                                                  ""
                                              }%`,
                                },
                            },
                        },
                    ],
                },
            }),
        {
            onSuccess(data) {
                console.log(data);

                const sales = data.map((item, idx) => {
                    return {
                        id: idx + 1,
                        pk: item?.id,
                        client_name: item?.client.name,
                        project_name: item?.project.name,
                        employee_name: item?.sales_representative.name ?? "X",
                        is_canceled: item?.project.is_canceled,
                        updated_at: dayjs(item?.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: item?.deleted_at
                            ? dayjs(item?.deleted_at).format("YYYY/MM/DD")
                            : item?.deleted_at,
                    };
                });

                setRows(sales);
            },
        }
    );

    const onClickSearch = () => {
        getAllSalesRefetch();
    };

    const columns: GridColDef[] = [
        { width: 60, headerName: "No.", field: "id" },
        {
            flex: 2.5,
            minWidth: 90,
            headerName: "고객사",
            field: "client_name",
        },
        {
            flex: 3,
            minWidth: 120,
            headerName: "사업명",
            field: "project_name",
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
                            {row.project_name}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            flex: 2,
            minWidth: 80,
            headerName: "영업 담당자",
            field: "employee_name",
        },
        {
            field: "is_canceled",
            headerName: "해지",
            width: 60,
            renderCell({ id, row }) {
                return row.is_canceled ? (
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
                                color: Colors.mandarinOrange,
                            }}
                        >
                            해지
                        </Typography>
                    </Box>
                ) : null;
            },
        },
        { flex: 2, headerName: "최근 수정일", field: "updated_at" },
        {
            field: "tag",
            headerName: "삭제일",
            flex: 1.5,
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

    var [rows, setRows] = useState<GridRowsProp>([]);

    const onClickRow = (id: number) => {
        if (type === ProductType.LICENSE) {
            router.push(`${PATH.LICENSE.SALES.MAIN}/${id}`);
        } else if (type === ProductType.SERVICE) {
            router.push(`${PATH.TECHSUPPORT.SALES.MAIN}/${id}`);
        } else if (type === ProductType.CUSTOMIZE) {
            router.push(`${PATH.CUSTOMIZE.SALES.MAIN}/${id}`);
        } else if (type === ProductType.MAINTENANCE) {
            router.push(`${PATH.REPAIR.SALES.MAIN}/${id}`);
        }
    };

    var [clients, setClients] = useState<
        { label: string; value: number | string }[]
    >([]);
    var [projects, setProjects] = useState<
        { label: string; value: number | string }[]
    >([]);
    var [employees, setEmployees] = useState<
        { label: string; value: number | string }[]
    >([]);

    // [ Client - 고객사 ]
    const {} = useQuery(
        ["getAllClients"],
        () =>
            companyService.getCompanies({
                where: { type: { value: { _eq: CompanyType.CLIENT } } },
            }),
        {
            onSuccess(data) {
                var clientList: { label: string; value: number | string }[] =
                    data.map(item => {
                        return { label: item!.name, value: item!.id };
                    });

                setClients([{ label: "전체", value: "all" }, ...clientList]);
            },
        }
    );

    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    // [ Project - 사업 ]
    const { refetch: projectRefetch } = useQuery(
        ["getAllProjects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    type_code: { _eq: commonType!.common_code[0].code },
                    client: {
                        name: {
                            _eq: getValues("client.label"),
                        },
                    },
                },
            }),
        {
            enabled: false,
            onSuccess(data) {
                var projectList: { label: string; value: number }[] = [];
                data.project.map(item => {
                    item.deleted_at === null &&
                        projectList.push({ label: item.name, value: item.id });
                });
                setProjects([{ label: "전체", value: "all" }, ...projectList]);
            },
        }
    );

    useEffect(() => {
        commonType?.common_code[0].code && projectRefetch();
        resetField("project");
    }, [watch("client")]);

    // [ employee - 영업 담당자 ]
    const {} = useQuery(
        ["getAllSalesRepresentative"],
        () =>
            employeeService.getAllUsers({
                where: {
                    company: {
                        type: {
                            value: { _eq: CompanyType.HEAD },
                        },
                    },
                    roles: {
                        role: {
                            special_role: {
                                value: { _eq: "본사 영업" },
                            },
                        },
                    },
                },
            }),
        {
            onSuccess(data) {
                var representativeList: { label: string; value: number }[] = [];

                data.employee.map(item => {
                    representativeList.push({
                        label: item.name,
                        value: item.id,
                    });
                });

                setEmployees([
                    { label: "전체", value: "all" },
                    ...representativeList,
                ]);
            },
        }
    );

    useEffect(() => {
        resetField("employee");
    }, [watch("project"), watch("client")]);

    return (
        <VSalesTable
            columns={columns
                .filter(item => {
                    if (
                        loginUser.permission === Permission.ADMIN &&
                        showDeleted
                    ) {
                        return true;
                    }
                    return item.field !== "tag";
                })
                .map(item => {
                    return {
                        ...item,
                        field: item.field,
                        headerName: item.headerName,
                        flex: item.flex,
                        sortable: true,
                        align: "center",
                        headerAlign: "center",
                    };
                })}
            rows={rows}
            onClickRow={onClickRow}
            clients={clients}
            projects={projects}
            employees={employees}
            control={control}
            onClickSearch={onClickSearch}
            showDeleted={showDeleted}
            handleShowDeleted={handleShowDeleted}
            {...props}
        />
    );
};

export default SalesTable;
