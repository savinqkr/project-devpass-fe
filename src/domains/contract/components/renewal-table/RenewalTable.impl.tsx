import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { IRenewalTable } from "./RenewalTable.interface";
import VRenewalTable from "./RenewalTable.view";
import { useState } from "react";
import { useQuery } from "react-query";
import projectService from "@domains/project/service/project.service";
import { ProductType } from "@enums";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useRouter } from "next/router";
import PATH from "@constants/path";

dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const RenewalTable: React.FC<IRenewalTable.IProps> = props => {
    const {} = props;

    const router = useRouter();

    const { getValues, setValue, control } = useForm<IRenewalTable.IFilter>();

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------- [ S E L E C T ] ---------------------------------------
    const [types, setTypes] = useState<{ label: string; value: string }[]>([
        { label: "전체", value: "all" },
        { label: "무상", value: "무상" },
        { label: "유상", value: "유상" },
    ]);
    const [projects, setProjects] = useState<
        { label: string; value: number | string }[]
    >([]);
    const [clients, setClients] = useState<
        { label: string; value: number | string }[]
    >([]);

    // [ project - 사업 ]
    const {} = useQuery(
        ["getAllProject"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    deleted_at: {
                        _is_null: true,
                    },
                    type: {
                        value: {
                            _in: [ProductType.LICENSE, ProductType.MAINTENANCE],
                        },
                    },
                    is_canceled: { _eq: false },
                },
            }),
        {
            onSuccess(data) {
                const allProjects: { label: string; value: number | string }[] =
                    data.project.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                        };
                    });

                setProjects([{ label: "전체", value: "all" }, ...allProjects]);
            },
        }
    );

    // [ client - 고객사 ]
    const {} = useQuery(
        ["getAllClient"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: { _in: [CompanyType.CLIENT] },
                    },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            onSuccess(data) {
                const allClients: { label: string; value: number | string }[] =
                    data.map(item => {
                        return { label: item!.name, value: item!.id };
                    });

                setClients(allClients);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------------- [ G R I D ] -----------------------------------------
    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { width: 60, headerName: "No.", field: "id" },
        { flex: 2, headerName: "고객사", field: "client_name" },
        { flex: 3, headerName: "사업명", field: "project_name" },
        { flex: 1, headerName: "구분", field: "type" },
        { flex: 2.5, headerName: "계약 만료일", field: "expiration_date" },
    ];

    // ---------------------------------------------------------------------------------------------
    // -------------------------------------- [ Q U E R Y ] ----------------------------------------
    const { refetch: renewalProjectRefetch } = useQuery(
        ["getAllRenewalProject"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    deleted_at: { _is_null: true },
                    is_canceled: { _eq: false },
                    _and: [
                        {
                            name: {
                                _like: `%${getValues("project.label") || ""}%`,
                            },
                        },
                        {
                            client: {
                                name: {
                                    _like: `%${
                                        getValues("client.label") || ""
                                    }%`,
                                },
                            },
                        },
                        {
                            type: {
                                value: {
                                    _in:
                                        getValues("type") === "default" ||
                                        getValues("type") === "all"
                                            ? [
                                                  ProductType.LICENSE,
                                                  ProductType.MAINTENANCE,
                                              ]
                                            : getValues("type") === "무상"
                                              ? [ProductType.LICENSE]
                                              : [ProductType.MAINTENANCE],
                                },
                            },
                        },
                    ],
                },
            }),
        {
            onSuccess(data) {
                // renewal project
                const project = data.project.filter(item => {
                    const contract = item.contracts.find(item => {
                        return item.deleted_at === null;
                    });
                    const today = dayjs(new Date());

                    const endDate =
                        item.type.value === ProductType.LICENSE
                            ? dayjs(item.free_end_date)
                            : dayjs(item.end_date);

                    const duration = endDate.diff(today, "days");

                    // console.log(getValues("start_date"));
                    // console.log(getValues("end_date"));

                    // ------------------------- [ 기간 범위 필터링 ] -------------------------
                    // ** 범위 설정 안 한 경우 => ( 계약 or 무상 지원 종료일까지 90일 미만으로 남은 대상 ) **
                    if (!getValues("start_date") && !getValues("end_date")) {
                        setValue("start_date", today);
                        setValue("end_date", today.add(90, "day"));

                        return duration <= 90 && duration >= 0 && contract?.id;

                        // ** 범위 지정 (시작) => 종료일이 선택한 날짜 이후인 대상 **
                    } else if (
                        getValues("start_date") &&
                        !getValues("end_date")
                    ) {
                        return (
                            endDate.isSameOrAfter(
                                dayjs(getValues("start_date")),
                                "day"
                            ) && contract?.id
                        );

                        // ** 범위 지정 (종료) => 종료일이 선택한 날짜 이전인 대상 **
                    } else if (
                        !getValues("start_date") &&
                        getValues("end_date")
                    ) {
                        return (
                            endDate.isSameOrBefore(
                                dayjs(getValues("end_date")),
                                "day"
                            ) && contract?.id
                        );

                        // ** 범위 지정 (시작 ~ 종료) => 종료일이 선택한 날짜 사이에 포함되는 대상 **
                    } else if (
                        getValues("start_date") &&
                        getValues("end_date")
                    ) {
                        return (
                            endDate.isBetween(
                                getValues("start_date"),
                                getValues("end_date"),
                                "day",
                                "[]"
                            ) && contract?.id
                        );
                    }
                });

                // console.log(project);

                const rows = project.map((item, idx) => {
                    return {
                        id: idx + 1,
                        pk: item?.id,
                        client_name: item?.client.name,
                        project_name: item?.name,
                        type:
                            item?.type.value === ProductType.LICENSE
                                ? "무상"
                                : "유상",
                        expiration_date: dayjs(
                            item?.type.value === ProductType.LICENSE
                                ? item?.free_end_date
                                : item?.end_date
                        ).format("YYYY/MM/DD"),
                    };
                });

                setRows(rows);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S E T T I N G S ] -------------------------------------
    const onClickRow = (id: number) => {
        const target = rows.find(item => {
            return (item.id = id);
        });

        if (target?.type === "무상") {
            router.push(`${PATH.LICENSE.PROJECT.MAIN}/${id}`);
        } else if (target?.type === "유상") {
            router.push(`${PATH.REPAIR.PROJECT.MAIN}/${id}`);
        }
    };

    const onClickSearch = () => {
        renewalProjectRefetch();
    };

    return (
        <VRenewalTable
            {...props}
            columns={columns.map(item => {
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
            types={types}
            projects={projects}
            clients={clients}
            control={control}
            onClickRow={onClickRow}
            onClickSearch={onClickSearch}
        />
    );
};

export default RenewalTable;
