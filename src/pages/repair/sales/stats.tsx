import {
    BasicSelector,
    BasicTemplate,
    DetailInfoRow,
    PageTitle,
} from "@common/components";
import BasicIconButton from "@common/components/basic-icon-button";
import PageSectionTitle from "@common/components/page-section-title";
import codeService from "@common/services/code/code.service";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import contractService from "@domains/contract/services/graphql/contract.service";
import SalesStatusChart from "@domains/sales/components/sales-status-chart";
import SalesStatusGoal from "@domains/sales/components/sales-status-goal";
import SalesStatusMonthlyTable from "@domains/sales/components/sales-status-monthly-table/salesStatusMonthlyTable.impl";
import { getMonthsInPeriod } from "@domains/sales/hooks";
import salesService from "@domains/sales/services/sales.service";
import { css } from "@emotion/react";
import { ButtonType, ProductType } from "@enums";
import moneyFormat from "@hooks/moneyFommat";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import { Divider } from "@mui/material";
import calculateFullMonthDifference from "@utils/calculateFullMonthDifference";
import moneyToNumber from "@utils/moneyToNumber";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { useQuery } from "react-query";
import { CodeCategory } from "src/enums/code_category.enum";
import { SalesFilterType } from "src/enums/sales_filter_type";

const RepairSalesStats: NextPage = () => {
    // 현재 년도
    const nowYear = new Date().getFullYear();

    const { data: commonType, isSuccess: isReadyCommonType } = useQuery(
        ["getCommonCode"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: ProductType.MAINTENANCE },
                },
            })
    );

    const { getValues, setValue, control } = useForm<{
        year: number;
        type: SalesFilterType;
    }>({ defaultValues: { year: nowYear, type: SalesFilterType.SUBTOTAL } });

    // 각 월 매출 데이터
    // 호출 시점 : 첫 렌더링 시 (nowYear) | searchBtn 클릭 시
    const [salesData, setSalesData] = useState<
        { month: number; total: number }[]
    >([]);

    const [salesSubtotal, setSalesSubtotal] = useState<
        { month: number; total: number }[]
    >([]);

    const [salesTotal, setSalesTotal] = useState<
        { month: number; total: number }[]
    >([]);

    const [carryover, setCarryover] = useState<number>(0);

    const [goalRate, setGoalRate] = useState<number[]>([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    // 년도 options
    const [yearOptions, setYearOptions] = useState<Set<number>>(new Set());

    // 차트 타입 Options
    const typeOptions: { label: string; value: SalesFilterType }[] = [
        { label: "소계", value: SalesFilterType.SUBTOTAL },
        { label: "누계", value: SalesFilterType.CUMULATIVE },
    ];

    // 초기 설정
    useEffect(() => {
        let initData: { month: number; total: number }[] = [];
        for (let i = 1; i <= 12; i++) {
            initData.push({
                month: i,
                total: 0,
            });
        }

        setSalesSubtotal(initData);
        setContractData(initData);

        // uniqueYearsRefetch();
    }, []);

    const onClickSearchBtn = () => {
        contractRefetch();
    };

    // ----------------------------- M O N T H L Y  C O N T R A C T --------------------------------
    const [contractData, setContractData] = useState<
        { month: number; total: number }[]
    >([]);

    const [contractSubtotal, setContractSubtotal] = useState<
        { month: number; total: number }[]
    >([]);
    const [contractTotal, setContractTotal] = useState<
        { month: number; total: number }[]
    >([]);

    const {
        refetch: contractRefetch,
        isSuccess: contractSuccess,
        isRefetching: isContractRefetching,
    } = useQuery(
        ["getMonthlyContract"],
        () =>
            contractService.getAllContract({
                where: {
                    type: { value: { _in: [ProductType.MAINTENANCE] } },
                    // project: {
                    //     is_canceled: { _eq: false },
                    // },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: isReadyCommonType,
            onSuccess(data) {
                // ----- [ 계약 데이터 ] -----
                let cSubtotal: { month: number; total: number }[] = [];
                let cTotal: { month: number; total: number }[] = [];
                for (let i = 1; i <= 12; i++) {
                    cSubtotal.push({
                        month: i,
                        total: 0,
                    });
                    cTotal.push({
                        month: i,
                        total: 0,
                    });
                }

                // ----- [ 매출 데이터 ] -----
                let sSubtotal: { month: number; total: number }[] = [];
                let sTotal: { month: number; total: number }[] = [];

                for (let i = 1; i <= 12; i++) {
                    sSubtotal.push({
                        month: i,
                        total: 0,
                    });
                    sTotal.push({
                        month: i,
                        total: 0,
                    });
                }

                data.forEach(item => {
                    const isCanceled = item?.project.is_canceled;

                    const endYear = dayjs(item?.contract_period_end).year();
                    const year = dayjs(item?.contract_period_start).year();
                    const month = dayjs(item?.contract_period_start).month();

                    // unique year 추출
                    item?.contract_date &&
                        setYearOptions(
                            yearOptions.add(
                                dayjs(item?.contract_date).get("year")
                            )
                        ); // 계약일

                    // 예측 데이터가 해당 년도를 넘기는 경우, 년도 Selector Options에 추가
                    for (let i = year; i <= endYear; i++) {
                        //  계약 기간에 해당하는 년도 추출
                        setYearOptions(yearOptions.add(i));
                    }

                    if (getValues("year") === year) {
                        // 계약
                        cSubtotal[month].total =
                            cSubtotal[month].total +
                            moneyToNumber(item!.contract_amount);
                    }

                    // 유효한 매출 발생 월 추출
                    // 사업이 해지된 경우 => 해지된 날짜 이전에 발생한 매출만 집계에 포함됨
                    const salesMonths = getMonthsInPeriod(
                        item!.contract_period_start,
                        isCanceled
                            ? item!.project.canceled_at
                            : item!.contract_period_end
                    );

                    // 조회 년도에 포함되는 매출만 추출
                    const thisYearData = salesMonths.filter(item => {
                        return item.year === getValues("year");
                    });

                    // 조회 년도 이후의 매출 이월 데이터에 포함
                    const overYearData = salesMonths.filter(item => {
                        return item.year > getValues("year");
                    });

                    // 매출
                    const durationMonth = calculateFullMonthDifference(
                        item!.contract_period_start,
                        item!.contract_period_end
                    );

                    // 월 평균 매출 예측 금액
                    const monthlyAmount =
                        moneyToNumber(item!.contract_amount) / durationMonth;

                    // 매출 예측 시작월 + 이번 년도 매출 발생 월 ( length )
                    for (
                        let i = thisYearData[0]?.month - 1;
                        i < thisYearData[0]?.month - 1 + thisYearData.length;
                        i++
                    ) {
                        sSubtotal[i].total += monthlyAmount;
                    }

                    setCarryover(
                        Math.floor(monthlyAmount * overYearData.length)
                    );
                });

                // console.log(sSubtotal);

                setContractSubtotal(cSubtotal);
                setSalesSubtotal(sSubtotal);

                // 누계 데이터
                cSubtotal.forEach((item, idx) => {
                    if (idx === 0) {
                        cTotal[idx].total = item.total;
                    } else {
                        cTotal[idx].total = cTotal[idx - 1].total + item.total;
                    }
                });

                sSubtotal.forEach((item, idx) => {
                    if (idx === 0) {
                        sTotal[idx].total = item.total;
                    } else {
                        sTotal[idx].total = sTotal[idx - 1].total + item.total;
                    }
                });

                setContractTotal(cTotal);
                setSalesTotal(sTotal);

                // setCarryover(sOver);
            },
        }
    );

    // 사용자가 선택한 필터 값에 따라서 차트 데이터 설정
    useEffect(() => {
        if (!isContractRefetching) {
            if (getValues("type") === SalesFilterType.SUBTOTAL) {
                setSalesData(salesSubtotal);
                setContractData(contractSubtotal);
            } else if (getValues("type") === SalesFilterType.CUMULATIVE) {
                setSalesData(salesTotal);
                setContractData(contractTotal);
            }
        }
        goalRefetch();
    }, [isContractRefetching]);

    // 첫 렌더링 시 현재 년도로 차트 데이터 설정
    useEffect(() => {
        if (contractSuccess) {
            if (getValues("type") === SalesFilterType.SUBTOTAL) {
                setSalesData(salesSubtotal);
                setContractData(contractSubtotal);
            } else if (getValues("type") === SalesFilterType.CUMULATIVE) {
                setSalesData(salesTotal);
                setContractData(contractTotal);
            }
        }
    }, [contractSuccess]);

    // ----------------------------------------- G O A L -------------------------------------------
    const [goal, setGoal] = useState<number | null>(null);
    const { refetch: goalRefetch } = useQuery(
        ["getGoal"],
        () =>
            salesService.getGoalByYear({
                year: getValues("year"),
                type_code: commonType!.common_code[0].code,
            }),
        {
            enabled: isReadyCommonType,
            onSuccess(data) {
                let goalRateData: number[] = [];
                salesTotal.forEach(item => {
                    if (data.sales_status_by_pk?.goal !== undefined) {
                        goalRateData.push(
                            Math.floor(
                                (item.total /
                                    moneyToNumber(
                                        `${data.sales_status_by_pk!.goal}`
                                    )) *
                                    100
                            )
                        );
                    } else {
                        goalRateData.push(0);
                    }
                });

                data.sales_status_by_pk?.goal
                    ? setGoal(removeCommaOfMoney(data.sales_status_by_pk?.goal))
                    : setGoal(null);
                setGoalRate(goalRateData);
            },
        }
    );

    return (
        <div css={rootStyle}>
            <BasicTemplate>
                <PageTitle
                    title="유지보수 매출 현황"
                    isVisible
                    path={`${PATH.REPAIR.SALES.MAIN}`}
                />
                <div id="page-info-section">
                    <div id="page-path">
                        {"유지보수 > 유지보수 검수 & 매출 >"} <p>매출 현황</p>
                    </div>
                </div>
                <div id="contents-section">
                    <div id="sales-status-chart-section" className="section">
                        <PageSectionTitle title="수주 및 매출 현황" />
                        <div className="space" />
                        <div id="chart-filter-group">
                            <div id="filter-section">
                                <BasicSelector
                                    control={control}
                                    registerKey="year"
                                    options={Array.from(yearOptions).map(
                                        item => {
                                            return {
                                                label: `${item}`,
                                                value: item,
                                            };
                                        }
                                    )}
                                    spaceWidth="1vw"
                                    placeholder="년도"
                                    height="32px"
                                    width="180px"
                                    borderRadius="100px"
                                />
                                <BasicSelector
                                    control={control}
                                    registerKey="type"
                                    options={typeOptions}
                                    spaceWidth="1vw"
                                    placeholder="소계 / 누계"
                                    height="32px"
                                    width="180px"
                                    borderRadius="100px"
                                />
                                <BasicIconButton
                                    width="50px"
                                    height="32px"
                                    color={"charcoalGray"}
                                    type={ButtonType.CONTAINED}
                                    borderRadius="100px"
                                    icon={<IoIosSearch size={"23px"} />}
                                    onClick={onClickSearchBtn}
                                />
                            </div>
                        </div>
                        <SalesStatusChart
                            common_type={ProductType.MAINTENANCE}
                            salesData={salesData}
                            contractData={contractData}
                            year={getValues("year")}
                            type={getValues("type")}
                            goal={goal}
                        />
                        <SalesStatusMonthlyTable
                            monthlySalesData={salesSubtotal.map(
                                item => item.total
                            )}
                            monthlyContractData={contractSubtotal.map(
                                item => item.total
                            )}
                        />
                    </div>
                </div>

                <SalesStatusGoal
                    year={getValues("year")}
                    type={ProductType.MAINTENANCE}
                    goalRateData={goalRate}
                    onChangeGoal={() => {
                        contractRefetch();
                    }}
                />
                <div id="carryover-section" className="section">
                    <PageSectionTitle title="이월" />
                    <div className="space"></div>
                    <DetailInfoRow
                        label="이월"
                        value={moneyFormat(carryover)}
                        adornment={"원"}
                    />
                    <Divider />
                </div>
            </BasicTemplate>
        </div>
    );
};

export default RepairSalesStats;

const rootStyle = css`
    #page-info-section {
        #page-path {
            display: flex;
            margin: 24px 0px 30px;
            color: ${Colors.gray};

            p {
                margin-left: 5px;
                color: ${Colors.oceanBlue};
            }
        }
    }

    #filter-section {
        display: flex;
        justify-content: end;

        margin: 0 20px 20px 0;

        button {
            margin-left: 10px;
        }
    }

    .section {
        margin-top: 35px;
    }

    .space {
        height: 20px;
    }
`;
