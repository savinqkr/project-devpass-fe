import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { RepairProjectForm } from "@domains/project";
import { IRepairProjectForm } from "@domains/project/components/repair-project-form/RepairProjectForm.interface";
import projectService from "@domains/project/service/project.service";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const RepairProjectEdit: NextPage = () => {
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
    } = useForm<IRepairProjectForm.IForm>({
        defaultValues: {
            inspect_cycle: "없음",
            inspect_method: "없음",
        },
    });

    // 자동 입력 활성 여부
    const [isAutoCompleteActivated, setIsAutoCompleteActivated] =
        useState<boolean>(true);

    //  COMMON CODE ( 유지보수 )
    const { data: repairCode } = useQuery(["get repair type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.REPAIR },
            },
        })
    );

    // 라이선스 도입 사업 그리드 ApiRef
    const licenseContractApiRef = useGridApiRef();

    // 선택한 담당자 목록 & GRID ROW
    const [employeeRows, setEmployeeRows] = useState<GridRowsProp>([]);

    // ---------------------------------------------------
    // 기존 사업 정보 조회 ( QUERY )
    // ---------------------------------------------------
    const {
        data: originalProjectData,
        refetch: fetchOriginalRepairProjectData,
    } = useQuery(
        [`get repair project detail of project ${id}`],
        () => projectService.getProjectByPk({ id }),
        {
            enabled: false,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const {
                    project_by_pk: {
                        name,
                        client,
                        contractor,
                        start_date,
                        end_date,
                        license_contracts,
                        employees,
                        consultant_name,
                        consultant_email,
                        consultant_contact,
                        consultant_phone,
                        inspect_cycle,
                        inspect_method,
                        inspect_option,
                        inspect_note,
                        repair_rate,
                        repair_last_year_rate,
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
                // setValue("start_date", dayjs(start_date).utc(true));
                // setValue("end_date", dayjs(end_date).utc(true));
                if (start_date) {
                    setValue("start_date", dayjs(start_date).utc(true));
                }
                if (end_date) {
                    setValue("end_date", dayjs(end_date).utc(true));
                }
                // 라이선스 도입 사업 목록 > OPTION DATA 를 받아 온 후, 선택 모드 전환
                // 담당자
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
                // 엔지니어(컨설턴트) > OPTION DATA 를 받아 온 후, SELECTOR SELECT
                setValue("consultant_name", consultant_name || "");
                setValue("consultant_email", consultant_email || "");
                setValue("consultant_contact", consultant_contact || "");
                setValue("consultant_phone", consultant_phone || "");
                // 정기점검
                setValue("inspect_cycle", inspect_cycle || "");
                setValue("inspect_method", inspect_method || "");
                setValue("inspect_option", inspect_option || "");
                setValue("inspect_note", inspect_note || "");
                // 요율
                if (!!repair_rate) setValue("repair_rate", `${repair_rate}`);
                if (!!repair_last_year_rate)
                    setValue(
                        "repair_last_year_rate",
                        `${repair_last_year_rate}`
                    );

                // 기존 데이터를 가져온 후, 자동 입력 비활성화
                setIsAutoCompleteActivated(false);
            },
        }
    );

    useEffect(() => {
        if (!!id) {
            fetchOriginalRepairProjectData();
        }
    }, []);

    // ---------------------------------------------------
    // 사업 정보 수정 ( MUTATION )
    // ---------------------------------------------------
    const { mutate: editRepairProjectMutate } = useMutation(
        [`edit repair proejct of id ${originalProjectData?.project_by_pk.id}`],
        () =>
            projectService.editProject({
                updated_by: loginUser.id!,
                type_code: repairCode?.common_code[0].code!,
                id: originalProjectData!.project_by_pk.id,
                name: getValues("name"),
                client_id: getValues("client_id.value") as number,
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
                license_contracts: Array.from(
                    licenseContractApiRef.current.getSelectedRows().values()
                ).map(row => row.pk),
                employees: employeeRows.map(emp => {
                    return {
                        employee_id: emp.pk,
                        role_code: emp.role_code,
                    };
                }),
                consultant_name: getValues("consultant_name"),
                consultant_email: getValues("consultant_email"),
                consultant_contact: getValues("consultant_contact"),
                consultant_phone: getValues("consultant_phone"),
                inspect_cycle: getValues("inspect_cycle"),
                inspect_method: getValues("inspect_method"),
                inspect_option: getValues("inspect_option"),
                inspect_note: getValues("inspect_note"),
                repair_rate:
                    getValues("repair_rate") === ""
                        ? undefined
                        : parseFloat(getValues("repair_rate")),
                repair_last_year_rate:
                    getValues("repair_last_year_rate") === ""
                        ? undefined
                        : parseFloat(getValues("repair_last_year_rate")),
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.REPAIR.PROJECT.MAIN}/${data.editProject.project.id}`
                );
            },
        }
    );

    const onClickSubmit = () => {
        // console.log(originalProjectData!.project_by_pk.id);
        // console.log(getValues("name"));
        // console.log(getValues("client_id.label"));
        // console.log(getValues("client_id.value"));
        // console.log(getValues("contractor_id.label"));
        // console.log(getValues("contractor_id.value"));
        // console.log(getValues("start_date").toDate());
        // console.log(getValues("end_date").toDate());
        // console.log(
        //     Array.from(
        //         licenseContractApiRef.current.getSelectedRows().values()
        //     ).map(row => row.pk)
        // );

        if (employeeRows.length === 0) {
            alert("담당자를 등록해주세요.");
        } else {
            editRepairProjectMutate();
        }
    };
    return (
        <BasicTemplate>
            <PageTitle
                title="유지보수 사업 수정"
                isVisible={false}
                path={`${PATH.REPAIR.PROJECT.MAIN}/${id}`}
            />
            <RepairProjectForm
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                licenseContractApiRef={licenseContractApiRef}
                // licenseContractRows={licenseContractRows}
                // setLicenseContractRows={setLicenseContractRows}
                employeeRows={employeeRows}
                setEmployeeRows={setEmployeeRows}
                onClickSubmit={handleSubmit(onClickSubmit)}
                originalProjectData={originalProjectData}
                isAutoCompleteActivated={isAutoCompleteActivated}
                setIsAutoCompleteActivated={setIsAutoCompleteActivated}
            />
        </BasicTemplate>
    );
};

export default RepairProjectEdit;
