import { useForm } from "react-hook-form";
import { IRepairProjectList } from "./RepairProjectList.interface";
import VRepairProjectList from "./RepairProjectList.view";
import { useRouter } from "next/router";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { CompanyType } from "src/enums/company_type.enum";
import companyService from "@domains/company/services/company.service";
import PATH from "@constants/path";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { Permission } from "@enums";
import employeeService from "@domains/employee/services/employee.service";
import { IOrder_By } from "src/codegen/graphql";
import codeService from "@common/services/code/code.service";
import { CommonType } from "src/enums/common_type.enum";

const RepairProjectList: React.FC<IRepairProjectList.IProps> = props => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, control, getValues, register } =
        useForm<IRepairProjectList.ISearch>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "사업명",
            minWidth: 200,
            flex: 2.4,
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
        { field: "client", headerName: "고객사", flex: 1.2, minWidth: 120 },
        { field: "contractor", headerName: "계약사", flex: 1.2, minWidth: 120 },
        { field: "period", headerName: "사업기간", flex: 1.5, minWidth: 180 },
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

    // COMMON CODE ( 유지보수 )
    const { data: repairCode } = useQuery(["get repair type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.REPAIR },
            },
        })
    );
    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };
    const { refetch: refetchProjects, isLoading } = useQuery(
        ["get all projects", showDeleted],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    type_code: { _eq: repairCode!.common_code[0].code },
                    _and: [
                        getValues("project_name") !== ""
                            ? {
                                  name: {
                                      _like: `%${
                                          getValues("project_name") || ""
                                      }%`,
                                  },
                              }
                            : {},
                        getValues("client_name") !== ""
                            ? {
                                  client: {
                                      name: {
                                          _like: `%${
                                              getValues("client_name") || ""
                                          }%`,
                                      },
                                  },
                              }
                            : {},
                        getValues("contractor_name") !== ""
                            ? {
                                  contractor: {
                                      name: {
                                          _like: `%${
                                              getValues("contractor_name") || ""
                                          }%`,
                                      },
                                  },
                              }
                            : {},
                        getValues("consultant_name") !== ""
                            ? {
                                  consultant_name: {
                                      _like: `%${
                                          getValues("consultant_name") || ""
                                      }%`,
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
                        is_canceled: IOrder_By.Asc,
                    },
                    {
                        updated_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: !!repairCode && repairCode!.common_code.length > 0,
            onSuccess(data) {
                const gridRows = data.project.map((proj, idx) => {
                    return {
                        id: idx + 1,
                        pk: proj.id,
                        name: proj.name ?? "-",
                        client: proj.client.name ?? "-",
                        contractor: proj.contractor?.name ?? "-",
                        consultant: proj.consultant_name ?? "-",
                        period: !!proj.start_date
                            ? `${dayjs(proj.start_date).format(
                                  "YYYY/MM/DD"
                              )} ~ ${dayjs(proj.end_date).format(
                                  "YYYY/MM/DD"
                              )} `
                            : "-",
                        is_canceled: proj.is_canceled,
                        updated_at: dayjs(proj.updated_at).format("YYYY/MM/DD"),
                        deleted_at: proj.deleted_at
                            ? dayjs(proj.deleted_at).format("YYYY/MM/DD")
                            : proj.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // ------------------------------------------------------------
    // 검색어 조회
    // ------------------------------------------------------------
    // 사업명
    const [projectNameOptions, setProjectNameOptions] = useState<string[]>([]);
    useQuery(
        ["get all names of repair projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    type_code: { _eq: repairCode?.common_code[0].code },
                },
            }),
        {
            enabled: !!repairCode && repairCode.common_code.length !== 0,
            onSuccess(data) {
                const options: string[] = data.project
                    .map(project => project.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setProjectNameOptions(options);
            },
        }
    );
    // 고객사
    const [clientOptions, setClientOptions] = useState<string[]>([]);
    useQuery(
        ["get client data"],
        () =>
            companyService.getCompanies({
                where: {
                    type: { value: { _eq: CompanyType.CLIENT } },
                },
            }),

        {
            enabled: true,
            onSuccess(data) {
                const options: string[] = data
                    .map(client => client?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setClientOptions(options);
            },
        }
    );
    // 계약사
    const [contractorOptions, setContractorOptions] = useState<string[]>([]);
    useQuery(
        ["get contractor data"],
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
                    .map(contractor => contractor?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setContractorOptions(options);
            },
        }
    );
    // 엔지니어(컨설턴트)
    const [consultantOptions, setConsultantOptions] = useState<string[]>([]);
    useQuery(
        ["get consultant data"],
        () =>
            employeeService.getAllEmployees({
                where: {
                    company: {
                        type: {
                            value: {
                                _eq: CompanyType.HEAD,
                            },
                        },
                    },
                },
            }),

        {
            enabled: true,
            onSuccess(data) {
                const options: string[] = data.employee
                    .map(employee => employee?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setConsultantOptions(options);
            },
        }
    );

    const onClickSearch = () => {
        refetchProjects();
    };

    // TABLE ROW CLICK 라우팅
    const onClickRow = (pk: string) => {
        router.push(`${PATH.REPAIR.PROJECT.MAIN}/${pk}`);
    };

    return (
        <VRepairProjectList
            {...props}
            isLoading={isLoading}
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
            control={control}
            register={register}
            setValue={setValue}
            onClickSearch={onClickSearch}
            projectNameOptions={projectNameOptions}
            clientOptions={clientOptions}
            contractorOptions={contractorOptions}
            consultantOptions={consultantOptions}
            showDeleted={showDeleted}
            handleChange={handleChange}
        />
    );
};

export default RepairProjectList;
