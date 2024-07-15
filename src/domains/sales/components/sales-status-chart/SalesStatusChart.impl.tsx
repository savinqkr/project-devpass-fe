import { useEffect, useState } from "react";
import { ISalesStatusChart } from "./SalesStatusChart.interface";
import VSalesStatusChart from "./SalesStatusChart.view";
import { Colors } from "@configs/colors";
import {
    ChartData,
    ChartOptions,
    Legend,
    Chart,
    Title,
    SubTitle,
} from "chart.js";
import { colors } from "@mui/material";
import Annotation from "chartjs-plugin-annotation";
import moneyFormat from "@hooks/moneyFommat";
import { SalesFilterType } from "src/enums/sales_filter_type";
import { ProductType } from "@enums";

const SalesStatusChart: React.FC<ISalesStatusChart.IProps> = props => {
    const { salesData, contractData, year, type, common_type, goal } = props;

    const labels = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ];
    var [data, setData] = useState<ChartData<"line"> | undefined>();

    Chart.register([Legend, Title, SubTitle, Annotation]);

    const chartOption: ChartOptions<"line"> = {
        maintainAspectRatio: false, // 기본 가로, 세로 비율 유지 유무
        responsive: true, // 반응형 차트 설정
        interaction: {
            includeInvisible: true,
        },
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                align: "start",
            },

            title: {
                display: true,
                text: `${year}년도 수주 및 매출 현황 (${
                    type === "SUBTOTAL" ? "소계" : "누계"
                })`,
                align: "start",
                color: Colors.softGray,
                font: { size: 12, weight: "normal" },
            },
            subtitle: {
                display: true,
                text: `${goal ? moneyFormat(goal) : "-"}원`,
                align: "start",
                color: Colors.charcoalGray,
                font: { size: 25, weight: "bold" },
                padding: { bottom: 20 },
            },
            annotation: {
                annotations: {
                    line1: {
                        type: "line",
                        yMin: goal ?? 0,
                        yMax: goal ?? 0,
                        borderColor: Colors.wildStrawberry,
                        borderWidth:
                            goal && type === SalesFilterType.CUMULATIVE ? 1 : 0,
                        label: {
                            display:
                                goal && type === SalesFilterType.CUMULATIVE
                                    ? true
                                    : false,
                            content: "목표 금액",
                            position: "end",
                            backgroundColor: Colors.white,
                            color: Colors.wildStrawberry,
                        },
                    },
                },
            },
        },
    };

    var salesChartData: number[] = [];
    var contractChartData: number[] = [];

    useEffect(() => {
        for (var i = 1; i <= 12; i++) {
            const salesMatchData = salesData?.find(item => item.month === i);
            const contractMatchData = contractData?.find(
                item => item.month === i
            );

            salesMatchData
                ? salesChartData.push(Math.floor(salesMatchData.total))
                : salesChartData.push(0);

            contractMatchData
                ? contractChartData.push(Math.floor(contractMatchData.total))
                : contractChartData.push(0);
        }

        setData({
            labels,
            datasets: [
                {
                    label:
                        common_type === ProductType.MAINTENANCE
                            ? "매출(예측)"
                            : "매출",
                    data: salesChartData,
                    borderColor: colors.purple[500],
                    borderWidth: 1.5,
                    backgroundColor: colors.purple[500],
                },
                {
                    label: "수주",
                    data: contractChartData,
                    borderColor: colors.indigo[400],
                    borderWidth: 1.5,
                    backgroundColor: colors.indigo[400],
                },
            ],
        });
    }, [year, salesData]);

    return <VSalesStatusChart data={data} options={chartOption} {...props} />;
};

export default SalesStatusChart;
