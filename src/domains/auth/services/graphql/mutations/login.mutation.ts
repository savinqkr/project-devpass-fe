import { gql } from "graphql-request";

export namespace LoginMutation {
    export interface IVariable {
        [key: string]: any;
        id: string;
        password: string;
    }

    export interface IResponse {
        login: { accessToken: string; refreshToken: string };
    }
    export const Document = gql`
        mutation LoginMutation($id: String!, $password: String!) {
            login(args: { account_id: $id, account_pw: $password }) {
                accessToken
                refreshToken
            }
        }
    `;
}
