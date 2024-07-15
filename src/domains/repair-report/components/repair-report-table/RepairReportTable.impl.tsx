import { IRepairReportTable } from "./RepairReportTable.interface";
import VRepairReportTable from "./RepairReportTable.view";

import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import repairReportService from "@domains/repair-report/services/repair-report.service";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Colors } from "@configs/colors";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";
import { Permission, ProductType } from "@enums";
import codeService from "@common/services/code/code.service";

const RepairReportTable: React.FC<IRepairReportTable.IProps> = props => {
    const { getValues, control, watch, resetField } =
        useForm<IRepairReportTable.IFilter>();

    const router = useRouter();

    const [loginUser, setLoginUser] = useRecoilState(loginState);

    const {} = props;

    var [clients, setClients] = useState<
        { label: string; value: number | string }[]
    >([]);
    var [projects, setProjects] = useState<
        { label: string; value: number | string }[]
    >([]);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ D E L E T E  F I L T E R ] ---------------------------------
    const [showDeleted, setShowDeleted] = useState<boolean>(false);

    const handleShowDeleted = (newState: boolean) => {
        setShowDeleted(newState);
    };

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ T A B L E ] ------------------------------------------

    const columns: GridColDef[] = [
        { width: 60, headerName: "No.", field: "id" },
        {
            flex: 3,
            headerName: "유지보수 사업",
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
            flex: 2.5,
            headerName: "점검자",
            field: "inspector_name",
        },
        { flex: 2.5, headerName: "점검일", field: "repair_date" },
        { flex: 2.5, headerName: "수정일", field: "updated_at" },

        {
            field: "tag",
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
    const [rows, setRows] = useState<GridRowsProp>([]);

    // ---------------------------------------------------------------------------------------------
    // -------------------------------------- [ Q U E R Y ] ----------------------------------------
    // [ common_type - 공통타입 ]

    const { data: commonType } = useQuery(["getCommonTypeQuery"], () =>
        codeService.getCommonCode({
            where: {
                category: {
                    _eq: CodeCategory.COMMON_TYPE,
                },
                value: {
                    _eq: ProductType.MAINTENANCE,
                },
            },
        })
    );

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

                setClients(clientList);
            },
        }
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
                            _like: `%${getValues("client.label") || ""}%`,
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
                setProjects(projectList);
            },
        }
    );

    useEffect(() => {
        commonType?.common_code[0].code && projectRefetch();
        resetField("project");
    }, [watch("client")]);

    // [ repair_report - 정기점검 ]
    const { refetch: getAllRepairReportRefetch } = useQuery(
        ["getAllRepairReport", showDeleted],
        () =>
            repairReportService.getAllRepairReport({
                where: {
                    deleted_at: showDeleted ? {} : { _is_null: true },
                    project: {
                        client: {
                            name: {
                                _like: `%${getValues("client.label") || ""}%`,
                            },
                        },
                    },
                    _and: [
                        getValues("project.label") !== ""
                            ? {
                                  project: {
                                      name: {
                                          _like: `%${
                                              getValues("project.label") || ""
                                          }%`,
                                      },
                                  },
                              }
                            : {},
                    ],
                },
            }),
        {
            onSuccess(data) {
                const repairReport = data.map((item, idx) => {
                    // console.log(item);
                    return {
                        id: idx + 1,
                        pk: item?.id,
                        project_name: item?.project.name,
                        inspector_name: item?.inspector.name,
                        repair_date: dayjs(item?.repair_date).format(
                            "YYYY/MM/DD"
                        ),
                        updated_at: dayjs(item?.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: dayjs(item?.deleted_at).format(
                            "YYYY/MM/DD"
                        ),
                    };
                });

                setRows(repairReport);
            },
        }
    );

    const onClickSearch = () => {
        getAllRepairReportRefetch();
    };

    const onClickRow = (id: number) => {
        router.push(`${PATH.REPAIR.INSPECTION.MAIN}/${id}`);
    };

    return (
        <VRepairReportTable
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
            control={control}
            onClickSearch={onClickSearch}
            showDeleted={showDeleted}
            handleShowDeleted={handleShowDeleted}
            {...props}
        />
    );
};

export default RepairReportTable;
