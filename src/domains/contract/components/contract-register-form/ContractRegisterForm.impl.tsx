import { useForm } from "react-hook-form";
import { IContractRegisterForm } from "./ContractRegisterForm.interface";
import VContractRegisterForm from "./ContractRegisterForm.view";
import { useMutation, useQuery } from "react-query";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import { useRouter } from "next/router";
import contractService from "@domains/contract/services/graphql/contract.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useEffect, useState } from "react";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import moneyFormat from "@hooks/moneyFommat";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import estimateService from "@domains/estimate/services/estimate.service";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import companyService from "@domains/company/services/company.service";
import getCommonOptions from "@domains/contract/hooks/getCommonOptions";
import dayjs from "dayjs";
import codeService from "@common/services/code/code.service";
import moneyToNumber from "@utils/moneyToNumber";

const ContractRegisterForm: React.FC<IContractRegisterForm.IProps> = props => {
    const { type, routePath } = props;

    const {
        register,
        getValues,
        setValue,
        watch,
        handleSubmit,
        control,
        setError,
        clearErrors,
        resetField,
        formState: { errors },
    } = useForm<IContractRegisterForm.IForm>();

    const router = useRouter();

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    // Common Type
    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // # --------------------------- [ company - 고객사, 계약사 ] --------------------------------- #
    var [clientOptions, setClientOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const {} = useQuery(
        ["getAllClient"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _in: [CompanyType.CLIENT],
                        },
                    },
                },
            }),

        {
            onSuccess(data) {
                var clients: { label: string; value: number }[] = [];

                data.map(company => {
                    if (
                        company?.type.value === CompanyType.CLIENT &&
                        company?.deleted_at === null
                    ) {
                        clients.push({
                            label: company!.name,
                            value: company!.id,
                        });
                    }
                });

                setClientOptions(clients);
            },
        }
    );

    // # -------------------------------- [ project - 사업 ] -------------------------------------- #
    var [projectOptions, setProjectOptions] = useState<
        { label: string; value: number }[]
    >([]);

    // client의 값이 변경되는 경우 refetch
    const { data: projectData, refetch: refetchProjects } = useQuery(
        ["get all projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    is_canceled: { _eq: false },
                    deleted_at: { _is_null: true },
                    type_code: { _eq: commonType!.common_code[0].code },
                    client: {
                        name: {
                            _eq: getValues("client.label"),
                        },
                    },
                },
            }),
        {
            enabled: false,
            onSuccess(data) {
                // console.log(data);
                var projectList: { label: string; value: number }[] = [];

                data.project.map(project => {
                    const contract = project.contracts.find(item => {
                        return item.deleted_at === null;
                    });

                    !contract &&
                        projectList.push({
                            label: project.name,
                            value: project.id,
                        });
                });

                setProjectOptions(projectList);
            },
        }
    );

    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (
                !!commonType?.common_code[0].code &&
                name === "client" &&
                type === "change"
            ) {
                refetchProjects();
                resetField("project");
                resetField("sales_representative");
                resetField("contract_amount");
                resetField("monthly_standard_amount");

                setFinalEstimates([]);
                resetField("final_estimate");
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("client")]);

    // # ------------------------ [ sales_representative - 영업 담당자 ] -------------------------- #
    const [salesRepresentativeOptions, setSalesRepresentativeOptions] =
        useState<{ label: string; value: number }[]>([]);

    // project의 값이 변경되는 경우 refetch
    const { refetch: getSalesRepresentativeRefetch } = useQuery(
        ["getSalesRepresentative"],
        () =>
            projectService.getProjectByPk({
                id: getValues("project.value"),
            }),
        {
            enabled: false,
            onSuccess(data) {
                var salesEmployeeList: { label: string; value: number }[] = [];

                data.project_by_pk.employees.map(employee => {
                    if (
                        employee.role.special_role?.value === "본사 영업" &&
                        employee.employee.deleted_at === null
                    ) {
                        salesEmployeeList.push({
                            label: employee.employee.name,
                            value: employee.employee.id,
                        });
                    }
                });

                setSalesRepresentativeOptions(salesEmployeeList);

                // 사업에 등록된 담당자 중 '영업 담당자' 역할을 가진 담당자가 한 명인 경우 default value로 설정
                salesEmployeeList.length === 1 &&
                    setValue("sales_representative", {
                        label: salesEmployeeList[0].label,
                        value: salesEmployeeList[0].value,
                    });
            },
        }
    );
    // # ----------------------------- [ final_estimate - 견적 ] ---------------------------------- #
    const [hasFinalEstimate, setHasFinalEstimate] = useState<boolean>(false);
    const [finalEstimates, setFinalEstimates] = useState<
        { label: string; value: number }[]
    >([]);

    // project의 값이 변경되면 refetch
    const { data: finalEstimateData, refetch: getFinalEstimateRefetch } =
        useQuery(
            ["getFinalEstimate"],
            () =>
                estimateService.getFinalEstimateByProject({
                    project_id: getValues("project.value"),
                    type_code: commonType?.common_code[0].code!,
                }),
            {
                enabled: false,
                onSuccess(data) {
                    const finalEstimate = data.estimate.filter(item => {
                        return item.deleted_at == null;
                    });

                    // 최종견적서가 1개 이상인 경우
                    if (finalEstimate.length > 1) {
                        clearErrors("project");
                        const estimateList: { label: string; value: number }[] =
                            [];
                        data.estimate.forEach(item => {
                            estimateList.push({
                                label: `${item.case_name} (${dayjs(
                                    item.created_at
                                ).format("YYYY/MM/DD HH:mm")})`,
                                value: item.id,
                            });
                        });

                        setFinalEstimates(estimateList);

                        setValue("contract_amount", "");
                        resetField("final_estimate");

                        // 최종 견적서가 1개인 경우
                    } else if (finalEstimate.length === 1) {
                        setFinalEstimates([]);
                        setHasFinalEstimate(true);
                        clearErrors("project");

                        setValue(
                            "contract_amount",
                            removeCurrencyOfMoney(data.estimate[0].total_price)
                        );
                        setValue("final_estimate.value", data.estimate[0].id);

                        // 최종 견적서가 없는 경우
                    } else if (finalEstimate.length <= 0) {
                        setFinalEstimates([]);
                        setHasFinalEstimate(false);
                        setError(
                            "project",
                            {
                                message:
                                    "해당 사업에 최종 확정된 견적이 없습니다.",
                            },
                            { shouldFocus: true }
                        );
                    }
                },
            }
        );

    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (
                name === "project" &&
                type === "change" &&
                getValues("project.value")
            ) {
                getFinalEstimateRefetch();
                getSalesRepresentativeRefetch();
                resetField("contract_amount");
                resetField("monthly_standard_amount");
            } else if (name === "project" && type === "change") {
                resetField("contract_amount");
                resetField("monthly_standard_amount");
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("project")]);

    useEffect(() => {
        if (finalEstimateData) {
            const estimate = finalEstimateData.estimate.find(item => {
                return getValues("final_estimate.value") === item.id;
            });

            if (estimate) {
                setHasFinalEstimate(true);
                clearErrors("project");

                setValue(
                    "contract_amount",
                    removeCurrencyOfMoney(estimate.total_price)
                );

                setValue("final_estimate.value", estimate.id);
            }
        }
    }, [watch("final_estimate")]);

    // # ------------------------- [ common_code - 공통코드 ] --------------------------------- #
    const issuanceMethodOptions = getCommonOptions(
        CodeCategory.ISSUANCE_METHOD_TYPE
    );
    const billingCycleOptions = getCommonOptions(
        CodeCategory.BILLING_CYCLE_TYPE
    );

    // useEffect(() => {
    //     console.log(getValues("contract_date"));
    // }, [watch("contract_date")]);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    const { mutate: registerContractOneMutation } = useMutation(
        ["registerContractOne"],
        () =>
            contractService.registerContractOne({
                // ------------------------------ [ 기본정보 ] --------------------------------------
                type_code: commonType?.common_code[0].code!,
                client_id: getValues("client.value"),
                project_id: getValues("project.value"),
                sales_representative_id: getValues(
                    "sales_representative.value"
                ),
                contractor_id: getValues("contractor.value"),
                name: getValues("name"),
                // ------------------------ [ 기본정보 - 납부관련 ] ----------------------------------
                contract_period_start: getValues(
                    "contract_period_start"
                )?.toDate(),
                contract_period_end: getValues("contract_period_end").toDate(),
                contract_date: getValues("contract_date").toDate(),
                contract_amount: moneyToNumber(getValues("contract_amount")),
                including_vat: moneyToNumber(getValues("including_vat")),
                performance_guarantee_rate: parseFloat(
                    `${getValues("performance_guarantee_rate")}`
                ),

                defect_performance_guarantee_rate: parseFloat(
                    `${getValues("defect_performance_guarantee_rate")}`
                ),
                defect_warranty_period_start: getValues(
                    "defect_warranty_period_start"
                )?.toDate(),
                defect_warranty_period_end: getValues(
                    "defect_warranty_period_end"
                )?.toDate(),
                issuance_method_code: getValues("issuance_method_code"),
                issuing_site: getValues("issuing_site"),
                inspection_target: getValues("inspection_target"),
                inspection_site: getValues("inspection_site"),
                monthly_standard_amount: moneyToNumber(
                    getValues("monthly_standard_amount")
                ),
                billing_cycle_code: getValues("billing_cycle_code"),
                billing_amount_once: moneyToNumber(
                    getValues("billing_amount_once")
                ),
                billing_date: getValues("billing_date"),
                payment_timing: getValues("payment_timing"),
                note: getValues("note"),

                // ------------------------------- [ 첨부문서 ] -------------------------------------
                // 해당 섹션 수정 예정
                final_estimate_document_id: getValues("final_estimate.value"),
                // attachments: [],
                // -------------------------------- [ 상태 ] ---------------------------------------
                created_by: user.id,
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                router.push(`${routePath}/${data.registerContract.id}`);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    // # ---------------------- [ '부가세 포함' Field 자동 입력 함수 ] ----------------------------- #
    // 기본 부가세 : { 계약금액 }의 10%
    useEffect(() => {
        getValues("contract_amount") === ""
            ? setValue("including_vat", "")
            : setValue(
                  "including_vat",
                  moneyFormat(
                      Math.floor(
                          removeCommaOfMoney(getValues("contract_amount")) * 1.1
                      )
                  )
              );
    }, [watch("contract_amount")]);

    // # ------------------------------- [ 매월 기준 금액 ] --------------------------------------- #
    // 견적 금액 / 기술지원 사업 기간 (개월)
    const [project, setProject] = useState(
        projectData?.project.find(item => {
            return item.id === getValues("project.value");
        })
    );

    useEffect(() => {
        // watch("project_id")의 값과 일치하는 프로젝트를 찾아서 설정
        const foundProject = projectData?.project.find(item => {
            return item.id === getValues("project.value");
        });

        // 찾은 프로젝트가 있다면 설정
        if (foundProject) {
            setProject(foundProject);
        }
    }, [watch("project"), projectData]);

    useEffect(() => {
        if (
            !!finalEstimateData?.estimate &&
            finalEstimateData?.estimate.length !== 0 &&
            !!project
        ) {
            const { total_price } = finalEstimateData.estimate[0];
            const startDate = dayjs(project?.start_date);
            const endDate = dayjs(project?.end_date);

            const period =
                endDate.diff(startDate, "month") === 0
                    ? 1
                    : endDate.diff(startDate, "month");

            setValue(
                "monthly_standard_amount",
                moneyFormat(
                    Math.floor(removeCommaOfMoney(total_price) / period)
                )
            );
        }
    }, [finalEstimateData, project]);

    // # -------------------------------- [ 1회 청구 금액 ] --------------------------------------- #

    const { refetch: billingCycleRefetch } = useQuery(
        ["getBillingCycle"],
        () =>
            codeService.getCodeBypk({ code: getValues("billing_cycle_code") }),
        {
            enabled: false,
            onSuccess(data) {
                setBillingCycleType(data.common_code_by_pk.value);
            },
        }
    );

    useEffect(() => {
        typeof getValues("billing_cycle_code") === "number" &&
            billingCycleRefetch();
    }, [watch("billing_cycle_code")]);

    const [billingCycleType, setBillingCycleType] = useState<string>("");
    useEffect(() => {
        if (
            billingCycleType !== "" &&
            getValues("monthly_standard_amount") !== ""
        ) {
            let calculatedAmount = "";

            if (billingCycleType === "매월") {
                calculatedAmount = moneyFormat(
                    Math.floor(
                        removeCommaOfMoney(
                            getValues("monthly_standard_amount")
                        ) * 1
                    )
                );
            } else if (billingCycleType === "분기") {
                calculatedAmount = moneyFormat(
                    Math.floor(
                        removeCommaOfMoney(
                            getValues("monthly_standard_amount")
                        ) * 3
                    )
                );
            } else if (billingCycleType === "년납") {
                calculatedAmount = moneyFormat(
                    Math.floor(
                        removeCommaOfMoney(
                            getValues("monthly_standard_amount")
                        ) * 12
                    )
                );
            }

            setValue("billing_amount_once", calculatedAmount);
        }
    }, [billingCycleType, watch("monthly_standard_amount")]);

    // # ------------------------------ [ 계산서 발행 사이트 ] ------------------------------------- #
    useEffect(() => {
        const selectedIssuanceSite = issuanceMethodOptions.find(item => {
            return item.value === getValues("issuance_method_code");
        });

        if (
            selectedIssuanceSite?.label === "정발행" ||
            selectedIssuanceSite?.label === "정발행 XML 첨부"
        ) {
            setValue("issuing_site", "https://www.makebill.co.kr/");
        } else {
            setValue("issuing_site", "");
        }
    }, [watch("issuance_method_code")]);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------- [ U S E  E F F E C T ] --------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ WATCH ( 하자이행보증기간 시작일 - defect_warranty_period_start ) ]
    useEffect(() => {
        // 하자이행보증기간 종료일 : 하자이행보증기간 시작일 + 364일
        if (getValues("defect_warranty_period_start")) {
            const end_date = getValues("defect_warranty_period_start").add(
                364,
                "day"
            );
            setValue("defect_warranty_period_end", end_date);
        }
    }, [watch("defect_warranty_period_start")]);

    // onClickFunction
    const onClickSubmit = () => {
        if (commonType?.common_code[0].code && hasFinalEstimate) {
            console.log(typeof getValues("sales_representative.value"));
            registerContractOneMutation();
        }
    };

    return (
        <VContractRegisterForm
            control={control}
            register={register}
            errors={errors}
            clientOptions={clientOptions}
            projectOptions={projectOptions}
            salesRepresentativeOptions={salesRepresentativeOptions}
            issuanceMethodOptions={issuanceMethodOptions}
            billingCycleOptions={billingCycleOptions}
            finalEstimateOptions={finalEstimates}
            hasFinalEstimate={hasFinalEstimate}
            onClickSubmit={handleSubmit(onClickSubmit)}
            {...props}
        />
    );
};

export default ContractRegisterForm;
