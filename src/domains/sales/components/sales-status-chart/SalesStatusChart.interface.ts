import { ProductType } from "@enums";
import { ChartData, ChartOptions } from "chart.js";
import { SalesFilterType } from "src/enums/sales_filter_type";

export namespace ISalesStatusChart {
    export interface IProps {
        common_type: ProductType;
        salesData: {
            // year: number;
            month: number;
            total: number;
        }[];
        contractData: {
            // year: number;
            month: number;
            total: number;
        }[];
        year: number;
        type: SalesFilterType;
        goal: number | null;
    }
    export interface IVProps extends IProps {
        data: ChartData<"line"> | undefined;
        options: ChartOptions<"line">;
    }
}
