import { gql } from "graphql-request";

export namespace EditCompanyByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
        typeCode?: number;
        name?: string;
        president?: string;
        busi_no?: string;
        regist_no?: string;
        address?: string;
        busi_state?: string;
        event?: string;
        billing_address?: string;
        contact?: string;
        fax?: string;
        note?: string;
    }

    export interface IResponse {
        update_company_by_pk: {
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
        };
    }
    export const Document = gql`
        mutation EditCompanyByPkMutation(
            $id: Int!
            $typeCode: Int
            $name: String
            $president: String
            $busi_no: String
            $regist_no: String
            $address: String
            $busi_state: String
            $event: String
            $billing_address: String
            $contact: String
            $fax: String
            $note: String
        ) {
            update_company_by_pk(
                pk_columns: { id: $id }
                _set: {
                    type_code: $typeCode
                    name: $name
                    president: $president
                    busi_no: $busi_no
                    regist_no: $regist_no
                    address: $address
                    busi_state: $busi_state
                    event: $event
                    billing_address: $billing_address
                    contact: $contact
                    fax: $fax
                    note: $note
                    updated_at: "now()"
                }
            ) {
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
                note
                created_at
                updated_at
            }
        }
    `;
}
