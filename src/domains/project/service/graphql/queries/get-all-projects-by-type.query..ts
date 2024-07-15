import { gql } from "graphql-request";
import { IProject_Bool_Exp } from "src/codegen/graphql";

export namespace GetAllProjectsByTypeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProject_Bool_Exp;
    }

    export interface IResponse {
        project: {
            id: number;
            name: string;
            type: {
                code: number;
                value: string;
            };
            client: {
                name: string;
            };
            contractor: {
                name: string;
            };
            contracts: {
                id: number;
                deleted_at: Date;
            }[];
            sales: {
                id: number;
                deleted_at: Date;
            }[];
            start_date: string;
            end_date: string;
            consultant_name?: string;
            sequence: number;
            created_at: string;
            created_by: number;
            updated_at: string;
            updated_by?: number;
            deleted_at?: string;
            deleted_by?: number;
        }[];
    }

    export const Document = gql`
        query GetAllProjectsByTypeQuery($where: project_bool_exp) {
            project(
                where: $where
                order_by: { deleted_at: desc_nulls_first, updated_at: desc }
            ) {
                id
                name
                type {
                    code
                    value
                }
                client {
                    name
                }
                contractor {
                    name
                }
                contracts {
                    id
                    deleted_at
                }
                sales {
                    id
                    deleted_at
                }
                start_date
                end_date
                consultant_name
                sequence
                created_at
                created_by
                updated_at
                updated_by
                deleted_at
                deleted_by
            }
        }
    `;
}
