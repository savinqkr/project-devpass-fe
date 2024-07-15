import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import PATH from "@constants/path";
import tailService from "@domains/tail/services/tail.service";
import { ITailTable } from "./TailTable.interface";
import VTailTable from "./TailTable.view";
import getSelectOptions from "@domains/tail/hooks/getSelectOptions";
import { useForm } from "react-hook-form";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { useRecoilState } from "recoil";
import loginState from "@recoils/login-state.atom";
import { Permission, ProductType } from "@enums";

const TailTable: React.FC<ITailTable.IProps> = props => {
    const router = useRouter();
    var [rows, setRows] = useState<GridRowsProp>([]);
    const { getValues, watch, control } = useForm<ITailTable.IFilter>();

    const [loginUser, setLoginUser] = useRecoilState(loginState);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ D E L E T E  F I L T E R ] ---------------------------------
    const [showDeleted, setShowDeleted] = useState<boolean>(false);

    const handleShowDeleted = (newState: boolean) => {
        setShowDeleted(newState);
    };

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ]-------------------------------------------
    // 전체
    const { refetch: getAllTailsMutation, data: allTails } = useQuery(
        ["getAllTailsMutation", showDeleted],
        () =>
            tailService.getAllTailByType({
                where: {
                    deleted_at: showDeleted ? {} : { _is_null: true },
                },
            }),
        {
            onSuccess(data) {
                const tails = data.tail.map((tail, idx) => {
                    return {
                        id: idx + 1,
                        pk: tail.id,
                        name: tail.name,
                        type: tail.type.value,
                        updated_at: tail.deleted_at
                            ? dayjs(tail.deleted_at).format("YYYY/MM/DD")
                            : dayjs(tail.updated_at).format("YYYY/MM/DD"),
                        deleted_at: tail.deleted_at
                            ? dayjs(tail.deleted_at).format("YYYY/MM/DD")
                            : tail.deleted_at,
                    };
                });
                setRows(tails);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ F I L T E R ]-----------------------------------------
    const typeOptions: { label: string; value: string }[] = [
        { label: "전체", value: "all" },
        ...getSelectOptions("common_type"),
    ];

    const { refetch: getAllTailByType } = useQuery(
        ["getAllTailByType", watch("type")],
        () =>
            tailService.getAllTailByType({
                where: {
                    type_code:
                        getValues("type") === "all" ||
                        getValues("type") === "default"
                            ? {}
                            : { _eq: getValues("type") as number },
                },
            }),
        {
            enabled: false,
            onSuccess(data) {
                const tails = data.tail.map((tail, idx) => {
                    return {
                        id: idx + 1,
                        pk: tail.id,
                        name: tail.name,
                        type: tail.type.value,
                        updated_at: dayjs(tail.updated_at).format("YYYY/MM/DD"),
                        deleted_at: tail.deleted_at
                            ? dayjs(tail.deleted_at).format("YYYY/MM/DD")
                            : tail.deleted_at,
                    };
                });

                setRows(tails);
            },
        }
    );

    useEffect(() => {
        if (getValues("type") === "all") {
            getAllTailsMutation();
        } else {
            getAllTailByType();
        }
    }, [watch("type")]);

    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        {
            field: "name",
            headerName: "Tail 명",
            flex: 4,
            minWidth: 120,
        },
        {
            field: "type",
            headerName: "구분",
            flex: 2,
            minWidth: 100,
        },
        {
            flex: 1.5,
            minWidth: 90,
            headerName: "수정일",
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

    const onClickRow = (id: number) => {
        router.push(`${PATH.ADMIN.SETTINGS.TAIL.MAIN}/${id}`);
    };

    return (
        <VTailTable
            control={control}
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
            onClickRow={onClickRow}
            rows={rows}
            typeOptions={typeOptions}
            allTailLength={allTails?.tail.length ?? 0}
            showDeleted={showDeleted}
            handleShowDeleted={handleShowDeleted}
            {...props}
        />
    );
};

export default TailTable;
