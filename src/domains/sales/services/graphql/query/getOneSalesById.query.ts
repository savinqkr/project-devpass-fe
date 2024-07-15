import { gql } from "graphql-request";

export namespace GetOneSalesByIdQuery {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }

    export interface IResponse {
        sales_by_pk: {
            common_type: {
                code: number;
                value: string;
            };
            client: {
                id: string;
                name: string;
            };
            project: {
                id: number;
                name: string;
                is_canceled: boolean;
                contracts: {
                    contract_amount: string;
                    deleted_at: Date;
                }[];
            };
            audit_date: Date;
            free_maintenance_start_date: Date;
            maintenance_duration: string;
            // license_certificate: IAttachmentInput.IAttachment[];
            // inspection_document: IAttachmentInput.IAttachment[];
            sales_type: {
                code: number;
                value: string;
            };
            sales_representative: {
                id: number;
                name: string;
            };
            partner_type: {
                code: number;
                value: string;
            };
            partner_name: string;
            purchase_type: {
                code: number;
                value: string;
            };
            product_type: string;
            first_sales: number;
            first_sales_claim_date: Date;
            second_sales: number;
            second_sales_claim_date: Date;
            last_sales: number;
            last_sales_claim_date: Date;
            first_purchase: number;
            first_purchase_claim_date: Date;
            second_purchase: number;
            second_purchase_claim_date: Date;
            last_purchase: number;
            last_purchase_claim_date: Date;
            purchase_partner: {
                id: number;
                name: string;
            };
            deleted_at: Date;
        };
    }

    export const Document = gql`
        query getOneSalesById($id: Int!) {
            sales_by_pk(id: $id) {
                common_type {
                    code
                    value
                }
                client {
                    id
                    name
                }
                project {
                    id
                    name
                    is_canceled
                    contracts {
                        contract_amount
                        deleted_at
                    }
                }
                audit_date
                free_maintenance_start_date
                maintenance_duration
                # license_certificate
                # inspection_document
                sales_type {
                    code
                    value
                }
                sales_representative {
                    id
                    name
                }
                partner_type {
                    code
                    value
                }
                partner_name
                purchase_type {
                    code
                    value
                }
                product_type
                first_sales
                first_sales_claim_date
                second_sales
                second_sales_claim_date
                last_sales
                last_sales_claim_date
                first_purchase
                first_purchase_claim_date
                second_purchase
                second_purchase_claim_date
                last_purchase
                last_purchase_claim_date
                purchase_partner {
                    id
                    name
                }
                deleted_at
            }
        }
    `;
}

// client: {
//     label: string;
//     value: number;
// };
// project_id: number;
// audit_date
// free_maintenance_start_date
// maintenance_duration
// license_certificate
// inspection_document
// sales_type
// sales_representative_id
// partner_type_code
// purchase_type_code
// product_type
// first_sales
// first_sales_claim_date
// second_sales
// second_sales_claim_date
// last_sales
// last_sales_claim_date
// first_purchase
// first_purchase_claim_date
// second_purchase
// second_purchase_claim_date
// last_purchase
// last_purchase_claim_date
// purchase_partner_id
