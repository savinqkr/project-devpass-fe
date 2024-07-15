import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { LicenseProjectForm } from "@domains/project";
import { ILicenseProjectForm } from "@domains/project/components/license-project-form/LicenseProjectForm.interface";
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

const LicenseProjectRegister: NextPage = () => {
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
    } = useForm<ILicenseProjectForm.IForm>();

    //  COMMON CODE ( 라이선스 )
    const { data: licenseCode } = useQuery(
        ["get license type common code"],
        () =>
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

    // 사업 등록
    const { mutate: registerLicenseProjectMutate } = useMutation(
        ["register license proejct"],
        () =>
            projectService.regisgerProject({
                created_by: loginUser.id!,
                type_code: licenseCode?.common_code[0].code!,
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
                    `${PATH.LICENSE.PROJECT.MAIN}/${data.registerProject.project.id}`
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
        // console.log(getValues("optrans_date").toDate());
        // console.log(getValues("inspect_date").toDate());
        // console.log(getValues("free_start_date").toDate());
        // console.log(getValues("free_end_date").toDate());
        // console.log(getValues("participate_type"));
        // console.log(getValues("note"));
        // console.log(partnerRows);
        // console.log(employeeRows);
        if (employeeRows.length === 0) {
            alert("담당자를 등록해주세요.");
        } else {
            registerLicenseProjectMutate();
        }
    };

    return (
        <BasicTemplate>
            <PageTitle title="라이선스 사업 등록" isVisible={false} />
            <LicenseProjectForm
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                getValues={getValues}
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

export default LicenseProjectRegister;
