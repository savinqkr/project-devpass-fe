import { gql } from "graphql-request";

export namespace DeleteContractByIdMutation {
    export interface IVariable {
        id: number;
        deleted_by: number;
        [key: string]: any;
    }

    export interface IResponse {
        deleteContract: {
            id: number;
        };
    }

    export const Document = gql`
        mutation deleteContractById($id: Int!, $deleted_by: Int!) {
            deleteContract(id: $id, deleted_by: $deleted_by) {
                id
            }
        }
    `;
}
