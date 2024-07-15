import { css } from "@emotion/react";
import { ISalesStatusGoal } from "./SalesStatusGoal.interface";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { ButtonType, ScreenType } from "@enums";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
} from "chart.js";

import PageSectionTitle from "@common/components/page-section-title";
import BasicMoneyField from "@common/components/basic-moneyfield";
import { Colors } from "@configs/colors";

const VSalesStatusGoal: React.FC<ISalesStatusGoal.IVProps> = props => {
    const {
        control,
        isRegistered,
        onClickSetGoalBtn,

        goalRateData,
    } = props;

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
            <div id="goal-section" className="section">
                <PageSectionTitle title="목표" />
                <div className="space" />
                <Divider sx={{ marginBottom: "10px" }} />
                <div id="goal-field">
                    <BasicMoneyField
                        control={control}
                        registerKey="goal"
                        spaceWidth="1vw"
                        label="목표 합계"
                        width="48%"
                    />
                    <Button
                        color={"black"}
                        onClick={onClickSetGoalBtn}
                        variant={
                            isRegistered
                                ? ButtonType.OUTLINED
                                : ButtonType.CONTAINED
                        }
                        sx={{
                            width: "90px",
                            height: "26px",
                            borderRadius: "50px",
                            fontSize: "12.5px",
                            lineHeight: "0px",
                        }}
                    >
                        {isRegistered ? "수정" : "등록"}
                    </Button>
                </div>
                <Divider />
            </div>
            <div id="achievement-section" className="section">
                <PageSectionTitle title="누적 달성률" />
                <div className="space" />
                <div id="goal-rate-section">
                    {goalRateData.map((item, idx) => {
                        return (
                            <div className="goal-rate-group" key={idx}>
                                <div className="goal-rate-title">{`${
                                    idx + 1
                                }월`}</div>

                                <div className="goal-rate-value">{`${item}%`}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default VSalesStatusGoal;

const rootStyle = (isMedium: boolean) => css`
    #goal-field {
        display: flex;
        align-items: center;
        margin: 10px 20px;

        button {
            margin-left: 20px;
        }
    }

    #goal-rate-section {
        display: flex;
        border: 1px solid ${Colors.lightGray};
        border-radius: 5px;
        padding: 5px;

        .goal-rate-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;

            &:last-child {
                border: none;
            }

            .goal-rate-title {
                width: 100%;
                padding: 10px 0;
                text-align: center;
                font-size: 13px;
                color: ${Colors.charcoalGray};
            }

            .goal-rate-value {
                width: 100%;
                padding: 10px 0;
                text-align: center;
                font-size: 12.5px;
                color: ${Colors.charcoalGray};

                border-top: 1px solid ${Colors.lightGray};
            }
        }
    }

    .section {
        margin-top: 35px;
    }

    .space {
        height: 20px;
    }
`;
