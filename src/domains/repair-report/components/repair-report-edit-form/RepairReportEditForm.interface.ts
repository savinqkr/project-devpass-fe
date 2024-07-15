import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IRepairReportEditForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        control: Control<IRepairReportEditForm.IForm, any>;
        register: UseFormRegister<IRepairReportEditForm.IForm>;
        errors: FieldErrors<IRepairReportEditForm.IForm>;
        projects: { label: string; value: number | string }[];
        inspectors: { label: string; value: number | string }[];
        repairReports: IAttachmentInput.IAttachment[] | undefined;
        setRepairReports: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
        onClickSubmit: () => void;
    }
    export interface IForm {
        project: { label: string; value: number };
        repair_date: Dayjs;
        inspector_id: number;
        repair_reports: IAttachmentInput.IAttachment[] | undefined;
        original_repair_report: IAttachmentInput.IAttachment[] | undefined;
    }
}
