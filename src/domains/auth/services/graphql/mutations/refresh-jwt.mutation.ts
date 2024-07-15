import { gql } from "graphql-request";

export namespace RefreshJwtMutation {
    export interface IVariable {
        [key: string]: any;
        refreshToken: string;
    }

    export interface IResponse {
        refreshJwt: { accessToken: string; refreshToken: string };
    }
    export const Document = gql`
        mutation RefreshJwtMutation($refreshToken: String!) {
            refreshJwt(args: $refreshToken) {
                accessToken
                refreshToken
            }
        }
    `;
}
