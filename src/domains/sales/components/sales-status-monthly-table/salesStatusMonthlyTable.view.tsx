import { css } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import { ISalesStatusMonthlyTable } from "./salesStatusMonthlyTable.interface";
import { Colors } from "@configs/colors";

const VSalesStatusMonthlyTable: React.FC<
    ISalesStatusMonthlyTable.IVProps
> = props => {
    const { totalSalesAmount, totalContractAmount, monthlyData } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return totalContractAmount && totalSalesAmount && monthlyData ? (
        <div css={rootStyle(isMedium)}>
            <div></div>
            <div id="monthly-data-table">
                <div className="monthly-data-group">
                    <div className="monthly-data-title">{"구분"}</div>
                    <div className="monthly-item">{"수주"}</div>
                    <div className="monthly-item">{"매출"}</div>
                </div>
                <div className="monthly-data-group">
                    <div className="monthly-data-title">{"합계"}</div>
                    <div className="monthly-item">{totalContractAmount}</div>
                    <div className="monthly-item">{totalSalesAmount}</div>
                </div>
                {monthlyData.map((item, idx) => {
                    return (
                        <div className="monthly-data-group">
                            <div className="monthly-data-title">{`${
                                idx + 1
                            } 월`}</div>
                            <div className="monthly-item">{item.contract}</div>
                            <div className="monthly-item">{item.sales}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    ) : (
        <div></div>
    );
};

export default VSalesStatusMonthlyTable;

const rootStyle = (isMedium: boolean) => css`
    #monthly-data-table {
        display: flex;
        border: 1px solid ${Colors.lightGray};
        border-radius: 5px;
        margin-top: 15px;
        padding: 5px;

        .monthly-data-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;

            &:last-child {
                border: none;
            }

            .monthly-data-title {
                width: 100%;
                padding: 10px 0;
                text-align: center;
                font-size: 13px;
                color: ${Colors.charcoalGray};
            }

            .monthly-item {
                width: 100%;
                padding: 10px 0;
                text-align: center;
                font-size: 12px;
                color: ${Colors.charcoalGray};

                border-top: 1px solid ${Colors.lightGray};
            }
        }
    }
`;
