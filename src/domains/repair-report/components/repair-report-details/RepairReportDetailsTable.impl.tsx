import { useMutation, useQuery } from "react-query";
import repairReportService from "@domains/repair-report/services/repair-report.service";
import { useRouter } from "next/router";
import { useState } from "react";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { useRecoilValue } from "recoil";
import userState from "@recoils/login-state.atom";
import PATH from "@constants/path";
import { IRepairReportDetailsTable } from "./RepairReportDetailsTable.interface";
import VRepairReportDetailsTable from "./RepairReportDetailsTable.view";
import dayjs from "dayjs";

const RepairReportDetailsTable: React.FC<
    IRepairReportDetailsTable.IProps
> = props => {
    const {} = props;

    const router = useRouter();
    const id = router.query.id as string;

    const loginUser = useRecoilValue(userState);

    const [repairReportData, setRepairReportData] =
        useState<IRepairReportDetailsTable.IRepairReport>();

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ Q U E R Y ] -------------------------------------------
    const {} = useQuery(
        ["getOneRepairReport"],
        () =>
            repairReportService.getRepairReportOneById({
                id: parseInt(id),
            }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                // console.log(data);
                const { project, inspector, repair_date, deleted_at } =
                    data.repair_report_by_pk;

                setRepairReportData({
                    project_name: project?.name,
                    inspector_name: inspector?.name,
                    repair_date: dayjs(repair_date).format("YYYY년 MM월 DD일"),
                    deleted_at,
                });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- [ M U T A T I O N ] ----------------------------------------
    const { mutate: deleteRepairReportMutation } = useMutation(
        ["deleteRepairReportById"],
        () =>
            repairReportService.deleteRepairReportOneById({
                id: parseInt(id),
                deleted_by_id: loginUser.id!,
            }),
        {
            onSuccess(data, variables, context) {
                router.push(`${PATH.REPAIR.INSPECTION.MAIN}`);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ A T T A C H M E N T ] --------------------------------------
    const [attachment, setAttachment] =
        useState<IRepairReportDetailsTable.IAttachment>();

    const [isAttachmentOpen, setIsAttachmentOpen] = useState<boolean>(false);

    const [attachments, setAttachments] = useState<
        Array<IRepairReportDetailsTable.IAttachment>
    >([]);

    const handleAttachmentOpen = (
        attachment: IRepairReportDetailsTable.IAttachment
    ) => {
        setAttachment(attachment);
        setIsAttachmentOpen(true);
    };

    const handleAttachmentClose = () => {
        setIsAttachmentOpen(false);
        setAttachment(undefined);
    };

    const {} = useQuery(
        ["getAttachmentData"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id),
            }),
        {
            enabled: !!id,
            onSuccess(data) {
                let attachmentTemp: Array<IRepairReportDetailsTable.IAttachment> =
                    [];

                data.attachment.forEach(file => {
                    if (file.type.value === AttachmentType.REPAIR_REPORT) {
                        attachmentTemp.push({
                            id: file.id,
                            name: file.file_name,
                            path: file.file_path,
                        });
                        setAttachments(attachmentTemp);
                    }
                });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ S E T T I N G ] -----------------------------------------
    const onClickDelete = () => {
        if (window.confirm("정기점검을 삭제하시겠습니까?")) {
            deleteRepairReportMutation();
        }
    };

    const onClickEdit = () => {
        router.push(`${PATH.REPAIR.INSPECTION.EDIT}/${id}`);
    };

    return (
        <VRepairReportDetailsTable
            {...props}
            repairReportData={repairReportData}
            onClickDelete={onClickDelete}
            onClickEdit={onClickEdit}
            attachment={attachment}
            isAttachmentOpen={isAttachmentOpen}
            handleAttachmentClose={handleAttachmentClose}
            handleAttachmentOpen={handleAttachmentOpen}
            attachmentData={attachments}
        />
    );
};

export default RepairReportDetailsTable;
