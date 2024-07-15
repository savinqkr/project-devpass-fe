import { ProductType } from "@enums";
import { gql } from "graphql-request";
import { SalesFilterType } from "src/enums/sales_filter_type";

export namespace GetMonthlyContractAmount {
    export interface IVariable {
        year: number;
        type: SalesFilterType;
        common_type: ProductType;
        [key: string]: any;
    }

    export interface IResponse {
        getMonthlyContractData: {
            year: number;
            month: number;
            total_amount: string;
        }[];
    }

    export const Document = gql`
        query getMonthlyContractData(
            $year: Int!
            $type: SalesFilterType!
            $common_type: String!
        ) {
            getMonthlyContractData(
                year: $year
                type: $type
                common_type: $common_type
            ) {
                year
                month
                total_amount
            }
        }
    `;
}
