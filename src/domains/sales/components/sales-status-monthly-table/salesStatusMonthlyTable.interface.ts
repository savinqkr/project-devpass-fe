export namespace ISalesStatusMonthlyTable {
    export interface IProps {
        monthlySalesData: number[];
        monthlyContractData: number[];
    }
    export interface IVProps extends IProps {
        totalSalesAmount: string;
        totalContractAmount: string;
        monthlyData: { contract: string; sales: string }[];
    }
}
