import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export namespace ILicenseContractDetailsTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        contract: IContract | undefined;
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        detailsRows: readonly GridValidRowModel[];
        detailsColumns: GridColDef[];
        // 첨부파일
        isAttachmentOpen: boolean;
        handleAttachmentOpen: (attachment: IAttachment) => void;
        handleAttachmentClose: () => void;
        attachment: IAttachment | undefined;
        attachmentData: Array<IAttachment>;
        // 최종 견적서
        isFinalEstimateOpen: boolean;
        handleFinalEstimateOpen: () => void;
        handleFinalEstimateClose: () => void;
        finalEstimate: number | undefined;
        // 라이선스 증서
        isLicenseDocumentOpen: boolean;
        handleLicenseDocumentOpen: () => void;
        handleLicenseDocumentClose: () => void;
    }
    export interface IContract {
        id: number;
        client: string; // 고객사
        project: string; //사업
        name: string; // 계약명
        delivery_date: string;
        contract_period_start: string; // 계약기간 (시작)
        contract_period_end: string; // 계약기간 (종료)
        contract_date: string; // 계약일
        license_document_date: string;

        is_canceled: boolean;
        contract_amount: string; // 계약금액
        supply_amount: string; // 공급금액
        including_vat: string; // 부가세 포함
        performance_guarantee_rate: number; // 계약이행보증요율
        defect_performance_guarantee_rate: number; // 하자이행보증요율
        defect_warranty_period_start: string; // 하자이행보증기간 (시작)
        defect_warranty_period_end: string; // 하자이행보증기간 (종료)
        payment_method: string; // 대금지급 방법
        sales_representative: string;

        advance_payment_guarantee_rate: number; // 선급금 보증요율
        advance_payment: string; //선급금
        advance_payment_claim_date: string; //선급금 납부일
        installment_payment: string; // 중도금
        installment_payment_claim_date: string; // 중도금 납부일
        remaining_balance: string; // 잔금
        remaining_balance_claim_date: string; // 잔금 납부일

        deleted_at: Date;
    }

    export interface IAttachment {
        id: number;
        name: string;
        path: string;
    }
}
