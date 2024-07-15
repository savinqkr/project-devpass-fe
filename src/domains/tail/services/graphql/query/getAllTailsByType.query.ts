import { gql } from "graphql-request";
import { ITail_Bool_Exp } from "src/codegen/graphql";

export namespace GetAllTailByTypeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: ITail_Bool_Exp;
    }

    export interface IResponse {
        tail: {
            id: number;
            type: {
                code: number;
                value: string;
            };
            name: string;
            contents: string;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query getAllTailByType($where: tail_bool_exp) {
            tail(
                order_by: [
                    { deleted_at: asc_nulls_first }
                    { updated_at: desc }
                ]
                where: $where
            ) {
                id
                type {
                    value
                    code
                }
                name
                contents
                updated_at
                deleted_at
            }
        }
    `;
}
