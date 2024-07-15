import { useForm } from "react-hook-form";
import { ISearchEstimateModal } from "./SearchEstimateModal.interface";
import { useState } from "react";
import { useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import VSearchEstimateModal from "./SearchEstimateModal.view";
import { GridColDef, GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import projectService from "@domains/project/service/project.service";
import { useRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import estimateService from "@domains/estimate/services/estimate.service";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import dayjs from "dayjs";
import { IOrder_By } from "src/codegen/graphql";

const SearchEstimateModal: React.FC<ISearchEstimateModal.IProps> = props => {
    const [estiamteModal, setEstiamteModal] =
        useRecoilState(estimateModalState);

    const { setValue, getValues, register, control, watch } =
        useForm<ISearchEstimateModal.ISearch>();

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        { field: "type", headerName: "구분", minWidth: 100, flex: 1.2 },
        { field: "project", headerName: "사업명", minWidth: 200, flex: 2.4 },
        { field: "client", headerName: "고객사", minWidth: 160, flex: 1.5 },
        { field: "destination", headerName: "수신처", minWidth: 200, flex: 1 },
        { field: "case_name", headerName: "건명", minWidth: 200, flex: 1 },
        // { field: "contractor", headerName: "계약사", minWidth: 160, flex: 1.5 },
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
        { field: "estimate_date", headerName: "견적일", width: 160 },
    ];

    const { refetch: fetchEstiamtes } = useQuery(
        ["get estiamtes"],
        () =>
            estimateService.getAllEstimates({
                order_by: [
                    {
                        updated_at: IOrder_By.Desc,
                    },
                ],
                where: {
                    type: {
                        value: { _eq: estiamteModal.type },
                    },
                    deleted_at: { _is_null: true },
                    _and: [
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
                        getValues("destination") !== ""
                            ? {
                                  destination: {
                                      _like: `%${
                                          getValues("destination") || ""
                                      }%`,
                                  },
                              }
                            : {},
                    ],
                },
            }),
        {
            onSuccess(data) {
                const gridRows = data.estimate.map((estimate, idx) => {
                    return {
                        id: idx + 1,
                        pk: estimate.id,
                        type: estimate.type.value,
                        client: estimate.project.client.name ?? "-",
                        contractor: estimate.project.contractor?.name ?? "-",
                        project: estimate.project.name ?? "-",
                        case_name: estimate.case_name ?? "-",
                        destination: estimate.destination ?? "-",
                        is_final: estimate.is_final ?? false,
                        order: `${estimate.order} 차`,
                        estimate_date: dayjs(estimate.estimate_date).format(
                            "YYYY/MM/DD"
                        ),
                    };
                });
                setRows(gridRows);
            },
        }
    );

    // MUI DATAGRID API REF
    const dataGridApiRef = useGridApiRef();

    // ROW 선택하기
    const onClickRow = (pk: string) => {
        dataGridApiRef.current.setRowSelectionModel([]);
        const selectedRow = rows.find(row => row.pk === pk);
        if (!!selectedRow) {
            dataGridApiRef.current.selectRow(selectedRow.id);
        }
    };
    // 선택한 견적을 RECOIL 에 SET & 모달 닫기
    const onClickApply = () => {
        const selectedRows = Array.from(
            dataGridApiRef.current.getSelectedRows().values()
        );
        if (selectedRows.length !== 0) {
            dataGridApiRef.current.setRowSelectionModel([]);
            setEstiamteModal(prev => ({
                ...prev,
                isOpen: false,
                selectedEstimateId: selectedRows[0].pk,
            }));
        } else {
            alert("불러올 견적을 선택해주세요.");
        }
    };

    // ------------------------------------------------------------------------
    // 검색어 옵션
    // ------------------------------------------------------------------------
    // 고객사 옵션 조회
    const [companyNameOptions, setCompanyNameOptions] = useState<string[]>([]);
    useQuery(
        ["get company name options"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _in: [CompanyType.CLIENT],
                        },
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
                const options: string[] = data
                    .map(comapny => comapny?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setCompanyNameOptions(options);
            },
        }
    );

    // 사업 옵션 조회
    const [projectNameOptions, setProjectNameOptions] = useState<string[]>([]);
    useQuery(
        ["get projects", getValues("client_name")],
        () =>
            projectService.getProjectByConditions({
                where: {
                    _and: [
                        {
                            type: {
                                value: { _eq: estiamteModal.type },
                            },
                        },
                    ],
                },
            }),
        {
            enabled: true,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const options: string[] = data.project
                    .map(project => project?.name || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setProjectNameOptions(options);
            },
        }
    );

    // 수신처
    const [destinationOptions, setDestinationOptions] = useState<string[]>([]);
    useQuery(
        ["get destination options"],
        () =>
            estimateService.getAllEstimates({
                where: {
                    type: {
                        value: { _eq: estiamteModal.type },
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
                const options: string[] = data.estimate
                    .map(estimate => estimate?.destination || "")
                    .filter(
                        (item, index, self) => self.indexOf(item) === index
                    );
                setDestinationOptions(options);
            },
        }
    );

    const onClickSearch = () => {
        fetchEstiamtes();
    };

    return (
        <VSearchEstimateModal
            {...props}
            control={control}
            register={register}
            setValue={setValue}
            companyNameOptions={companyNameOptions}
            projectNameOptions={projectNameOptions}
            destinationOptions={destinationOptions}
            onClickSearch={onClickSearch}
            columns={columns.map(col => ({
                ...col,
                headerAlign: "center",
                align: "center",
                sortable: true,
            }))}
            rows={rows}
            onClickRow={onClickRow}
            dataGridApiRef={dataGridApiRef}
            onClickApply={onClickApply}
        />
    );
};

export default SearchEstimateModal;
