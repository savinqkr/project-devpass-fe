import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { LicenseProjectForm } from "@domains/project";
import { ILicenseProjectForm } from "@domains/project/components/license-project-form/LicenseProjectForm.interface";
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

const LicenseProjectEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    const {
        register,
        control,
        setValue,
        getValues,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ILicenseProjectForm.IForm>();

    //  COMMON CODE ( 라이선스 )
    const { data: licenseCode } = useQuery(["get license type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.LICENSE },
            },
        })
    );

    // 선택한 파트너사 목록 & GRID ROW
    const [partnerRows, setPartnerRows] = useState<GridRowsProp>([]);

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
                        optrans_date,
                        inspect_date,
                        free_start_date,
                        free_end_date,
                        participate_type,
                        note,
                        partners,
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
                if (optrans_date) {
                    setValue("optrans_date", dayjs(optrans_date).utc(true));
                }
                if (inspect_date) {
                    setValue("inspect_date", dayjs(inspect_date).utc(true));
                }
                if (free_start_date) {
                    setValue(
                        "free_start_date",
                        dayjs(free_start_date).utc(true)
                    );
                }
                if (free_end_date) {
                    setValue("free_end_date", dayjs(free_end_date).utc(true));
                }
                setValue("participate_type", participate_type);
                setValue("note", note);
                const partnerGridRows = partners.map((comp, idx) => {
                    return {
                        id: idx + 1,
                        pk: comp.company.id,
                        name: comp.company.name,
                        type: comp.company.type.value,
                    };
                });
                setPartnerRows(partnerGridRows);
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
    const { mutate: editLicenseProjectMutate } = useMutation(
        [`edit license proejct of id ${projectData?.project_by_pk.id}`],
        () =>
            projectService.editProject({
                updated_by: loginUser.id!,
                type_code: licenseCode?.common_code[0].code!,
                id: projectData!.project_by_pk.id,
                name: getValues("name"),
                client_id: getValues("client_id.value"),
                // contractor_id: getValues("contractor_id.value"),
                // start_date: getValues("start_date").toDate(),
                // end_date: getValues("end_date").toDate(),
                // optrans_date: getValues("optrans_date").toDate(),
                // inspect_date: getValues("inspect_date").toDate(),
                // free_start_date: getValues("free_start_date").toDate(),
                // free_end_date: getValues("free_end_date").toDate(),
                // participate_type: getValues("participate_type"),
                // note: getValues("note"),
                ...(`${getValues("contractor_id.value")}` !== "default" && {
                    contractor_id: getValues("contractor_id.value"),
                }),
                ...(getValues("start_date") && {
                    start_date: getValues("start_date").toDate(),
                }),
                ...(getValues("end_date") && {
                    end_date: getValues("end_date").toDate(),
                }),
                ...(getValues("optrans_date") && {
                    optrans_date: getValues("optrans_date").toDate(),
                }),
                ...(getValues("inspect_date") && {
                    inspect_date: getValues("inspect_date").toDate(),
                }),
                ...(getValues("free_start_date") && {
                    free_start_date: getValues("free_start_date").toDate(),
                }),
                ...(getValues("free_end_date") && {
                    free_end_date: getValues("free_end_date").toDate(),
                }),
                ...(getValues("participate_type") && {
                    participate_type: getValues("participate_type"),
                }),
                ...(getValues("note") && {
                    note: getValues("note"),
                }),
                partners: partnerRows.map(comp => comp.pk),
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
                    `${PATH.LICENSE.PROJECT.MAIN}/${data.editProject.project.id}`
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
            editLicenseProjectMutate();
        }
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="라이선스 사업 수정"
                isVisible={false}
                path={`${PATH.LICENSE.PROJECT.MAIN}/${id}`}
            />
            <LicenseProjectForm
                register={register}
                control={control}
                errors={errors}
                getValues={getValues}
                watch={watch}
                setValue={setValue}
                partnerRows={partnerRows}
                setPartnerRows={setPartnerRows}
                employeeRows={employeeRows}
                setEmployeeRows={setEmployeeRows}
                onClickSubmit={handleSubmit(onClickSubmit)}
            />
        </BasicTemplate>
    );
};

export default LicenseProjectEdit;
