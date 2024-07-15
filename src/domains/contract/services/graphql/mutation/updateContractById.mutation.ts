import { gql } from "graphql-request";

export namespace UpdateContractByIdMutation {
    export interface IVariable {
        id: number;
        type_code: number; // 구분 CODE
        name?: string; // 계약명
        project_id?: number; // 사업 ID
        client_id?: number; // 고객사 ID
        delivery_date?: Date; // 납기일
        contract_period_start?: Date; // 계약기간 (시작)
        contract_period_end?: Date; // 계약기간 (종료)
        contract_date?: Date; // 계약일
        license_document_date?: Date; // 라이선스 증서 일자
        contract_amount?: number; // 계약금액
        supply_amount?: number;
        including_vat?: number; // 부가세 포함
        performance_guarantee_rate?: number; // 계약이행보증요율
        defect_performance_guarantee_rate?: number; // 하자이행보증요율
        defect_warranty_period_start?: Date; // 하자이행보증기간(시작)
        defect_warranty_period_end?: Date; // 하자이행보증기간(종료)
        payment_method?: string; // 대금지급 방법
        sales_representative_id?: number;

        advance_payment_guarantee_rate?: number; // 선급금 보증요율
        advance_payment?: number; // 선급금
        advance_payment_claim_date?: Date; // 선급금 청구일자
        installment_payment?: number; // 중도금
        installment_payment_claim_date?: Date; // 중도금 청구일자
        remaining_balance?: number; // 잔금
        remaining_balance_claim_date?: Date; // 잔금 청구일자
        final_estimate_document_id?: number; // 최종 견적서 ID
        contractor_id?: number; // 계약사 ID
        issuance_method_code?: number; // 발행 방법 CODE
        issuing_site?: string; // 발행 사이트
        inspection_target?: string; // 검수등록 대상
        inspection_site?: string; // 검수 사이트
        monthly_standard_amount?: number; // 매월 기준 금액 CODE
        billing_cycle_code?: number; // 청구 주기 CODE
        billing_amount_once?: number; // 1회 청구 금액
        billing_date?: string; // 계산서 발행일
        payment_timing?: string; // 입금시기
        note?: string; // 비고
        updated_by: number;

        [key: string]: any;
    }
    export interface IResponse {
        updateContract: {
            id: number;
        };
    }

    export const Document = gql`
        mutation updateContract(
            $id: Int!
            $type_code: Int!
            $name: String
            $project_id: Int
            $client_id: Int
            $delivery_date: DateTime
            $contract_period_start: DateTime
            $contract_period_end: DateTime
            $contract_date: DateTime
            $license_document_date: DateTime
            $contract_amount: Float
            $supply_amount: Float
            $including_vat: Float
            $performance_guarantee_rate: Float
            $defect_performance_guarantee_rate: Float
            $defect_warranty_period_start: DateTime
            $defect_warranty_period_end: DateTime
            $payment_method: String
            $sales_representative_id: Int
            $advance_payment_guarantee_rate: Float
            $advance_payment: Float
            $advance_payment_claim_date: DateTime
            $installment_payment: Float
            $installment_payment_claim_date: DateTime
            $remaining_balance: Float
            $remaining_balance_claim_date: DateTime
            $final_estimate_document_id: Int
            $contractor_id: Int
            $issuance_method_code: Int
            $issuing_site: String
            $inspection_target: String
            $inspection_site: String
            $monthly_standard_amount: Float
            $billing_cycle_code: Int
            $billing_amount_once: Float
            $billing_date: String
            $payment_timing: String
            $note: String
            $updated_by: Int!
        ) {
            updateContract(
                args: {
                    contract_id: $id
                    type_code: $type_code
                    name: $name
                    project_id: $project_id
                    client_id: $client_id
                    delivery_date: $delivery_date
                    contract_period_start: $contract_period_start
                    contract_period_end: $contract_period_end
                    contract_date: $contract_date
                    license_document_date: $license_document_date
                    contract_amount: $contract_amount
                    supply_amount: $supply_amount
                    including_vat: $including_vat
                    performance_guarantee_rate: $performance_guarantee_rate
                    defect_performance_guarantee_rate: $defect_performance_guarantee_rate
                    defect_warranty_period_start: $defect_warranty_period_start
                    defect_warranty_period_end: $defect_warranty_period_end
                    payment_method: $payment_method
                    sales_representative_id: $sales_representative_id
                    advance_payment_guarantee_rate: $advance_payment_guarantee_rate
                    advance_payment: $advance_payment
                    advance_payment_claim_date: $advance_payment_claim_date
                    installment_payment: $installment_payment
                    installment_payment_claim_date: $installment_payment_claim_date
                    remaining_balance: $remaining_balance
                    remaining_balance_claim_date: $remaining_balance_claim_date
                    final_estimate_document_id: $final_estimate_document_id
                    #
                    contractor_id: $contractor_id
                    issuance_method_code: $issuance_method_code
                    issuing_site: $issuing_site
                    inspection_target: $inspection_target
                    inspection_site: $inspection_site
                    monthly_standard_amount: $monthly_standard_amount
                    billing_cycle_code: $billing_cycle_code
                    billing_amount_once: $billing_amount_once
                    billing_date: $billing_date
                    payment_timing: $payment_timing
                    note: $note
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
