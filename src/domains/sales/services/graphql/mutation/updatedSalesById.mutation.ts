import { gql } from "graphql-request";

export namespace UpdatedSalesByIdMutation {
    export interface IVariable {
        id: number;
        common_type_code: number;
        client_id: number;
        project_id: number;

        audit_date: Date;
        free_maintenance_start_date: Date;
        maintenance_duration: string;

        sales_type: number;
        sales_representative_id: number;
        partner_type_code: number;
        partner_name: string;
        purchase_type_code: number;
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
        purchase_partner_id: number | null;

        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        updateSales: {
            id: number;
        };
    }

    export const Document = gql`
        mutation updateSales(
            $id: Int!
            $common_type_code: Int!
            $client_id: Int!
            $project_id: Int!
            $audit_date: DateTime
            $free_maintenance_start_date: DateTime
            $maintenance_duration: String
            #
            $sales_type: Int!
            $sales_representative_id: Int!
            $partner_type_code: Int!
            $partner_name: String
            $purchase_type_code: Int!
            $product_type: String!
            #
            $first_sales: Float
            $first_sales_claim_date: DateTime
            $second_sales: Float
            $second_sales_claim_date: DateTime
            $last_sales: Float
            $last_sales_claim_date: DateTime
            #
            $first_purchase: Float
            $first_purchase_claim_date: DateTime
            $second_purchase: Float
            $second_purchase_claim_date: DateTime
            $last_purchase: Float
            $last_purchase_claim_date: DateTime
            $purchase_partner_id: Int
            #
            $updated_by: Int!
        ) {
            updateSales(
                args: {
                    sales_id: $id
                    type_code: $common_type_code
                    client_id: $client_id
                    project_id: $project_id
                    #
                    audit_date: $audit_date
                    free_maintenance_start_date: $free_maintenance_start_date
                    maintenance_duration: $maintenance_duration
                    # license_certificate: $license_certificate
                    # inspection_document: $inspection_document
                    #
                    sales_type_code: $sales_type
                    sales_representative_id: $sales_representative_id
                    partner_type_code: $partner_type_code
                    partner_name: $partner_name
                    purchase_type_code: $purchase_type_code
                    product_type: $product_type
                    #
                    first_sales: $first_sales
                    first_sales_claim_date: $first_sales_claim_date
                    second_sales: $second_sales
                    second_sales_claim_date: $second_sales_claim_date
                    last_sales: $last_sales
                    last_sales_claim_date: $last_sales_claim_date
                    #
                    first_purchase: $first_purchase
                    first_purchase_claim_date: $first_purchase_claim_date
                    second_purchase: $second_purchase
                    second_purchase_claim_date: $second_purchase_claim_date
                    last_purchase: $last_purchase
                    last_purchase_claim_date: $last_purchase_claim_date
                    purchase_partner: $purchase_partner_id
                    #
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}

// common_type_code
// client_id
// project_id

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
// last_sale_claim_date

// first_purchase
// first_purchase_claim_date
// second_purchase
// second_purchase_claim_date
// last_purchase
// last_purchase_claim_date
// purchase_partner_id
