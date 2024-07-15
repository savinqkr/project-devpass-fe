import { BasicTemplate, PageTitle } from "@common/components";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { RepairProjectForm } from "@domains/project";
import { IRepairProjectForm } from "@domains/project/components/repair-project-form/RepairProjectForm.interface";
import projectService from "@domains/project/service/project.service";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { CodeCategory } from "src/enums/code_category.enum";
import { CommonType } from "src/enums/common_type.enum";

const RepairProjectRegister: NextPage = () => {
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

    // 사업 등록
    const { mutate: registerLicenseProjectMutate } = useMutation(
        ["register repair proejct"],
        () => {
            let selectedRows = [];

            if (
                !!licenseContractApiRef.current &&
                typeof licenseContractApiRef.current.getSelectedRows ===
                    "function"
            ) {
                selectedRows = Array.from(
                    licenseContractApiRef.current.getSelectedRows().values()
                ).map(row => row.pk);
            }

            return projectService.regisgerProject({
                created_by: loginUser.id!,
                type_code: repairCode?.common_code[0].code!,
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
                license_contracts: selectedRows,
                // license_contracts: Array.from(
                //     licenseContractApiRef.current.getSelectedRows().values()
                // ).map(row => row.pk),
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
            });
        },
        {
            onSuccess(data) {
                router.push(
                    `${PATH.REPAIR.PROJECT.MAIN}/${data.registerProject.project.id}`
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
        // console.log(getValues("start_date"));
        // console.log(getValues("end_date"));
        // console.log(getValues("license_contracts"));
        // console.log(employeeRows);
        // console.log(getValues("consultant_name"));
        // console.log(getValues("consultant_email"));
        // console.log(getValues("consultant_contact"));
        // console.log(getValues("consultant_phone"));
        // console.log(getValues("inspect_cycle"));
        // console.log(getValues("inspect_method"));
        // console.log(getValues("inspect_option"));
        // console.log(getValues("inspect_note"));
        // console.log(
        //     getValues("repair_rate") === ""
        //         ? undefined
        //         : parseFloat(getValues("repair_rate"))
        // );
        // console.log(
        //     getValues("repair_last_year_rate") === ""
        //         ? undefined
        //         : parseFloat(getValues("repair_last_year_rate"))
        // );
        // console.log(typeof getValues("repair_last_year_rate"));
        // console.log(
        //     Array.from(
        //         licenseContractApiRef.current.getSelectedRows().values()
        //     ).map(row => row.pk)
        // );

        if (employeeRows.length === 0) {
            alert("담당자를 등록해주세요.");
        } else {
            registerLicenseProjectMutate();
        }
    };

    return (
        <BasicTemplate>
            <PageTitle title="유지보수 사업 등록" isVisible={false} />
            <RepairProjectForm
                register={register}
                control={control}
                watch={watch}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
                licenseContractApiRef={licenseContractApiRef}
                employeeRows={employeeRows}
                setEmployeeRows={setEmployeeRows}
                onClickSubmit={handleSubmit(onClickSubmit)}
                isAutoCompleteActivated={isAutoCompleteActivated}
                setIsAutoCompleteActivated={setIsAutoCompleteActivated}
            />
        </BasicTemplate>
    );
};

export default RepairProjectRegister;
