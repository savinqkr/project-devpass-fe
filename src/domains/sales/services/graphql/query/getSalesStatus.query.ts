import { ProductType } from "@enums";
import { gql } from "graphql-request";
import { SalesFilterType } from "src/enums/sales_filter_type";

export namespace GetSalesStatusQuery {
    export interface IVariable {
        year: number;
        type: SalesFilterType;
        common_type: ProductType;
        [key: string]: any;
    }

    export interface IResponse {
        getMonthlySalesData: {
            carry_over_amount: string;
            monthly_data: {
                year: number;
                month: number;
                total_amount: string;
                goal_rate: number;
            }[];
        };
    }

    export const Document = gql`
        query getMonthlySalesData(
            $year: Int!
            $type: SalesFilterType!
            $common_type: String!
        ) {
            getMonthlySalesData(
                year: $year
                type: $type
                common_type: $common_type
            ) {
                carry_over_amount
                monthly_data {
                    year
                    month
                    total_amount
                    goal_rate
                }
            }
        }
    `;
}
