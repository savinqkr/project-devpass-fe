import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import TechSupportProjectForm from "@domains/project/components/tech-support-project-form";
import { ITechSupportProjectForm } from "@domains/project/components/tech-support-project-form/TechSupportProjectForm.interface";
import projectService from "@domains/project/service/project.service";
import { GridRowsProp } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const TechSupportProjectEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    const {
        register,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ITechSupportProjectForm.IForm>();

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

    // 선택한 담당자 목록 & GRID ROW
    const [employeeRows, setEmployeeRows] = useState<GridRowsProp>([]);

    // ---------------------------------------------------
    // 기존 사업 정보 조회 ( QUERY )
    // ---------------------------------------------------
    const { data: projectData } = useQuery(
        [`get project detail of project ${id}`],
        () => projectService.getProjectByPk({ id }),
        {
            enabled: !!id,
            onSuccess(data) {
                const {
                    project_by_pk: {
                        name,
                        client,
                        contractor,
                        start_date,
                        end_date,
                        employees,
                    },
                } = data;
                setValue("name", name);
                setValue("client_id", { label: client.name, value: client.id });
                if (contractor) {
                    setValue("contractor_id", {
                        label: contractor.name,
                        value: contractor.id,
                    });
                }
                if (start_date) {
                    setValue("start_date", dayjs(start_date).utc(true));
                }
                if (end_date) {
                    setValue("end_date", dayjs(end_date).utc(true));
                }
                const employeesGridRows = employees.map((emp, idx) => {
                    return {
                        id: idx + 1,
                        pk: emp.employee.id,
                        name: emp.employee.name,
                        company: emp.employee.company.name,
                        role: emp.role.value,
                        role_code: emp.role.code,
                    };
                });
                setEmployeeRows(employeesGridRows);
            },
        }
    );

    // ---------------------------------------------------
    // 사업 정보 수정 ( MUTATION )
    // ---------------------------------------------------
    const { mutate: editTechSupportProjectMutate } = useMutation(
        [`edit tech support proejct of id ${projectData?.project_by_pk.id}`],
        () =>
            projectService.editProject({
                updated_by: loginUser.id!,
                type_code: techSupportCode?.common_code[0].code!,
                id: projectData!.project_by_pk.id,
                name: getValues("name"),
                client_id: getValues("client_id.value"),
                ...(`${getValues("contractor_id.value")}` !== "default" && {
                    contractor_id: getValues("contractor_id.value"),
                }),
                ...(getValues("start_date") && {
                    start_date: getValues("start_date").toDate(),
                }),
                ...(getValues("end_date") && {
                    end_date: getValues("end_date").toDate(),
                }),
                employees: employeeRows.map(emp => {
                    return {
                        employee_id: emp.pk,
                        role_code: emp.role_code,
                    };
                }),
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.TECHSUPPORT.PROJECT.MAIN}/${data.editProject.project.id}`
                );
            },
        }
    );

    const onClickSubmit = () => {
        // console.log(projectData!.project_by_pk.id);
        // console.log(getValues("name"));
        // console.log(getValues("client_id.label"));
        // console.log(getValues("client_id.value"));
        // console.log(getValues("contractor_id.label"));
        // console.log(getValues("contractor_id.value"));
        // console.log(getValues("start_date").toDate());
        // console.log(getValues("end_date").toDate());
        // console.log(getValues("optrans_date").toDate());
        // console.log(getValues("inspect_date").toDate());
        // console.log(getValues("free_start_date").toDate());
        // console.log(getValues("free_end_date").toDate());
        // console.log(getValues("participate_type"));
        // console.log(getValues("note"));

        if (employeeRows.length === 0) {
            alert("담당자를 등록해주세요.");
        } else {
            editTechSupportProjectMutate();
        }
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="기술지원 사업 수정"
                isVisible={false}
                path={`${PATH.TECHSUPPORT.PROJECT.MAIN}/${id}`}
            />
            <TechSupportProjectForm
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                employeeRows={employeeRows}
                setEmployeeRows={setEmployeeRows}
                onClickSubmit={handleSubmit(onClickSubmit)}
            />
        </BasicTemplate>
    );
};

export default TechSupportProjectEdit;
