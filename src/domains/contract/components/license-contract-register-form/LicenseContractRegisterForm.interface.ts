import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ILicenseContractRegisterForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        control: Control<IForm, any>;
        register: UseFormRegister<IForm>;
        errors: FieldErrors<IForm>;
        clientOptions: { label: string; value: number }[];
        projectOptions: { label: string; value: number }[];
        salesEmployeeOptions: { label: string; value: number }[];
        finalEstimateOptions: { label: string; value: number }[];
        onClickSubmit: () => void;
        attachments: IAttachmentInput.IAttachment[] | undefined;
        setAttachments: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
        hasFinalEstimate: boolean;
        total_amount: string;
        remaining_amount: string;
    }
    export interface IForm {
        client: {
            label: string;
            value: number;
        }; // 고객사
        project: {
            label: string;
            value: number;
        }; //사업
        name: string; // 계약명
        delivery_date: Dayjs;
        contract_period_start: Dayjs; // 계약기간 (시작)
        contract_period_end: Dayjs; // 계약기간 (종료)
        contract_date: Dayjs; // 계약일
        license_document_date: Dayjs;
        contract_amount: string; // 계약금액
        supply_amount: string; // 공급금액
        including_vat: string; // 부가세 포함
        performance_guarantee_rate: number; // 계약이행보증요율
        defect_performance_guarantee_rate: number; // 하자이행보증요율
        defect_warranty_period_start: Dayjs; // 하자이행보증기간 (시작)
        defect_warranty_period_end: Dayjs; // 하자이행보증기간 (종료)
        payment_method: string; // 대금지급 방법
        sales_representative: {
            label: string;
            value: number;
        };

        advance_payment_guarantee_rate: number; // 선급금 보증요율
        advance_payment: string; //선급금
        advance_payment_claim_date: Dayjs; //선급금 납부일
        installment_payment: string; // 중도금
        installment_payment_claim_date: Dayjs; // 중도금 납부일
        remaining_balance: string; // 잔금
        remaining_balance_claim_date: Dayjs; // 잔금 납부일

        final_estimate: {
            label: string;
            value: number;
        }; // 최종 견적서
        attachments: IAttachmentInput.IAttachment[] | undefined; // 검수서류
        original_attachments: IAttachmentInput.IAttachment[] | undefined; // 검수서류
    }
}
