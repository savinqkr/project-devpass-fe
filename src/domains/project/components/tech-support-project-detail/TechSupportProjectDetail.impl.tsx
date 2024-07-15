import { GridColDef } from "@mui/x-data-grid";
import { ITechSupportProjectDetail } from "./TechSupportProjectDetail.interface";
import VLicenseProjectDetail from "./TechSupportProjectDetail.view";
import { useState } from "react";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { CodeCategory } from "src/enums/code_category.enum";
import { useRecoilState, useRecoilValue } from "recoil";
import chatScreenState from "@recoils/chat-screen-state.atom";
import { Box, Typography } from "@mui/material";
import { Colors } from "@configs/colors";
import { useMutation, useQuery } from "react-query";
import projectService from "@domains/project/service/project.service";
import loginState from "@recoils/login-state.atom";
import codeService from "@common/services/code/code.service";
import { CompanyType } from "src/enums/company_type.enum";

const TechSupportProjectDetail: React.FC<
    ITechSupportProjectDetail.IProps
> = props => {
    const { projectData } = props;

    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    const [chatScreenRecoil, setChatScreenRecoil] =
        useRecoilState(chatScreenState);

    //  COMMON CODE ( 본사 )
    const { data: headOffice } = useQuery(
        ["get head office company type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMPANY_TYPE },
                    value: { _eq: CompanyType.HEAD },
                },
            })
    );

    // 담당자 ROW 클릭 >  담당자 상세 페이지 라우팅
    const onClickEmployeeRow = (pk: string) => {
        setChatScreenRecoil(false); // 댓글창 닫음
        const targetEmp = projectData?.project_by_pk.employees?.find(
            emp => emp.employee.id == parseInt(pk, 10)
        );

        if (!!targetEmp) {
            const isUser =
                targetEmp.employee.company.type.code ===
                headOffice?.common_code[0].code;

            if (isUser) {
                router.push(`${PATH.ADMIN.USER.MAIN}/${pk}`);
            } else {
                router.push(`${PATH.CLIENT.EMPLOYEE.MAIN}/${pk}`);
            }
        } else {
            alert("담당자가 존재하지 않습니다.");
        }
    };

    const onClickEstimateRow = (pk: string) => {
        setChatScreenRecoil(false); // 댓글창 닫음
        router.push(`${PATH.LICENSE.ESTIMATE.MAIN}/${pk}`);
    };

    const onClickContractRow = (pk: string) => {
        setChatScreenRecoil(false); // 댓글창 닫음
        router.push(`${PATH.LICENSE.CONTRACT.MAIN}/${pk}`);
    };

    const onClickSalesRow = (pk: string) => {
        setChatScreenRecoil(false); // 댓글창 닫음
        router.push(`${PATH.LICENSE.SALES.MAIN}/${pk}`);
    };

    const employeeColumns: GridColDef[] = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "company", headerName: "회사명", flex: 1.5 },
        { field: "name", headerName: "담당자명", flex: 1.5 },
        { field: "role", headerName: "역할", flex: 1 },
    ];

    const estimateColumns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        { field: "case_name", headerName: "건명", flex: 2, minWidth: 200 },
        { field: "client", headerName: "고객사", flex: 1.5, minWidth: 120 },
        {
            field: "destination",
            headerName: "수신처",
            flex: 1.5,
            minWidth: 120,
        },
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
            flex: 1.5,
            minWidth: 120,
        },
    ];
    const contractColumns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        { field: "contract_name", headerName: "계약명", flex: 2 },
        { field: "client", headerName: "고객사", flex: 1.5 },
        { field: "sales_representative", headerName: "영업 담당자", flex: 1 },
    ];
    const salesColumns: GridColDef[] = [
        { field: "id", headerName: "No.", width: 60 },
        { field: "client", headerName: "고객사", flex: 2 },
        { field: "audit_date", headerName: "검수일", flex: 1.5 },
        { field: "sales_representative", headerName: "영업 담당자", flex: 1 },
    ];

    // TABS
    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // ----------------------------------------------------
    // 사업 해지
    // ----------------------------------------------------
    const { data: canceledProjectData, mutate: cancelPrijectByPkMutate } =
        useMutation([`cancel tech support project of ID : ${id}`], () =>
            projectService.cancelProjectByPk({
                id,
                updated_by: loginUser.id!,
            })
        );
    const onClickCancelProject = () => {
        if (confirm("해당 사업을 해지하시겠습니까?")) {
            if (router.isReady) {
                cancelPrijectByPkMutate();
            }
        }
    };

    return (
        <VLicenseProjectDetail
            {...props}
            employeeColumns={employeeColumns.map(col => {
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
            estimateColumns={estimateColumns.map(col => {
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
            contractColumns={contractColumns.map(col => {
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
            salesColumns={salesColumns.map(col => {
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
            onClickEmployeeRow={onClickEmployeeRow}
            onClickEstimateRow={onClickEstimateRow}
            onClickContractRow={onClickContractRow}
            onClickSalesRow={onClickSalesRow}
            tabValue={tabValue}
            handleChangeTab={handleChangeTab}
            onClickCancelProject={onClickCancelProject}
        />
    );
};

export default TechSupportProjectDetail;
