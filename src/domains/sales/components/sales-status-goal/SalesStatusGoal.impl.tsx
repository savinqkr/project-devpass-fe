import { useEffect, useState } from "react";
import { ISalesStatusGoal } from "./SalesStatusGoal.interface";
import VSalesStatusGoal from "./SalesStatusGoal.view";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import salesService from "@domains/sales/services/sales.service";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import { CodeCategory } from "src/enums/code_category.enum";
import codeService from "@common/services/code/code.service";

const SalesStatusGoal: React.FC<ISalesStatusGoal.IProps> = props => {
    const { year, goalRateData, onChangeGoal, type } = props;

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ [ G O A L  S E C T I O N ] -----------------------------------
    const { getValues, setValue, control } = useForm<ISalesStatusGoal.IGoal>({
        defaultValues: { goal: "" },
    });

    // CommonType
    const { data: commonType, isSuccess } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    // 해당 년도의 목표금액 등록 유무 확인
    var [isRegistered, setIsRegistered] = useState<boolean>(false);

    // 목표금액 수정 버튼
    const onClickSetGoalBtn = () => {
        if (isRegistered && isSuccess) {
            updateGoalMutation();
        } else if (!isRegistered && isSuccess) {
            registerGoalMutation();
        }
    };

    // 해당 년도 목표금액 조회
    const { refetch: goalByYearRefetch, data: goalData } = useQuery(
        ["getGoalByYear"],
        () =>
            salesService.getGoalByYear({
                year,
                type_code: commonType!.common_code[0].code,
            }),
        {
            enabled: isSuccess,
            onSuccess(data) {
                if (data.sales_status_by_pk !== null) {
                    setValue(
                        "goal",
                        removeCurrencyOfMoney(data.sales_status_by_pk.goal)
                    );
                    setIsRegistered(true);
                } else {
                    setValue("goal", "");
                    setIsRegistered(false);
                }
            },
        }
    );

    // 해당 년도 목표금액 수정
    const { mutate: updateGoalMutation } = useMutation(
        ["updateGoal"],
        () =>
            salesService.updatedGoal({
                year: year,
                goal: removeCommaOfMoney(getValues("goal")),
                type_code: commonType!.common_code[0].code,
            }),
        {
            onSuccess(data) {
                onChangeGoal();
            },
        }
    );

    // 해당 년도 목표금액 등록
    const { mutate: registerGoalMutation } = useMutation(
        ["registerGoal"],
        () =>
            salesService.registerGoal({
                year: year,
                goal: removeCommaOfMoney(getValues("goal")),
                type_code: commonType!.common_code[0].code,
            }),
        {
            onSuccess(data) {
                onChangeGoal();
                setIsRegistered(true);
            },
        }
    );

    useEffect(() => {
        isSuccess && goalByYearRefetch();
    }, [isSuccess]);

    useEffect(() => {
        isSuccess && goalByYearRefetch();
    }, [year, isSuccess]);

    return (
        <VSalesStatusGoal
            control={control}
            isRegistered={isRegistered}
            onClickSetGoalBtn={onClickSetGoalBtn}
            {...props}
        />
    );
};

export default SalesStatusGoal;
