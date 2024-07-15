import { IContractTable } from "./ContractTable.interface";
import VContractTable from "./ContractTable.view";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import contractService from "@domains/contract/services/graphql/contract.service";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { CodeCategory } from "src/enums/code_category.enum";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { Permission, ProductType } from "@enums";
import { useForm } from "react-hook-form";
import projectService from "@domains/project/service/project.service";
import { GetCompanyOptionsByType } from "@domains/contract/hooks";
import { CompanyType } from "src/enums/company_type.enum";
import { IOrder_By } from "src/codegen/graphql";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";
import codeService from "@common/services/code/code.service";

const ContractTable: React.FC<IContractTable.IProps> = props => {
    const router = useRouter();
    const { type, routePath } = props;

    const { getValues, control, watch, resetField, handleSubmit, setValue } =
        useForm<IContractTable.IFilter>();

    const [loginUser, setLoginUser] = useRecoilState(loginState);

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
            minWidth: 130,
            headerName: "계약명",
            field: "contract_name",
        },
        {
            flex: 2,
            minWidth: 80,
            headerName: "고객사",
            field: "client_name",
        },
        {
            flex: 2,
            minWidth: 100,
            headerName: "사업명",
            field: "project_name",
        },
        {
            flex: 1.5,
            minWidth: 70,
            headerName: "영업 담당자",
            field: "sales_representative",
        },
        {
            flex: 2,
            minWidth: 80,
            headerName: "계약사",
            field: "contractor_name",
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
        {
            flex: 2,
            minWidth: 90,
            headerName: "최근 수정일",
            field: "updated_at",
        },
        {
            field: "tag",
            headerName: "삭제일",
            flex: 1.5,
            minWidth: 70,
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

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // [ common_type code ]
    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    // [ Table 데이터 조회 ]
    const { refetch: getAllContract } = useQuery(
        ["getAllContract", showDeleted],
        () =>
            contractService.getAllContract({
                where: {
                    deleted_at: showDeleted ? {} : { _is_null: true },
                    type: {
                        value: {
                            _in: [type],
                        },
                    },
                    _and: [
                        getValues("client.label") !== ""
                            ? {
                                  client: {
                                      name: {
                                          _like: `%${
                                              getValues("client.label") || ""
                                          }%`,
                                      },
                                  },
                              }
                            : {},
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
                order_by: [
                    {
                        deleted_at: IOrder_By.DescNullsFirst,
                    },
                    {
                        project: {
                            is_canceled: IOrder_By.Asc,
                        },
                    },
                    {
                        updated_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: !!commonType?.common_code[0].code,
            onSuccess(data) {
                // console.log(data);
                const contracts = data.map((item, idx) => {
                    return {
                        id: idx + 1,
                        pk: item?.id,
                        client_name: item?.client.name,
                        project_name: item?.project?.name,
                        contract_name: item?.name,
                        contractor_name: item?.contractor?.name,
                        sales_representative:
                            item?.sales_representative.name ?? "X",
                        is_canceled: item?.project.is_canceled,
                        updated_at: dayjs(item?.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: item?.deleted_at
                            ? dayjs(item?.deleted_at).format("YYYY/MM/DD")
                            : item?.deleted_at,
                    };
                });

                setRows(contracts);
            },
        }
    );

    // 사업 Select Option ------|
    const [projectOptions, setProjectOptions] = useState<
        { label: string; value: number | string }[]
    >([]);

    const { refetch: projectRefetch } = useQuery(
        ["getAllProject"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    deleted_at: {
                        _is_null:
                            loginUser.permission !== Permission.ADMIN
                                ? true
                                : undefined,
                    },
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
                // console.log(data);

                var projectList = data.project.map(item => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                });

                setProjectOptions(projectList);
            },
        }
    );

    useEffect(() => {
        if (commonType?.common_code[0].code) {
            projectRefetch();
            resetField("project");
        }
    }, [watch("client")]);

    const onClickSearchBtn = () => {
        getAllContract();
    };

    const onClickRow = (id: number) => {
        router.push(`${routePath}/${id}`);
    };

    return (
        <VContractTable
            columns={columns
                .filter(item => {
                    if (loginUser.permission === Permission.ADMIN) {
                        if (type === ProductType.LICENSE && !showDeleted) {
                            return (
                                item.field !== "contractor_name" &&
                                item.field !== "tag"
                            );
                        } else if (type === ProductType.LICENSE) {
                            return item.field !== "contractor_name";
                        } else if (!showDeleted) {
                            return item.field !== "tag";
                        }

                        return true;
                    } else if (type === ProductType.LICENSE) {
                        return (
                            item.field !== "contractor_name" &&
                            item.field !== "tag"
                        );
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
            control={control}
            setValue={setValue}
            projectOptions={projectOptions}
            clientOptions={GetCompanyOptionsByType([CompanyType.CLIENT])}
            onClickSearchBtn={handleSubmit(onClickSearchBtn)}
            showDeleted={showDeleted}
            handleShowDeleted={handleShowDeleted}
            {...props}
        />
    );
};

export default ContractTable;
