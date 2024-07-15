import moneyFormat from "@hooks/moneyFommat";
import { ISalesStatusMonthlyTable } from "./salesStatusMonthlyTable.interface";
import VSalesStatusMonthlyTable from "./salesStatusMonthlyTable.view";
import { useEffect, useState } from "react";

const SalesStatusMonthlyTable: React.FC<
    ISalesStatusMonthlyTable.IProps
> = props => {
    const { monthlySalesData, monthlyContractData } = props;

    // 연 총 매출금액
    const [totalSalesAmount, setTotalSalesAmount] = useState<string>("");

    // 연 총 수주금액
    const [totalContractAmount, setTotalContractAmount] = useState<string>("");

    // 월 별 수주, 매출 금액
    const [monthlyData, setMonthlyData] = useState<
        { contract: string; sales: string }[]
    >([]);

    useEffect(() => {
        if (monthlySalesData.length !== 0 && monthlyContractData.length !== 0) {
            // 연 총 매출금액 집계
            setTotalSalesAmount(
                moneyFormat(
                    monthlySalesData.reduce(
                        (accumulator, currentValue) =>
                            accumulator + currentValue
                    )
                )
            );

            // 연 총 수주금액 집계
            setTotalContractAmount(
                moneyFormat(
                    monthlyContractData.reduce(
                        (accumulator, currentValue) =>
                            accumulator + currentValue
                    )
                )
            );

            // 각 월
            let monthlyDataTemp: { contract: string; sales: string }[] = [];
            for (let i = 0; i < 12; i++) {
                monthlyDataTemp.push({
                    contract: moneyFormat(monthlyContractData[i]),
                    sales: moneyFormat(monthlySalesData[i]),
                });
            }

            setMonthlyData(monthlyDataTemp);
        }
    }, [monthlySalesData, monthlyContractData]);

    return (
        <VSalesStatusMonthlyTable
            {...props}
            totalSalesAmount={moneyFormat(totalSalesAmount)}
            totalContractAmount={moneyFormat(totalContractAmount)}
            monthlyData={monthlyData}
        />
    );
};

export default SalesStatusMonthlyTable;
