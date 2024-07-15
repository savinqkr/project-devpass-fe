import { useForm } from "react-hook-form";
import { ILicenseContractEditForm } from "./ContractEditForm.interface";
import VLicenseContractEditForm from "./ContractEditForm.view";
import { useMutation, useQuery } from "react-query";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import contractService from "@domains/contract/services/graphql/contract.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useEffect, useState } from "react";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import dayjs from "dayjs";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import moneyFormat from "@hooks/moneyFommat";
import estimateService from "@domains/estimate/services/estimate.service";
import companyService from "@domains/company/services/company.service";
import getCommonOptions from "@domains/contract/hooks/getCommonOptions";
import { ProductType } from "@enums";
import codeService from "@common/services/code/code.service";
import moneyToNumber from "@utils/moneyToNumber";

const LicenseContractEditForm: React.FC<
    ILicenseContractEditForm.IProps
> = props => {
    const {
        register,
        getValues,
        setValue,
        watch,
        handleSubmit,
        control,
        clearErrors,
        setError,
        resetField,
        formState: { errors },
    } = useForm<ILicenseContractEditForm.IForm>();

    const { type } = props;

    const router = useRouter();
    const id = router.query.id as string;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // # --------------------------- [ company - 고객사, 계약사 ] --------------------------------- #
    var [clientOptions, setClientOptions] = useState<
        { label: string; value: number }[]
    >([]);

    useQuery(
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

    // --------------------------------- [ Project - 사업 ] ----------------------------------------

    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    var [projectOptions, setProjectOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const { data: projectData, refetch: refetchProjects } = useQuery(
        ["get all projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    deleted_at: { _is_null: true },
                    is_canceled: { _eq: false },
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
                var projectList: { label: string; value: number }[] = [];
                data.project.map(project => {
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
        commonType?.common_code[0].code && refetchProjects();

        const formWatch = watch((value, { name, type }) => {
            if (name === "client" && type === "change") {
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

    // -------------------------- [ sales_representative_id - 계약 담당자 ] ----------------------------
    const [salesRepresentativeOptions, setSalesRepresentativeOptions] =
        useState<{ label: string; value: number }[]>([]);

    const { refetch: getSalesRepresentativeRefetch } = useQuery(
        ["getSalesRepresentative"],
        () =>
            projectService.getProjectByPk({
                id: getValues("project.value"),
            }),
        {
            enabled: false,
            onSuccess(data) {
                var salesRepresentativeList: {
                    label: string;
                    value: number;
                }[] = [];

                data.project_by_pk.employees.map(employee => {
                    if (
                        employee.role.special_role?.value === "본사 영업" &&
                        employee.employee.deleted_at === null
                    ) {
                        salesRepresentativeList.push({
                            label: employee.employee.name,
                            value: employee.employee.id,
                        });
                    }
                });

                setSalesRepresentativeOptions(salesRepresentativeList);

                salesRepresentativeList.length === 1 &&
                    setValue("sales_representative", {
                        label: salesRepresentativeList[0].label,
                        value: salesRepresentativeList[0].value,
                    });
            },
        }
    );

    // # ------------------------- [ common_code - 공통코드 ] --------------------------------- #
    const issuanceMethodOptions = getCommonOptions(
        CodeCategory.ISSUANCE_METHOD_TYPE
    );
    const billingCycleOptions = getCommonOptions(
        CodeCategory.BILLING_CYCLE_TYPE
    );

    // #-------------------------- [ 기본 값 조회 Query ] ---------------------------------- #
    const { data: contractData } = useQuery(
        ["getContractOneById"],
        () =>
            contractService.getContractOneById({
                id: parseInt(id),
            }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                // console.log(data.contract_by_pk.issuing_site);
                const {
                    client: { id: client_id, name: client_name },
                    project: { id: project_id, name: project_name },
                    contractor: { id: contractor_id, name: contractor_name },
                    name,
                    contract_period_start,
                    contract_period_end,
                    contract_date,
                    contract_amount,
                    including_vat,
                    sales_representative,
                    performance_guarantee_rate,
                    defect_performance_guarantee_rate,
                    defect_warranty_period_start,
                    defect_warranty_period_end,
                    issuance_method,
                    issuing_site,
                    inspection_target,
                    inspection_site,
                    monthly_standard_amount,
                    billing_cycle,
                    billing_amount_once,
                    billing_date,
                    payment_timing,
                    note,
                } = data.contract_by_pk;

                setValue("client", { label: client_name, value: client_id });
                setValue("project", {
                    label: project_name,
                    value: project_id,
                });
                setValue("sales_representative", {
                    label: sales_representative.name,
                    value: sales_representative.id,
                });
                setValue("contractor", {
                    label: contractor_name,
                    value: contractor_id,
                });
                setValue("name", name);
                setValue("contract_period_start", dayjs(contract_period_start));
                setValue("contract_period_end", dayjs(contract_period_end));
                setValue("contract_date", dayjs(contract_date));
                setValue(
                    "contract_amount",
                    removeCurrencyOfMoney(contract_amount)
                );
                setValue(
                    "defect_performance_guarantee_rate",
                    defect_performance_guarantee_rate
                );
                setValue("including_vat", removeCurrencyOfMoney(including_vat));
                setValue(
                    "performance_guarantee_rate",
                    performance_guarantee_rate
                );
                defect_warranty_period_start &&
                    setValue(
                        "defect_warranty_period_start",
                        dayjs(defect_warranty_period_start)
                    );
                defect_warranty_period_end &&
                    setValue(
                        "defect_warranty_period_end",
                        dayjs(defect_warranty_period_end)
                    );

                setValue("issuance_method", issuance_method.code);
                setValue("issuing_site", issuing_site);
                setValue("inspection_target", inspection_target);
                setValue("inspection_site", inspection_site);
                setValue(
                    "monthly_standard_amount",
                    moneyFormat(removeCommaOfMoney(monthly_standard_amount))
                );
                setValue("billing_cycle", billing_cycle.code);
                setValue(
                    "billing_amount_once",
                    moneyFormat(removeCommaOfMoney(billing_amount_once))
                );
                setValue("billing_date", billing_date);
                setValue("payment_timing", payment_timing);
                setValue("note", note);

                // getFinalEstimateRefetch();
                // getSalesRepresentativeRefetch();
                setHasFinalEstimate(true);
            },
        }
    );

    // 저장된 최종 견적서
    const {} = useQuery(
        ["getOriginEstimate"],
        () =>
            estimateService.getEstimateByPk({
                id: contractData!.contract_by_pk.final_estimate_document_id,
            }),
        {
            enabled: Boolean(contractData),
            onSuccess(data) {
                const { case_name, id: origin_estimate_id } =
                    data.estimate_by_pk;
                setValue("final_estimate", {
                    label: case_name,
                    value: origin_estimate_id,
                });
            },
        }
    );

    // 최종 견적서
    const [hasFinalEstimate, setHasFinalEstimate] = useState<boolean>(false);
    const [finalEstimates, setFinalEstimates] = useState<
        { label: string; value: number }[]
    >([]);
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
                        // 최종견적서 Options 설정
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

                        // 기본 값 설정
                        const formWatch = watch((value, { name, type }) => {
                            if (name === "project" && type === "change") {
                                setHasFinalEstimate(false);
                                setValue("contract_amount", "");
                                resetField("final_estimate");
                            }
                            // else if (
                            //     name === "project" &&
                            //     type !== "change"
                            // ) {
                            //     clearErrors("project");

                            //     setValue(
                            //         "contract_amount",
                            //         removeCurrencyOfMoney(
                            //             data.estimate[0].total_price
                            //         )
                            //     );
                            // }

                            return () => formWatch.unsubscribe();
                        });

                        // 최종 견적서가 1개인 경우
                    } else if (finalEstimate.length === 1) {
                        setFinalEstimates([]);
                        setHasFinalEstimate(true);
                        clearErrors("project");

                        setValue(
                            "contract_amount",
                            removeCurrencyOfMoney(data.estimate[0].total_price)
                        );

                        setValue("final_estimate", {
                            label: data.estimate[0].case_name,
                            value: data.estimate[0].id,
                        });

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
        const formWatch = watch((value, { name, type }) => {
            if (name === "final_estimate" && type === "change") {
                setHasFinalEstimate(true);
                clearErrors("project");

                const final = finalEstimateData?.estimate.find(item => {
                    return item.id === getValues("final_estimate.value");
                });

                if (final) {
                    setValue(
                        "contract_amount",
                        removeCurrencyOfMoney(final.total_price)
                    );

                    setValue("final_estimate", {
                        label: final.case_name,
                        value: final.id,
                    });
                }
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("final_estimate")]);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ 수정 Mutation ]
    const { mutate: updateContractOneMutation } = useMutation(
        ["updateContractOne"],
        () =>
            contractService.updateContractById({
                id: parseInt(id),
                // ------------------------------ [ 기본정보 ] --------------------------------------
                type_code: commonType?.common_code[0].code!,
                client_id: getValues("client.value"),
                sales_representative_id: getValues(
                    "sales_representative.value"
                ),
                project_id: getValues("project.value"),

                name: getValues("name"),

                // ------------------------ [ 기본정보 - 납부관련 ] ----------------------------------
                contract_period_start: getValues(
                    "contract_period_start"
                ).toDate(),
                contract_period_end: getValues("contract_period_end")?.toDate(),
                contract_amount: removeCommaOfMoney(
                    getValues("contract_amount")
                ),
                // contract_date: getValues("contract_date").toDate(),
                contract_date: getValues("contract_date").toDate(),
                including_vat: removeCommaOfMoney(getValues("including_vat")),
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
                issuance_method_code: getValues("issuance_method"),
                issuing_site: getValues("issuing_site"),
                inspection_target: getValues("inspection_target"),
                inspection_site: getValues("inspection_site"),
                monthly_standard_amount: removeCommaOfMoney(
                    getValues("monthly_standard_amount")
                ),
                billing_amount_once: moneyToNumber(
                    getValues("billing_amount_once")
                ),
                billing_cycle_code: getValues("billing_cycle"),
                billing_date: getValues("billing_date"),
                payment_timing: getValues("payment_timing"),
                note: getValues("note"),

                // ------------------------------- [ 첨부문서 ] -------------------------------------
                // 해당 섹션 수정 예정
                final_estimate_document_id: getValues("final_estimate.value"),
                // attachments: [],
                // -------------------------------- [ 상태 ] ---------------------------------------
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                if (type === ProductType.SERVICE) {
                    router.push(
                        `${PATH.TECHSUPPORT.CONTRACT.MAIN}/${data.updateContract.id}`
                    );
                } else if (type === ProductType.CUSTOMIZE) {
                    router.push(
                        `${PATH.CUSTOMIZE.CONTRACT.MAIN}/${data.updateContract.id}`
                    );
                } else if (type === ProductType.MAINTENANCE) {
                    router.push(
                        `${PATH.REPAIR.CONTRACT.MAIN}/${data.updateContract.id}`
                    );
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------- [ U S E  E F F E C T ] --------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ WATCH ( 하자이행보증요율 시작일 - defect_warranty_period_start ) ]
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

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    // '부가세 포함' Field 자동 입력 함수
    // 기본 부가세 : { 계약금액 ? 공급금액 }의 10%
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
            item.id === getValues("project.value");
        })
    );

    useEffect(() => {
        setProject(
            projectData?.project.find(item => {
                return item.id === getValues("project.value");
            })
        );
    }, [watch("project")]);

    useEffect(() => {
        if (finalEstimateData?.estimate[0] && project) {
            const { total_price } = finalEstimateData.estimate[0];
            const startDate = dayjs(project?.start_date);
            const endDate = dayjs(project?.end_date);
            const period = endDate.diff(startDate, "month");
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
        () => codeService.getCodeBypk({ code: getValues("billing_cycle") }),
        {
            enabled: false,
            onSuccess(data) {
                setBillingCycleType(data.common_code_by_pk.value);
            },
        }
    );

    useEffect(() => {
        typeof getValues("billing_cycle") === "number" && billingCycleRefetch();
    }, [watch("billing_cycle")]);

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
        const formWatch = watch((value, { name, type }) => {
            if (name === "issuance_method" && type === "change") {
                const selectedIssuanceSite = issuanceMethodOptions.find(
                    item => {
                        return item.value === getValues("issuance_method");
                    }
                );

                if (
                    selectedIssuanceSite?.label === "정발행" ||
                    selectedIssuanceSite?.label === "정발행 XML 첨부"
                ) {
                    setValue("issuing_site", "https://www.makebill.co.kr/");
                } else {
                    setValue("issuing_site", "");
                }
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("issuance_method")]);

    const onClickUpdate = () => {
        commonType?.common_code[0].code && updateContractOneMutation();
    };

    const onClickCancel = () => {
        router.back();
    };

    return (
        <VLicenseContractEditForm
            control={control}
            register={register}
            errors={errors}
            clientOptions={clientOptions}
            projectOptions={projectOptions}
            salesRepresentativeOptions={salesRepresentativeOptions}
            issuanceMethodOptions={issuanceMethodOptions}
            billingCycleOptions={billingCycleOptions}
            finalEstimateOptions={finalEstimates}
            onClickUpdate={handleSubmit(onClickUpdate)}
            onClickCancel={onClickCancel}
            hasFinalEstimate={hasFinalEstimate}
            {...props}
        />
    );
};

export default LicenseContractEditForm;
