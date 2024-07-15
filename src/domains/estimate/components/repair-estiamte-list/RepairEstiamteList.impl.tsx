import { useRouter } from "next/router";
import { IRepairEstiamteList } from "./RepairEstiamteList.interface";
import VRepairEstiamteList from "./RepairEstiamteList.view";
import { useForm } from "react-hook-form";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import PATH from "@constants/path";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { CodeCategory } from "src/enums/code_category.enum";
import { useQuery } from "react-query";
import estimateService from "@domains/estimate/services/estimate.service";
import dayjs from "dayjs";
import projectService from "@domains/project/service/project.service";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { IOrder_By } from "src/codegen/graphql";
import { Permission } from "@enums";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import codeService from "@common/services/code/code.service";
import { CommonType } from "src/enums/common_type.enum";

const RepairEstiamteList: React.FC<IRepairEstiamteList.IProps> = props => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, handleSubmit, control, register } =
        useForm<IRepairEstiamteList.ISearch>();

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
                                <span css={{ color: Colors.oceanBlue }}>
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

    // 유지보수 견적 조회 ( QUERY )
    const {
        data,
        isLoading,
        refetch: fetchAllEstimates,
    } = useQuery(
        ["get all repair estimates", showDeleted],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: { code: { _eq: repairCode!.common_code[0].code } },
                    _and: [
                        getValues("client_name") !== ""
                            ? {
                                  project: {
                                      client: {
                                          name: {
                                              _like: `%${getValues(
                                                  "client_name"
                                              )}%`,
                                          },
                                      },
                                  },
                              }
                            : {},
                        getValues("case_name") !== ""
                            ? {
                                  case_name: {
                                      _like: `%${getValues("case_name")}%`,
                                  },
                              }
                            : {},
                        getValues("project_name") !== ""
                            ? {
                                  project: {
                                      name: {
                                          _like: `%${getValues(
                                              "project_name"
                                          )}%`,
                                      },
                                  },
                              }
                            : {},
                        getValues("destination") !== ""
                            ? {
                                  destination: {
                                      _like: `%${getValues("destination")}%`,
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
            enabled: !!repairCode?.common_code[0].code,
            onSuccess(data) {
                const gridRows = data.estimate.map((estimate, idx) => {
                    return {
                        id: idx + 1,
                        pk: estimate.id,
                        client: estimate.project.client.name ?? "-",
                        project: estimate.project.name ?? "-",
                        destination: estimate.destination ?? "-",
                        case_name: estimate.case_name ?? "-",
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

    // ------------------------------------------------
    // 검색어 조회
    // ------------------------------------------------
    // 건명
    const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
    useQuery(
        ["get estimate case name data"],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: { code: { _eq: repairCode!.common_code[0].code } },
                },
            }),

        {
            enabled: !!repairCode,
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
                    type: { code: { _eq: repairCode!.common_code[0].code } },
                },
            }),

        {
            enabled: !!repairCode,
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
                    type: { code: { _eq: repairCode!.common_code[0].code } },
                },
            }),

        {
            enabled: !!repairCode,
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
        router.push(`${PATH.REPAIR.ESTIMATE.MAIN}/${pk}`);
    };

    return (
        <VRepairEstiamteList
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

export default RepairEstiamteList;
