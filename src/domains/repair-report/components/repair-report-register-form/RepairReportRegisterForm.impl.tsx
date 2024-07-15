import { IRepairReportRegisterForm } from "./RepairReportRegisterForm.interface";
import VRepairReportRegisterForm from "./RepairReportRegisterForm.view";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PATH from "@constants/path";
import { useMutation, useQuery } from "react-query";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import repairReportService from "@domains/repair-report/services/repair-report.service";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import editAttachments from "@utils/editAttachments";
import employeeService from "@domains/employee/services/employee.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import codeService from "@common/services/code/code.service";

const RepairReportRegisterForm: React.FC<
    IRepairReportRegisterForm.IProps
> = props => {
    const {
        getValues,
        control,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IRepairReportRegisterForm.IForm>();

    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const {} = props;

    // ---------------------------------------------------------------------------------------------
    // ----------------------------- [ R E P A I R  R E P O R T ] ----------------------------------
    const [repairReports, setRepairReports] =
        useState<IAttachmentInput.IAttachment[]>();

    const { data: attachmentCode } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                value: { _eq: AttachmentType.REPAIR_REPORT },
            },
        })
    );

    useEffect(() => {
        setValue("repair_reports", repairReports);
    }, [repairReports]);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    var [inspectors, setInspectors] = useState<
        { label: string; value: number | string }[]
    >([]);
    var [projects, setProjects] = useState<
        { label: string; value: number | string }[]
    >([]);

    // [ Project - 사업 ]
    const {} = useQuery(
        ["getAllProjects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    type: {
                        value: { _eq: "유지보수" },
                    },
                },
            }),
        {
            // enabled: false,
            onSuccess(data) {
                var projectList: { label: string; value: number }[] = [];
                data.project.map(item => {
                    item.deleted_at === null &&
                        projectList.push({ label: item.name, value: item.id });
                });
                setProjects(projectList);
            },
        }
    );

    // [ Inspector - 점검자 ]
    const {} = useQuery(
        ["getAllUser"],
        () =>
            employeeService.getAllUsers({
                where: {
                    permission: { value: { _eq: "user" } },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            onSuccess(data) {
                let users: { label: string; value: number }[] = [];

                data.employee.map(item => {
                    users.push({ label: item.name, value: item.id });
                });

                setInspectors(users);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    const { mutate: registerRepairReportMutation } = useMutation(
        ["registerRepairReport"],
        () =>
            repairReportService.registerRepairReport({
                repair_project_id: getValues("project.value"),
                repair_date: getValues("repair_date").toDate(),
                inspector_id: getValues("inspector_id"),
                updated_by: loginUser.id!,
                created_by: loginUser.id!,
            }),
        {
            async onSuccess(data, variables, context) {
                await editAttachments(
                    getValues("original_repair_report"),
                    getValues("repair_reports"),
                    loginUser!.id!,
                    data.registerRepairReport.id,
                    attachmentCode!.common_code[0].code
                );

                router.push(
                    `${PATH.REPAIR.INSPECTION.MAIN}/${data.registerRepairReport.id}`
                );
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    const onClickSubmit = () => {
        registerRepairReportMutation();
    };

    return (
        <VRepairReportRegisterForm
            inspectors={inspectors}
            projects={projects}
            control={control}
            register={register}
            errors={errors}
            repairReports={repairReports}
            setRepairReports={setRepairReports}
            onClickSubmit={handleSubmit(onClickSubmit)}
            {...props}
        />
    );
};

export default RepairReportRegisterForm;
