import { gql } from "graphql-request";

export namespace GetCompanyByPkQuery {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        company_by_pk: {
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
        };
    }
    export const Document = gql`
        query GetCompanyByPkQuery($id: Int!) {
            company_by_pk(id: $id) {
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
