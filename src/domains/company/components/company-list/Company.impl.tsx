import { ICompanyList } from "./Company.interface";
import VCompanyList from "./CompanyList.view";
import { useRouter } from "next/router";
import { useState } from "react";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import dayjs from "dayjs";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { IOrder_By } from "src/codegen/graphql";
import { Permission } from "@enums";

const CompanyList: React.FC<ICompanyList.IProps> = props => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const { setValue, getValues, register, control, watch } =
        useForm<ICompanyList.ISearch>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "거래처명",
            flex: 2.4,
            minWidth: 250,
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
        { field: "type", headerName: "구분", flex: 1, minWidth: 120 },
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
        router.push(`${PATH.CLIENT.COMPANY.MAIN}/${id}`);
    };

    // -------------------------------------------------
    // 거래처 전체 조회 ( QUERY )
    // -------------------------------------------------
    // 삭제 데이터 노출 여부
    const [showDeleted, setShowDeleted] = useState(false);
    const handleChange = (event: any) => {
        setShowDeleted(event.target.checked);
    };

    // 거래처 전체 조회
    const { refetch: fetchClients } = useQuery(
        ["get client data", showDeleted],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _nin: [CompanyType.HEAD],
                        },
                    },
                    _and: [
                        getValues("company_name") !== ""
                            ? {
                                  name: {
                                      _like: `%${getValues("company_name")}%`,
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
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const gridRows = data.map((company, idx) => {
                    return {
                        id: idx + 1,
                        pk: company?.id,
                        name: company?.name,
                        type: company?.type.value,
                        updated_at: dayjs(company!.updated_at).format(
                            "YYYY/MM/DD"
                        ),
                        deleted_at: company?.deleted_at
                            ? dayjs(company?.deleted_at).format("YYYY/MM/DD")
                            : company?.deleted_at,
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // 검색어 조회
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
    const onClickSearch = () => {
        fetchClients();
    };

    return (
        <VCompanyList
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
            control={control}
            register={register}
            setValue={setValue}
            onClickSearch={onClickSearch}
            companyNameOptions={companyNameOptions}
            // companyTypeOptions={companyTypeOptions}
            showDeleted={showDeleted}
            handleChange={handleChange}
        />
    );
};

export default CompanyList;
