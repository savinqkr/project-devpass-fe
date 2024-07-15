import { useState } from "react";
import { ITechSupportEstimateList } from "./TechSupportEstimateList.interface";
import VTechSupportEstimateList from "./TechSupportEstimateList.view";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { CodeCategory } from "src/enums/code_category.enum";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import estimateService from "@domains/estimate/services/estimate.service";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import projectService from "@domains/project/service/project.service";
import loginState from "@recoils/login-state.atom";
import { useRecoilValue } from "recoil";
import { IOrder_By } from "src/codegen/graphql";
import { Permission } from "@enums";
import codeService from "@common/services/code/code.service";
import { CommonType } from "src/enums/common_type.enum";

const TechSupportEstimateList: React.FC<
    ITechSupportEstimateList.IProps
> = props => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, control, register } =
        useForm<ITechSupportEstimateList.ISearch>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "case_name",
            headerName: "건명",
            flex: 2.4,
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
                            {row.case_name}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "destination",
            headerName: "수신처",
            flex: 1.8,
            minWidth: 200,
        },
        { field: "project", headerName: "사업명", flex: 1.8, minWidth: 200 },
        { field: "client", headerName: "고객사", flex: 1.2, minWidth: 120 },
        {
            field: "order",
            headerName: "차수",
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
                        <Typography
                            sx={{
                                fontSize: 12,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {row.is_final ? (
                                <span
                                    css={{
                                        color: Colors.oceanBlue,
                                    }}
                                >
                                    최종 견적
                                </span>
                            ) : (
                                <span>{row.order}</span>
                            )}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "estimate_date",
            headerName: "견적일",
            flex: 1,
            minWidth: 120,
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

    // COMMON CODE ( 기술지원 )
    const { data: techSupportCode } = useQuery(
        ["get tech support type code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: CommonType.TECHSUPPPORT },
                },
            })
    );

    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };

    // 기술지원 견적 조회 ( QUERY )
    const {
        data,
        isLoading,
        refetch: fetchAllEstimates,
    } = useQuery(
        ["get all tech support estimates", showDeleted],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: {
                        code: { _eq: techSupportCode!.common_code[0].code },
                    },
                    _and: [
                        getValues("client_name") !== ""
                            ? {
                                  project: {
                                      client: {
                                          name: {
                                              _like: `%${
                                                  getValues("client_name") || ""
                                              }%`,
                                          },
                                      },
                                  },
                              }
                            : {},
                        getValues("case_name") !== ""
                            ? {
                                  case_name: {
                                      _like: `%${
                                          getValues("case_name") || ""
                                      }%`,
                                  },
                              }
                            : {},
                        getValues("destination") !== ""
                            ? {
                                  destination: {
                                      _like: `%${
                                          getValues("destination") || ""
                                      }%`,
                                  },
                              }
                            : {},
                        getValues("project_name") !== ""
                            ? {
                                  project: {
                                      name: {
                                          _like: `%${
                                              getValues("project_name") || ""
                                          }%`,
                                      },
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
                        project: { is_canceled: IOrder_By.Asc },
                    },
                    {
                        updated_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: !!techSupportCode?.common_code[0].code,
            onSuccess(data) {
                const gridRows = data.estimate.map((estimate, idx) => {
                    return {
                        id: idx + 1,
                        pk: estimate.id,
                        client: estimate.project.client.name ?? "-",
                        project: estimate.project.name ?? "-",
                        case_name: estimate.case_name ?? "-",
                        destination: estimate.destination ?? "-",
                        is_final: estimate.is_final ?? false,
                        order: `${estimate.order} 차`,
                        estimate_date: dayjs(estimate.estimate_date).format(
                            "YYYY/MM/DD"
                        ),
                        is_canceled: estimate.project.is_canceled,
                        updated_at: dayjs(estimate.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: estimate.deleted_at
                            ? dayjs(estimate.deleted_at).format("YYYY/MM/DD")
                            : estimate.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // -----------------------------------------------------------
    // 검색어 조회
    // -----------------------------------------------------------
    // 수신처
    const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
    useQuery(
        ["get estimate destination data"],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: {
                        code: { _eq: techSupportCode!.common_code[0].code },
                    },
                },
            }),

        {
            enabled: !!techSupportCode,
            onSuccess(data) {
                const options: string[] = data.estimate
                    .map(estimate => estimate?.destination || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setDestinationOptions(options);
            },
        }
    );
    // 건명
    const [caseNameOptions, setCaseNameOptions] = useState<string[]>([]);
    useQuery(
        ["get estimate case name data"],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: {
                        code: { _eq: techSupportCode!.common_code[0].code },
                    },
                },
            }),

        {
            enabled: !!techSupportCode,
            onSuccess(data) {
                const options: string[] = data.estimate
                    .map(estimate => estimate?.case_name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setCaseNameOptions(options);
            },
        }
    );
    // 사업
    const [projectOptions, setProjectOptions] = useState<string[]>([]);
    useQuery(
        ["get project data"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    type: {
                        code: { _eq: techSupportCode!.common_code[0].code },
                    },
                },
            }),

        {
            enabled: !!techSupportCode,
            onSuccess(data) {
                const options: string[] = data.project
                    .map(project => project?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setProjectOptions(options);
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

    const onClickSearch = () => {
        fetchAllEstimates();
    };

    // TABLE ROW CLICK 라우팅
    const onClickRow = (pk: string) => {
        router.push(`${PATH.TECHSUPPORT.ESTIMATE.MAIN}/${pk}`);
    };

    return (
        <VTechSupportEstimateList
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
            register={register}
            control={control}
            setValue={setValue}
            onClickSearch={onClickSearch}
            clientOptions={clientOptions}
            caseNameOptions={caseNameOptions}
            projectOptions={projectOptions}
            destinationOptions={destinationOptions}
            showDeleted={showDeleted}
            handleChange={handleChange}
        />
    );
};

export default TechSupportEstimateList;
