import { gql } from "graphql-request";

export namespace GetContractOneByIdQuery {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }

    export interface IResponse {
        contract_by_pk: {
            id: number;
            client: {
                id: number;
                name: string;
            }; // 고객사
            project: {
                id: number;
                name: string;
                is_canceled: boolean;
            }; //사업
            sales_representative: {
                id: number;
                name: string;
            };
            contractor: {
                id: number;
                name: string;
            }; // 계약사
            name: string; // 계약명
            delivery_date: Date;
            contract_period_start: Date; // 계약기간 (시작)
            contract_period_end: Date; // 계약기간 (종료)
            contract_date: Date; // 계약일
            license_document_date: Date;
            contract_amount: number; // 계약금액
            supply_amount: number; // 공급금액
            including_vat: number; // 부가세 포함
            performance_guarantee_rate: number; // 계약이행보증요율
            defect_performance_guarantee_rate: number; // 하자이행보증요율
            defect_warranty_period_start: Date; // 하자이행보증기간 (시작)
            defect_warranty_period_end: Date; // 하자이행보증기간 (종료)
            payment_method: string; // 대금지급 방법

            advance_payment_guarantee_rate: number; // 선급금 보증요율
            advance_payment: number; //선급금
            advance_payment_claim_date: Date; //선급금 납부일
            installment_payment: number; // 중도금
            installment_payment_claim_date: Date; // 중도금 납부일
            remaining_balance: number; // 잔금
            remaining_balance_claim_date: Date; // 잔금 납부일

            issuance_method: {
                code: number;
                value: string;
            }; // 발행 방법 CODE
            issuing_site: string; // 발행 사이트
            inspection_target: string; // 검수등록 대상
            inspection_site: string; // 검수 사이트
            monthly_standard_amount: number; // 매월 기준 금액
            billing_cycle: {
                code: number;
                value: string;
            }; // 청구 주기 CODE
            billing_amount_once: number; // 1회 청구 금액
            billing_date: string; // 계산서 발행일
            payment_timing: string; // 입금시기
            note: string; // 비고
            final_estimate_document_id: number;

            deleted_at: Date;
        };
    }

    export const Document = gql`
        query getOneContractById($id: Int!) {
            contract_by_pk(id: $id) {
                id
                client {
                    id
                    name
                }
                project {
                    id
                    name
                    is_canceled
                }
                sales_representative {
                    id
                    name
                }
                contractor {
                    id
                    name
                }
                name
                delivery_date
                contract_period_start
                contract_period_end
                contract_date
                license_document_date
                contract_amount
                supply_amount
                including_vat
                performance_guarantee_rate
                defect_performance_guarantee_rate
                defect_warranty_period_start
                defect_warranty_period_end
                payment_method

                advance_payment_guarantee_rate
                advance_payment
                advance_payment_claim_date
                installment_payment
                installment_payment_claim_date
                remaining_balance
                remaining_balance_claim_date

                issuance_method {
                    code
                    value
                }
                issuing_site
                inspection_target
                inspection_site
                monthly_standard_amount
                billing_cycle {
                    code
                    value
                }
                billing_amount_once
                billing_date
                payment_timing
                note
                final_estimate_document_id
                deleted_at
            }
        }
    `;
}
