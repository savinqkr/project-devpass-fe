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
import SalesStatusMonthlyTable from "@domains/sales/components/sales-status-monthly-table";
import useAddSubtotals from "@domains/sales/hooks/useAddSubtotals";
import useAddYearOptions from "@domains/sales/hooks/useAddYearOptions";
import salesService from "@domains/sales/services/sales.service";
import { ButtonType, ProductType } from "@enums";
import moneyFormat from "@hooks/moneyFommat";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import { Divider, css } from "@mui/material";
import moneyToNumber from "@utils/moneyToNumber";
import dayjs from "dayjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSearch } from "react-icons/io";
import { useQuery } from "react-query";
import { CodeCategory } from "src/enums/code_category.enum";
import { SalesFilterType } from "src/enums/sales_filter_type";

const TechSupportSalesStats: NextPage = () => {
    // 현재 년도
    const nowYear = new Date().getFullYear();

    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: ProductType.SERVICE },
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
    // const [yearOptions, setYearOptions] = useState<
    //     { label: string; value: number }[]
    // >([]);

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
    }, []);

    // ------------------------------- M O N T H L Y  S A L E S ------------------------------------
    const {
        refetch: getAllSalesRefetch,
        isSuccess: salesSuccess,
        isRefetching: isSalesRefetching,
    } = useQuery(
        ["getAllSales"],
        () =>
            salesService.getAllSales({
                where: {
                    common_type: { value: { _in: [ProductType.SERVICE] } },
                    // project: {
                    //     is_canceled: { _eq: false },
                    // },
                    deleted_at: {
                        _is_null: true,
                    },
                },
            }),
        {
            onSuccess(data) {
                let subtotal: { month: number; total: number }[] = [];
                let total: { month: number; total: number }[] = [];
                let over: { value: number } = { value: 0 };
                for (let i = 1; i <= 12; i++) {
                    subtotal.push({
                        month: i,
                        total: 0,
                    });
                    total.push({
                        month: i,
                        total: 0,
                    });
                }
                // 소계 데이터
                data.forEach(item => {
                    // 매출 년도 추출
                    useAddYearOptions(
                        [
                            item?.first_sales_claim_date,
                            item?.second_sales_claim_date,
                            item?.last_sales_claim_date,
                        ],
                        setYearOptions,
                        yearOptions
                    );

                    // 소계 및 이월 데이터 생성
                    useAddSubtotals(
                        [
                            {
                                date: item?.first_sales_claim_date,
                                amount: item?.first_sales,
                            },
                            {
                                date: item?.second_sales_claim_date,
                                amount: item?.second_sales,
                            },
                            {
                                date: item?.last_sales_claim_date,
                                amount: item?.last_sales,
                            },
                        ],
                        getValues("year"),
                        subtotal,
                        over
                    );
                });

                setCarryover(over.value);

                setSalesSubtotal(subtotal);

                // 누계 데이터
                subtotal.forEach((item, idx) => {
                    if (idx === 0) {
                        total[idx].total = item.total;
                    } else {
                        total[idx].total = total[idx - 1].total + item.total;
                    }
                });

                setSalesTotal(total);
            },
        }
    );

    const onClickSearchBtn = () => {
        getAllSalesRefetch(), contractRefetch();
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
                    type: { value: { _in: [ProductType.SERVICE] } },
                    // project: {
                    //     is_canceled: { _eq: false },
                    // },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: !!commonType,
            onSuccess(data) {
                // 각 계약금 가져와서 넣어주기
                let subtotal: { month: number; total: number }[] = [];
                let total: { month: number; total: number }[] = [];
                for (let i = 1; i <= 12; i++) {
                    subtotal.push({
                        month: i,
                        total: 0,
                    });
                    total.push({
                        month: i,
                        total: 0,
                    });
                }

                data.forEach(item => {
                    const year = dayjs(item?.contract_period_start)
                        .utc(true)
                        .year();
                    const month = dayjs(item?.contract_period_start)
                        .utc(true)
                        .month();

                    year && setYearOptions(yearOptions.add(year));

                    if (getValues("year") === year) {
                        subtotal[month].total =
                            subtotal[month].total +
                            moneyToNumber(item!.contract_amount);
                    }
                });

                setContractSubtotal(subtotal);

                subtotal.forEach((item, idx) => {
                    if (idx === 0) {
                        total[idx].total = item.total;
                    } else {
                        total[idx].total = total[idx - 1].total + item.total;
                    }
                });

                setContractTotal(total);
            },
        }
    );

    // 사용자가 선택한 필터 값에 따라서 차트 데이터 설정
    useEffect(() => {
        if (!isContractRefetching && !isSalesRefetching) {
            if (getValues("type") === SalesFilterType.SUBTOTAL) {
                setSalesData(salesSubtotal);
                setContractData(contractSubtotal);
            } else if (getValues("type") === SalesFilterType.CUMULATIVE) {
                setSalesData(salesTotal);
                setContractData(contractTotal);
            }
        }
        goalRefetch();
    }, [isContractRefetching, isSalesRefetching]);

    // 첫 렌더링 시 현재 년도로 차트 데이터 설정
    useEffect(() => {
        if (salesSuccess && contractSuccess) {
            if (getValues("type") === SalesFilterType.SUBTOTAL) {
                setSalesData(salesSubtotal);
                setContractData(contractSubtotal);
            } else if (getValues("type") === SalesFilterType.CUMULATIVE) {
                setSalesData(salesTotal);
                setContractData(contractTotal);
            }
        }
    }, [salesSuccess, contractSuccess]);

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
            enabled: !!commonType,
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
                    title="기술지원 매출 현황"
                    isVisible
                    path={`${PATH.TECHSUPPORT.SALES.MAIN}`}
                />
                <div id="page-info-section">
                    <div id="page-path">
                        {"기술지원 > 기술지원 검수 & 매출 >"} <p>매출 현황</p>
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
                                    // options={yearOptions}
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
                            common_type={ProductType.SERVICE}
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
                    type={ProductType.SERVICE}
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

export default TechSupportSalesStats;

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
