import { useForm } from "react-hook-form";
import { IRepairReportEditForm } from "./RepairReportEditForm.interface";
import VRepairReportEditForm from "./RepairReportEditForm.view";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useEffect, useState } from "react";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { CodeCategory } from "src/enums/code_category.enum";
import { useMutation, useQuery } from "react-query";
import projectService from "@domains/project/service/project.service";
import employeeService from "@domains/employee/services/employee.service";
import repairReportService from "@domains/repair-report/services/repair-report.service";
import editAttachments from "@utils/editAttachments";
import PATH from "@constants/path";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import fetchFile from "@utils/fetchFile";
import { AttachmentState } from "@enums";
import dayjs from "dayjs";
import codeService from "@common/services/code/code.service";

const RepairReportEditForm: React.FC<IRepairReportEditForm.IProps> = props => {
    const {
        getValues,
        control,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IRepairReportEditForm.IForm>();

    const router = useRouter();
    const id = router.query.id as string;

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

    const { refetch: attachmentRefetch } = useQuery(
        ["getAttachments"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id),
            }),
        {
            enabled: false,
            async onSuccess(data) {
                //  LICENSE DOCUMENT
                let repairReport = data.attachment.filter(
                    item =>
                        item.type.value === AttachmentType.REPAIR_REPORT &&
                        item.deleted_at === null
                );

                const resolvedRepairReport = await Promise.all(
                    repairReport.map(async file => {
                        const fileBlob = await fetchFile(
                            file.id,
                            file.file_name
                        );
                        return {
                            id: file.id,
                            file: new File([fileBlob], file.file_name),
                            tag: AttachmentState.ORIGINAL,
                        };
                    })
                );
                setRepairReports(resolvedRepairReport);
                setValue("original_repair_report", resolvedRepairReport);
            },
        }
    );

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
                setProjects([...projectList]);

                !repairReports && attachmentRefetch();
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

    // [ default - 기본 값 ]
    const {} = useQuery(
        ["getRepairReport"],
        () => repairReportService.getRepairReportOneById({ id: parseInt(id) }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                const { repair_date, inspector, project } =
                    data.repair_report_by_pk;

                setValue("repair_date", dayjs(repair_date));
                setValue("inspector_id", inspector.id);
                setValue("project", { label: project.name, value: project.id });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    const { mutate: updateRepairReportMutation } = useMutation(
        ["updateRepairReport"],
        () =>
            repairReportService.updateRepairReport({
                repair_report_id: parseInt(id),
                repair_project_id: getValues("project.value"),
                repair_date: getValues("repair_date").toDate(),
                inspector_id: getValues("inspector_id"),
                updated_by: loginUser.id!,
            }),
        {
            async onSuccess(data, variables, context) {
                await editAttachments(
                    getValues("original_repair_report"),
                    getValues("repair_reports"),
                    loginUser!.id!,
                    data.updateRepairReport.id,
                    attachmentCode!.common_code[0].code
                );

                router.push(
                    `${PATH.REPAIR.INSPECTION.MAIN}/${data.updateRepairReport.id}`
                );
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    const onClickSubmit = () => {
        updateRepairReportMutation();
    };

    return (
        <VRepairReportEditForm
            {...props}
            inspectors={inspectors}
            projects={projects}
            control={control}
            register={register}
            errors={errors}
            repairReports={repairReports}
            setRepairReports={setRepairReports}
            onClickSubmit={handleSubmit(onClickSubmit)}
        />
    );
};

export default RepairReportEditForm;
