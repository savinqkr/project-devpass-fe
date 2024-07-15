import { gql } from "graphql-request";
import { IEstimateDetailInput } from "src/codegen/graphql";

export namespace EditEstimateMutation {
    export interface IVariable {
        [key: string]: any;
        estimate_id: number; // 견적 ID
        updated_by: number; // 수정한 유저 ID
        type_code: number; // 견적 구분
        project_id: number; // 사업 ID
        destination: string; // 수신처
        employee_name: string; // 담당자명
        employee_email?: string; // 담당자 이메일
        employee_contact?: string; // 담당자 연락처
        employee_phone?: string; // 담당자 핸드폰번호
        head_employee_name: string; // 본사 견적 담당자명
        head_employee_email?: string; // 본사 견적 담당자 이메일
        head_employee_contact?: string; // 본사 견적 담당자 연락처
        doc_num: string; // 문서번호
        case_name: string; // 건명
        estimate_date: Date; // 견적일
        validity: Date; // 유효기간
        estimate_price: number; // 견적금액
        vat_include?: boolean; // 부가세포함 활성 여부
        discount_rate?: number; // 할인율
        total_price: number; // 공급금액 합계 ( 부가세 포함 X )
        add_special_discount: boolean; // 특별 할인 금액 적용 여부
        special_discount_price?: number; // 특별 할인 금액
        total_price_vat: number; // 공급금액 합계 ( 부가세 포함 O )
        tail?: string; // TAIL
        is_final?: boolean; // 최종 견적 여부
        // details: {
        //     type: string;
        //     purpose: string;
        //     class: string;
        //     product_type: string;
        //     product: string;
        //     details?: string;
        //     unit: string;
        //     amount: number;
        //     price: number;
        //     standard_price?: number;
        //     supply_price: number;
        //     monthly_repair_price?: number;
        //     total_repair_price?: number;
        //     note?: string;
        // }[];
        details: IEstimateDetailInput[];
        license_contracts?: number[];
    }

    export interface IResponse {
        editEstimate: {
            estimate: {
                id: number;
                project: {
                    id: number;
                    name: string;
                    client: {
                        id: number;
                        name: string;
                    };
                };
                employee_name: string;
                employee_email: string;
                employee_contact: string;
                employee_phone: string;
                head_employee_name: string;
                head_employee_email: string;
                head_employee_contact: string;
                destination: string;
                doc_num: string;
                case_name: string;
                estimate_date: string;
                validity: string;
                estimate_price: string;
                details: {
                    type: string;
                    purpose: string;
                    class: string;
                    product_type: string;
                    product: string;
                    unit: string;
                    amount: number;
                    price: string;
                    details: string;
                    standard_price?: number;
                    supply_price: number;
                    monthly_repair_price?: number;
                    total_repair_price?: number;
                    note: string;
                };
                vat_include: boolean;
                total_price: string;
                add_special_discount: boolean;
                special_discount_price: string;
                total_price_vat: string;
                tail: string;
                is_final: boolean;
                sequence: number;
                created_at: string;
                created_by: string;
                updated_at: string;
                updated_by: string;
                deleted_at: string;
                deleted_by: string;
            };
        };
    }

    export const Document = gql`
        mutation EditEstimateMutation(
            $estimate_id: Int!
            $updated_by: Int!
            $type_code: Int!
            $project_id: Int!
            $destination: String!
            $employee_name: String!
            $employee_email: String
            $employee_contact: String
            $employee_phone: String
            $head_employee_name: String!
            $head_employee_email: String
            $head_employee_contact: String
            $doc_num: String!
            $case_name: String!
            $estimate_date: DateTime!
            $validity: DateTime!
            $estimate_price: Float!
            $vat_include: Boolean
            $discount_rate: Float
            $total_price: Float!
            $add_special_discount: Boolean
            $special_discount_price: Float
            $total_price_vat: Float!
            $tail: String
            $is_final: Boolean
            $details: [EstimateDetailInput!]
            $license_contracts: [Int!]
        ) {
            editEstimate(
                args: {
                    estimate_id: $estimate_id
                    updated_by: $updated_by
                    type_code: $type_code
                    project_id: $project_id
                    destination: $destination
                    employee_name: $employee_name
                    employee_email: $employee_email
                    employee_contact: $employee_contact
                    employee_phone: $employee_phone
                    head_employee_name: $head_employee_name
                    head_employee_email: $head_employee_email
                    head_employee_contact: $head_employee_contact
                    doc_num: $doc_num
                    case_name: $case_name
                    estimate_date: $estimate_date
                    validity: $validity
                    estimate_price: $estimate_price
                    vat_include: $vat_include
                    discount_rate: $discount_rate
                    total_price: $total_price
                    add_special_discount: $add_special_discount
                    special_discount_price: $special_discount_price
                    total_price_vat: $total_price_vat
                    tail: $tail
                    is_final: $is_final
                    details: $details
                    license_contracts: $license_contracts
                }
            ) {
                estimate {
                    id
                    project {
                        id
                        name
                        client {
                            id
                            name
                        }
                    }
                    employee_name
                    employee_email
                    employee_contact
                    employee_phone
                    head_employee_name
                    head_employee_email
                    head_employee_contact
                    destination
                    doc_num
                    case_name
                    estimate_date
                    validity
                    estimate_price
                    vat_include
                    total_price
                    add_special_discount
                    special_discount_price
                    total_price_vat
                    tail
                    sequence
                    created_at
                    created_by
                    updated_at
                    updated_by
                    deleted_at
                    deleted_by
                }
            }
        }
    `;
}
