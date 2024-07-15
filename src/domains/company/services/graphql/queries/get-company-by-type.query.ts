import { gql } from "graphql-request";
import { ICompany_Bool_Exp, ICompany_Order_By } from "src/codegen/graphql";

export namespace GetCompanyByTypeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: ICompany_Bool_Exp;
        order_by?: ICompany_Order_By[];
    }

    export interface IResponse {
        company: {
            type: {
                category: string;
                code: number;
                is_used: boolean;
                value: string;
            };
            id: number;
            name: string;
            president: string;
            busi_no: string;
            regist_no: string;
            address: string;
            busi_state: string;
            event: string;
            billing_address: string;
            contact: string;
            fax: string;
            note: string;
            created_at: string;
            updated_at: string;
            deleted_at: string;
        }[];
    }
    export const Document = gql`
        query GetCompanyByTypeQuery(
            $where: company_bool_exp
            $order_by: [company_order_by!]
        ) {
            company(order_by: $order_by, where: $where) {
                type {
                    category
                    code
                    is_used
                    value
                }
                id
                name
                president
                busi_no
                regist_no
                address
                busi_state
                event
                billing_address
                contact
                fax
                note
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
