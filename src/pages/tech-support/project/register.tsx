import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import TechSupportProjectForm from "@domains/project/components/tech-support-project-form";
import { ITechSupportProjectForm } from "@domains/project/components/tech-support-project-form/TechSupportProjectForm.interface";
import projectService from "@domains/project/service/project.service";
import { GridRowsProp } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const TechSupportProjectRegister: NextPage = () => {
    const router = useRouter();
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

    // TYPE CODE 조회
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

    // 사업 등록
    const { mutate: registerTechSupportProjectMutate } = useMutation(
        ["register tech support project"],
        () =>
            projectService.regisgerProject({
                created_by: loginUser.id!,
                type_code: techSupportCode?.common_code[0].code!,
                name: getValues("name"),
                client_id: getValues("client_id.value"),
                // contractor_id: getValues("contractor_id.value"),
                // start_date: getValues("start_date").toDate(),
                // end_date: getValues("end_date").toDate(),
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
                    `${PATH.TECHSUPPORT.PROJECT.MAIN}/${data.registerProject.project.id}`
                );
            },
        }
    );

    const onClickSubmit = () => {
        // console.log(getValues("name"));
        // console.log(getValues("client_id.label"));
        // console.log(getValues("client_id.value"));
        // console.log(getValues("contractor_id.label"));
        // console.log(getValues("contractor_id.value"));
        // console.log(getValues("start_date").toDate());
        // console.log(getValues("end_date").toDate());
        // console.log(employeeRows);
        if (employeeRows.length === 0) {
            alert("담당자를 등록해주세요.");
        } else {
            registerTechSupportProjectMutate();
        }
    };

    return (
        <BasicTemplate>
            <PageTitle title="기술지원 사업 등록" isVisible={false} />
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

export default TechSupportProjectRegister;
