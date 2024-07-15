import { css } from "@emotion/react";
import { ISalesStatusChart } from "./SalesStatusChart.interface";
import { CircularProgress, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

const VSalesStatusChart: React.FC<ISalesStatusChart.IVProps> = props => {
    const { data, options } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip
    );

    return (
        <div css={rootStyle(isMedium)}>
            {data ? (
                <div id="chart-section">
                    <Line data={data} options={options} />
                </div>
            ) : (
                <div id="loading">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
};

export default VSalesStatusChart;

const rootStyle = (isMedium: boolean) => css`
    #chart-section {
        margin: 0 20px;
        height: 35vh;
    }
`;
