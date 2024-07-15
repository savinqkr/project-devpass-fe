import { ProductType } from "@enums";
import { Dayjs } from "dayjs";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ILicenseContractEditForm {
    export interface IProps {
        type: ProductType;
    }
    export interface IVProps extends IProps {
        control: Control<IForm, any>;
        register: UseFormRegister<IForm>;
        errors: FieldErrors<IForm>;
        clientOptions: { label: string; value: number }[];
        projectOptions: { label: string; value: number }[];
        salesRepresentativeOptions: { label: string; value: number }[];
        issuanceMethodOptions: { label: string; value: number }[];
        billingCycleOptions: { label: string; value: number }[];
        finalEstimateOptions: { label: string; value: number }[];
        onClickUpdate: () => void;
        onClickCancel: () => void;
        hasFinalEstimate: boolean;
    }
    export interface IForm {
        client: { label: string; value: number }; // 고객사
        project: { label: string; value: number }; //사업
        contractor: { label: string; value: number };
        sales_representative: { label: string; value: number };
        name: string; // 계약명
        contract_period_start: Dayjs; // 계약기간 (시작)
        contract_period_end: Dayjs; // 계약기간 (종료)
        contract_date: Dayjs; // 계약일
        contract_amount: string; // 계약금액
        including_vat: string; // 부가세 포함
        performance_guarantee_rate: number; // 계약이행보증요율
        defect_performance_guarantee_rate: number; // 하자이행보증요율
        defect_warranty_period_start: Dayjs; // 하자이행보증기간 (시작)
        defect_warranty_period_end: Dayjs; // 하자이행보증기간 (종료)

        issuance_method: number; // 발행 방법
        issuing_site: string; // 발행 사이트
        inspection_target: string; // 검수등록 대상
        inspection_site: string; // 검수 사이트
        monthly_standard_amount: string; // 매월 기준 금액
        billing_cycle: number; // 청구 주기
        billing_amount_once: string; // 1회 청구 금액
        billing_date: string; // 계산서 발행일
        payment_timing: string; // 입금 시기
        note: string; // 비고
        final_estimate: {
            // 최종 견적서
            label: string;
            value: number;
        };
    }

    export interface IAttachment {
        id: number;
        name: string;
        path: string;
    }
}
