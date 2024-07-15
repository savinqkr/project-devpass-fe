import { gql } from "graphql-request";

export namespace DeleteSalesByIdMutation {
    export interface IVariable {
        id: number;
        deleted_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        deleteSales: { id: number };
    }

    export const Document = gql`
        mutation deleteSales($id: Int!, $deleted_by: Int!) {
            deleteSales(id: $id, deleted_by: $deleted_by) {
                id
            }
        }
    `;
}
