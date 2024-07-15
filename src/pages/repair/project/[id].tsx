import { BasicTemplate, PageTitle } from "@common/components";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import projectService from "@domains/project/service/project.service";
import { Badge, IconButton } from "@mui/material";
import loginState from "@recoils/login-state.atom";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import {
    MdOutlineComment,
    MdOutlineDelete,
    MdOutlineEdit,
} from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { css } from "@emotion/react";
import { RepairProjectDetail } from "@domains/project";
import dayjs from "dayjs";
import chatScreenState from "@recoils/chat-screen-state.atom";
import commentsService from "@domains/comments/service/comments.service";
import { ICommentsList } from "@domains/comments/components/comments-list/CommentsList.interface";

const RepairProjectDetailPage: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    // 댓글
    const [chatScreenRecoil, setChatScreenRecoil] =
        useRecoilState(chatScreenState);
    const [hasChat, setHasChat] = useState<boolean>(true);

    // ---------------------------------------------
    // 사업 상세조회 ( QUERY )
    // ---------------------------------------------

    const { data: projectData } = useQuery(
        [router.isReady, `get repair project detail of project ${id}`],
        () => projectService.getProjectByPk({ id }),
        {
            enabled: router.isReady,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            // onSuccess: data => {
            //     // 사업
            //     setProject(data);
            //     // 라이선스 도입 사업 목록
            //     const licenseContracts =
            //         data.project_by_pk.license_contracts.map(
            //             (contract, idx) => {
            //                 return {
            //                     id: idx + 1,
            //                     pk: contract.contract.id,
            //                     name: contract.contract.project.name,
            //                     contract_period_start: dayjs(
            //                         contract.contract.contract_period_start
            //                     ).format("YYYY년 MM월 DD일"),
            //                     contract_period_end: dayjs(
            //                         contract.contract.contract_period_end
            //                     ).format("YYYY년 MM월 DD일"),
            //                 };
            //             }
            //         );
            //     setLicenseContractRows(licenseContracts);
            //     // 담당자
            //     const employees = data.project_by_pk.employees.map(
            //         (emp, idx) => {
            //             return {
            //                 id: idx + 1,
            //                 pk: emp.employee.id,
            //                 name: emp.employee.name,
            //                 company: emp.employee.company.name,
            //                 role: emp.role.value,
            //                 role_code: emp.role.code,
            //             };
            //         }
            //     );
            //     setEmployeeRows(employees);
            //     // refetchCnt + 1
            //     setRefetchCnt(prev => prev + 1);
            // },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // [ 댓글 전체 조회 ]
    const {} = useQuery(
        ["getAllCommentsByProjectId"],
        () =>
            commentsService.getAllCommentsByProjectId({
                project_id: id,
            }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                let commentsList: ICommentsList.IComments[] = [];

                data.comments.forEach(item => {
                    commentsList.push({
                        id: item.id,
                        user_name: item.writer_name,
                        contents: item.contents,
                        created_at: dayjs(item.created_at),
                        updated_at: dayjs(item.updated_at),
                    });
                });

                if (commentsList.length >= 1) {
                    setHasChat(true);
                } else {
                    setHasChat(false);
                }
            },
        }
    );

    // ---------------------------------------------
    // 사업 삭제 ( MUTATION )
    // ---------------------------------------------
    const { mutate: deleteProjectByIdMutate, isLoading: isDeleteLoading } =
        useMutation(
            [`get project detail of project ${id}`],
            () =>
                projectService.deleteProjectById({
                    id: projectData!.project_by_pk.id,
                    deleted_by: loginUser.id!,
                }),
            {
                onSuccess(data, variables, context) {
                    router.push(PATH.REPAIR.PROJECT.MAIN);
                },
            }
        );
    const onClickDeleteProjectById = () => {
        if (confirm("사업을 삭제하시겠습니까?")) {
            deleteProjectByIdMutate();
        }
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="유지보수 사업 상세"
                    isVisible={true}
                    path={PATH.REPAIR.PROJECT.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > 유지보수 사업 > "}
                        <span css={{ color: Colors.oceanBlue }}>사업 상세</span>
                    </p>
                    {!projectData?.project_by_pk.deleted_at && (
                        <div className="btn-group">
                            <IconButton
                                color="wildStrawberry"
                                onClick={onClickDeleteProjectById}
                                disabled={
                                    projectData?.project_by_pk.is_canceled
                                }
                            >
                                <MdOutlineDelete size={20} />
                            </IconButton>
                            <div className="space" />
                            <IconButton
                                color="oceanBlue"
                                onClick={() =>
                                    router.push(
                                        `${PATH.REPAIR.PROJECT.EDIT}/${id}`
                                    )
                                }
                                disabled={
                                    projectData?.project_by_pk.is_canceled
                                }
                            >
                                <MdOutlineEdit size={20} />
                            </IconButton>
                            <div className="space" />
                            <Badge
                                sx={{
                                    "& .MuiBadge-badge": {
                                        backgroundColor: Colors.wildStrawberry,
                                        right: 2,
                                        top: 2,
                                    },
                                }}
                                variant="dot"
                                invisible={!hasChat}
                            >
                                <IconButton
                                    id="comments-btn"
                                    color={
                                        chatScreenRecoil
                                            ? "lightPurple"
                                            : "deepPurple"
                                    }
                                    onClick={() => {
                                        setChatScreenRecoil(!chatScreenRecoil);
                                    }}
                                >
                                    <MdOutlineComment size={20} />
                                </IconButton>
                            </Badge>
                        </div>
                    )}
                    {!!projectData?.project_by_pk.deleted_at && (
                        <div id="btn-group">
                            <Badge
                                sx={{
                                    "& .MuiBadge-badge": {
                                        backgroundColor: Colors.wildStrawberry,
                                        right: 2,
                                        top: 2,
                                    },
                                }}
                                variant="dot"
                                invisible={!hasChat}
                            >
                                <IconButton
                                    id="comments-btn"
                                    color={
                                        chatScreenRecoil
                                            ? "lightPurple"
                                            : "deepPurple"
                                    }
                                    onClick={() => {
                                        setChatScreenRecoil(!chatScreenRecoil);
                                    }}
                                >
                                    <MdOutlineComment size={20} />
                                </IconButton>
                            </Badge>
                        </div>
                    )}
                </div>
                <RepairProjectDetail
                    projectData={projectData}
                    licenseContractRows={
                        projectData?.project_by_pk.license_contracts.map(
                            (contract, idx) => {
                                return {
                                    id: idx + 1,
                                    pk: contract.contract.id,
                                    name: contract.contract.project.name,
                                    contract_period_start: dayjs(
                                        contract.contract.contract_period_start
                                    ).format("YYYY년 MM월 DD일"),
                                    contract_period_end: dayjs(
                                        contract.contract.contract_period_end
                                    ).format("YYYY년 MM월 DD일"),
                                };
                            }
                        ) || []
                    }
                    employeeRows={
                        projectData?.project_by_pk.employees.map((emp, idx) => {
                            return {
                                id: idx + 1,
                                pk: emp.employee.id,
                                name: emp.employee.name,
                                company: emp.employee.company.name,
                                role: emp.role.value,
                                role_code: emp.role.code,
                            };
                        }) || []
                    }
                    estimateRows={
                        projectData?.project_by_pk.estimates
                            .filter(ele => !ele.deleted_at)
                            .map((ele, idx) => ({
                                id: idx + 1,
                                pk: ele.id,
                                client: ele.project.client.name || "-",
                                case_name: ele.case_name || "-",
                                destination: ele.destination || "-",
                                is_final: ele.is_final,
                                order: ele.order || 0,
                                estimate_date: !!ele.estimate_date
                                    ? dayjs(ele.estimate_date).format(
                                          "YYYY/MM/DD"
                                      )
                                    : "-",
                            })) || []
                    }
                    contractRows={
                        projectData?.project_by_pk.contracts
                            .filter(ele => !ele.deleted_at)
                            .map((ele, idx) => ({
                                id: idx + 1,
                                pk: ele.id,
                                contract_name: ele.name || "-",
                                client: ele.client.name || "-",
                                sales_representative:
                                    ele.sales_representative.name || "-",
                            })) || []
                    }
                    salesRows={
                        projectData?.project_by_pk.sales
                            .filter(ele => !ele.deleted_at)
                            .map((ele, idx) => ({
                                id: idx + 1,
                                pk: ele.id,
                                client: ele.client.name || "-",
                                sales_representative:
                                    ele.sales_representative.name || "-",
                                audit_date: !!ele.audit_date
                                    ? dayjs(ele.audit_date).format("YYYY/MM/DD")
                                    : "-",
                            })) || []
                    }
                />
            </div>
        </BasicTemplate>
    );
};

export default RepairProjectDetailPage;

const rootStyle = css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }
    .menu-info {
        color: ${Colors.gray};
    }
    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }
    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 120px;
    }
    .btn-group {
        width: 80px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        .space {
            width: 16px;
        }
    }
`;
