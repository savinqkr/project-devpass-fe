export namespace IRepairReportDetailsTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        onClickDelete: () => void;
        onClickEdit: () => void;
        repairReportData: IRepairReport | undefined;
        // 정기점검 보고서
        isAttachmentOpen: boolean;
        handleAttachmentOpen: (license: IAttachment) => void;
        handleAttachmentClose: () => void;
        attachment: IAttachment | undefined;
        attachmentData: Array<IAttachment>;
    }

    export interface IRepairReport {
        project_name: string;
        repair_date: string;
        inspector_name: string;
        deleted_at: Date;
    }

    export interface IAttachment {
        id: number;
        name: string;
        path: string;
    }
}
