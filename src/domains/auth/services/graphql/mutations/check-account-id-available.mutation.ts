import { gql } from "graphql-request";

export namespace CheckAccountIdAvailableMutation {
    export interface IVariable {
        [key: string]: any;
        account_id: string;
    }

    export interface IResponse {
        isAccountIdAvailable: boolean;
    }
    export const Document = gql`
        mutation CheckAccountIdAvailableMutation($account_id: String!) {
            isAccountIdAvailable(account_id: $account_id)
        }
    `;
}
