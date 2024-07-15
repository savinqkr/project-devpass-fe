import { gql } from "graphql-request";

export namespace DeleteEmployeeByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        delete_employee_by_pk: {
            id: number;
            name: string;
        };
    }
    export const Document = gql`
        mutation DeleteEmployeeByPkMutation($id: Int!) {
            delete_employee_by_pk: update_employee_by_pk(
                pk_columns: { id: $id }
                _set: { deleted_at: "now()" }
            ) {
                id
                name
            }
        }
    `;
}
