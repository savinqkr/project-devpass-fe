import { useForm } from "react-hook-form";
import { ILicenseContractEditForm } from "./LicenseContractEditForm.interface";
import VLicenseContractEditForm from "./LicenseContractEditForm.view";
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
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import { GetCompanyOptionsByType } from "@domains/contract/hooks";
import moneyFormat from "@hooks/moneyFommat";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import fetchFile from "@utils/fetchFile";
import { AttachmentState, ProductType } from "@enums";
import editAttachments from "@utils/editAttachments";
import estimateService from "@domains/estimate/services/estimate.service";
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

    const router = useRouter();
    const id = router.query.id as string;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    const [totalAmount, setTotalAmount] = useState<string>("원");

    const [remainingAmount, setRemainingAmount] = useState<string>("원");

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    //  [ Project - 사업 ]
    const { data: license } = useQuery(["getLicenseCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: ProductType.LICENSE },
            },
        })
    );

    var [projectOptions, setProjectOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const { refetch: refetchProjects } = useQuery(
        ["get all projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    deleted_at: { _is_null: true },
                    is_canceled: { _eq: false },
                    type_code: { _eq: license!.common_code[0].code },
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
        license?.common_code[0].code && refetchProjects();

        const formWatch = watch((value, { name, type }) => {
            if (name === "client" && type === "change") {
                resetField("project");
                resetField("sales_representative");
                resetField("contract_amount");
                resetField("supply_amount");

                setFinalEstimates([]);
                resetField("final_estimate");
                setTotalAmount("원");
                setRemainingAmount("원");
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

    // -------------------------------- [ attachment - 첨부문서 ] -----------------------------------
    const [attachments, setAttachments] =
        useState<IAttachmentInput.IAttachment[]>();

    const { data: attachmentCode } = useQuery(["getAttachmentCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                value: { _eq: AttachmentType.CONTRACT },
            },
        })
    );

    const { refetch: attachmentRefetch } = useQuery(
        ["getAttachments"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id),
            }),
        {
            enabled: false,
            async onSuccess(data) {
                let attachment = data.attachment.filter(
                    item =>
                        item.type.value === AttachmentType.CONTRACT &&
                        item.deleted_at === null
                );

                const resolvedAttachment = await Promise.all(
                    attachment.map(async file => {
                        const fileBlob = await fetchFile(
                            file.id,
                            file.file_name
                        );
                        return {
                            id: file.id,
                            file: new File([fileBlob], file.file_name),
                            tag: AttachmentState.ORIGINAL,
                        };
                    })
                );
                setAttachments(resolvedAttachment);
                setValue("original_attachments", resolvedAttachment);
            },
        }
    );

    useEffect(() => {
        // console.log(attachments);
        setValue("attachments", attachments);
    }, [attachments]);

    // 초기 렌더링 시에만 기본 데이터 조회
    useEffect(() => {
        if (router.isReady && id !== null) {
            refetchOriginalData();
        }
    }, [router.isReady]);

    // [ 기본 값 조회 Query ]
    const {
        data: contractData,
        isSuccess: isOriginalDataSuccess,
        refetch: refetchOriginalData,
    } = useQuery(
        ["getContractOneById"],
        () =>
            contractService.getContractOneById({
                id: parseInt(id),
            }),
        {
            enabled: false,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const {
                    client: { id: client_id, name: client_name },
                    project: { id: project_id, name: project_name },
                    name,
                    delivery_date,
                    contract_period_start,
                    contract_period_end,
                    contract_date,
                    sales_representative,
                    license_document_date,
                    contract_amount,
                    supply_amount,
                    including_vat,
                    performance_guarantee_rate,
                    defect_performance_guarantee_rate,
                    defect_warranty_period_start,
                    defect_warranty_period_end,
                    payment_method,
                    advance_payment_guarantee_rate,
                    advance_payment,
                    advance_payment_claim_date,
                    installment_payment,
                    installment_payment_claim_date,
                    remaining_balance,
                    remaining_balance_claim_date,
                } = data.contract_by_pk;

                setValue("client", { label: client_name, value: client_id });
                setValue("project", {
                    label: project_name,
                    value: project_id,
                });
                setValue("name", name);
                setValue("delivery_date", dayjs(delivery_date));
                setValue("contract_period_start", dayjs(contract_period_start));
                setValue("contract_period_end", dayjs(contract_period_end));
                setValue("contract_date", dayjs(contract_date));
                setValue("sales_representative", {
                    label: sales_representative.name,
                    value: sales_representative.id,
                });
                license_document_date &&
                    setValue(
                        "license_document_date",
                        dayjs(license_document_date)
                    );
                setValue(
                    "contract_amount",
                    removeCurrencyOfMoney(contract_amount)
                );
                setValue("supply_amount", removeCurrencyOfMoney(supply_amount));
                setValue(
                    "defect_performance_guarantee_rate",
                    defect_performance_guarantee_rate
                );
                setValue("including_vat", removeCurrencyOfMoney(including_vat));

                setValue(
                    "performance_guarantee_rate",
                    performance_guarantee_rate
                );
                setValue(
                    "defect_warranty_period_start",
                    dayjs(defect_warranty_period_start)
                );
                setValue(
                    "defect_warranty_period_end",
                    dayjs(defect_warranty_period_end)
                );
                setValue("payment_method", payment_method);
                setValue(
                    "advance_payment_guarantee_rate",
                    advance_payment_guarantee_rate
                );

                setValue(
                    "advance_payment",
                    removeCurrencyOfMoney(advance_payment)
                );
                setValue(
                    "advance_payment_claim_date",
                    advance_payment_claim_date &&
                        dayjs(advance_payment_claim_date)
                );
                setValue(
                    "installment_payment",
                    removeCurrencyOfMoney(installment_payment)
                );
                setValue(
                    "installment_payment_claim_date",
                    installment_payment_claim_date &&
                        dayjs(installment_payment_claim_date)
                );
                setValue(
                    "remaining_balance",
                    removeCurrencyOfMoney(remaining_balance)
                );
                setValue(
                    "remaining_balance_claim_date",
                    remaining_balance_claim_date &&
                        dayjs(remaining_balance_claim_date)
                );

                setTotalAmount(`${removeCurrencyOfMoney(supply_amount)} 원`);

                // setRemainingAmount(
                //     `${moneyFormat(
                //         removeCommaOfMoney(supply_amount) -
                //             (moneyToNumber(getValues("advance_payment")) || 0) -
                //             (moneyToNumber(getValues("installment_payment")) ||
                //                 0) -
                //             (moneyToNumber(getValues("remaining_balance")) || 0)
                //     )} 원`
                // );

                if (license?.common_code[0].code) {
                    // getFinalEstimateRefetch();
                    // getSalesRepresentativeRefetch();
                    setHasFinalEstimate(true);
                    attachmentRefetch();
                }
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
            enabled: isOriginalDataSuccess,
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

    // 전체 최종 견적서
    const [hasFinalEstimate, setHasFinalEstimate] = useState<boolean>(false);
    const [finalEstimates, setFinalEstimates] = useState<
        { label: string; value: number }[]
    >([]);

    const { refetch: getFinalEstimateRefetch, data: allFinalEstimateData } =
        useQuery(
            ["getFinalEstimate"],
            () =>
                estimateService.getFinalEstimateByProject({
                    project_id: getValues("project.value"),
                    type_code: license?.common_code[0].code!,
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
                                setValue("supply_amount", "");
                                resetField("final_estimate");
                                setTotalAmount("원");
                                setRemainingAmount("원");
                            } else if (
                                name === "project" &&
                                type !== "change"
                            ) {
                                clearErrors("project");

                                setValue(
                                    "contract_amount",
                                    removeCurrencyOfMoney(
                                        data.estimate[0].total_price
                                    )
                                );
                                setValue(
                                    "supply_amount",
                                    removeCurrencyOfMoney(
                                        data.estimate[0].total_price
                                    )
                                );

                                setTotalAmount(
                                    `${removeCurrencyOfMoney(
                                        data.estimate[0].total_price
                                    )} 원`
                                );
                                setRemainingAmount(
                                    `${removeCurrencyOfMoney(
                                        data.estimate[0].total_price
                                    )} 원`
                                );
                            }

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
                        setValue(
                            "supply_amount",
                            removeCurrencyOfMoney(data.estimate[0].total_price)
                        );
                        setValue("final_estimate", {
                            label: data.estimate[0].case_name,
                            value: data.estimate[0].id,
                        });
                        setTotalAmount(
                            `${removeCurrencyOfMoney(
                                data.estimate[0].total_price
                            )} 원`
                        );
                        setRemainingAmount(
                            `${removeCurrencyOfMoney(
                                data.estimate[0].total_price
                            )} 원`
                        );

                        // 최종 견적서가 없는 경우
                    } else if (finalEstimate.length <= 0) {
                        setFinalEstimates([]);
                        setHasFinalEstimate(false);
                        setTotalAmount("원");
                        setRemainingAmount("원");
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
            //  값을 선택해서 변경한 경우
            if (
                name === "project" &&
                type === "change" &&
                getValues("project.value")
            ) {
                getFinalEstimateRefetch();
                getSalesRepresentativeRefetch();
                resetField("contract_amount");
                resetField("supply_amount");
                resetField("sales_representative");
                setTotalAmount(
                    `${removeCurrencyOfMoney(getValues("supply_amount"))} 원`
                );

                // 필드의 'X' 버튼으로 값을 리셋한 경우
            } else if (name === "project" && type === "change") {
                resetField("contract_amount");
                resetField("supply_amount");
                resetField("sales_representative");
                setTotalAmount("원");
                setRemainingAmount("원");
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("project")]);

    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (name === "final_estimate" && type === "change") {
                setHasFinalEstimate(true);
                clearErrors("project");

                const final = allFinalEstimateData?.estimate.find(item => {
                    return item.id === getValues("final_estimate.value");
                });

                if (final) {
                    setValue(
                        "contract_amount",
                        removeCurrencyOfMoney(final.total_price)
                    );
                    setValue(
                        "supply_amount",
                        removeCurrencyOfMoney(final.total_price)
                    );
                    setValue("final_estimate", {
                        label: final.case_name,
                        value: final.id,
                    });

                    setTotalAmount(
                        `${removeCurrencyOfMoney(final.total_price)} 원`
                    );
                    setRemainingAmount(
                        `${removeCurrencyOfMoney(final.total_price)} 원`
                    );
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
                type_code: license?.common_code[0].code!,
                client_id: getValues("client.value"),
                project_id: getValues("project.value"),
                name: getValues("name"),

                // ------------------------ [ 기본정보 - 납부관련 ] ----------------------------------
                delivery_date: getValues("delivery_date")?.toDate(),
                contract_period_start: getValues(
                    "contract_period_start"
                ).toDate(),
                contract_period_end: getValues("contract_period_end")?.toDate(),
                contract_date: getValues("contract_date").toDate(),
                license_document_date: getValues(
                    "license_document_date"
                )?.toDate(),
                contract_amount: removeCommaOfMoney(
                    getValues("contract_amount")
                ),
                supply_amount: removeCommaOfMoney(getValues("supply_amount")),
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
                payment_method: getValues("payment_method"),
                sales_representative_id: getValues(
                    "sales_representative.value"
                ),
                // ------------------------------ [ 대금 청구 ] -------------------------------------
                // 선급금 ----
                advance_payment_guarantee_rate: parseFloat(
                    `${getValues("advance_payment_guarantee_rate")}`
                ),
                advance_payment: removeCommaOfMoney(
                    getValues("advance_payment")
                ),
                advance_payment_claim_date: getValues(
                    "advance_payment_claim_date"
                )?.toDate(),
                // 중도금 ----
                installment_payment: removeCommaOfMoney(
                    getValues("installment_payment")
                ),
                installment_payment_claim_date: getValues(
                    "installment_payment_claim_date"
                )?.toDate(),
                // 잔금 ----
                remaining_balance: removeCommaOfMoney(
                    getValues("remaining_balance")
                ),
                remaining_balance_claim_date: getValues(
                    "remaining_balance_claim_date"
                )?.toDate(),
                // ------------------------------- [ 첨부문서 ] -------------------------------------
                final_estimate_document_id: getValues("final_estimate.value"),
                // attachments: [],
                // -------------------------------- [ 상태 ] ---------------------------------------
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                await editAttachments(
                    getValues("original_attachments"),
                    getValues("attachments"),
                    user.id,
                    data.updateContract.id,
                    attachmentCode!.common_code[0].code
                );

                router.push(
                    `${PATH.LICENSE.CONTRACT.MAIN}/${data.updateContract.id}`
                );
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    // '부가세 포함' Field 자동 입력 함수
    // 기본 부가세 :  공급금액의 10%
    useEffect(() => {
        getValues("supply_amount") === ""
            ? setValue("including_vat", "")
            : setValue(
                  "including_vat",
                  moneyFormat(
                      Math.floor(
                          removeCommaOfMoney(getValues("supply_amount")) * 1.1
                      )
                  )
              );

        setTotalAmount(
            `${removeCurrencyOfMoney(getValues("supply_amount"))} 원`
        );
    }, [watch("supply_amount")]);

    useEffect(() => {
        setRemainingAmount(
            `${moneyFormat(
                moneyToNumber(getValues("supply_amount") || "0") -
                    moneyToNumber(getValues("advance_payment") || "0") -
                    moneyToNumber(getValues("installment_payment") || "0") -
                    moneyToNumber(getValues("remaining_balance") || "0")
            )} 원`
        );
    }, [
        watch([
            "advance_payment",
            "installment_payment",
            "remaining_balance",
            "supply_amount",
        ]),
    ]);

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

    const onClickUpdate = () => {
        if (
            license?.common_code[0].code &&
            getValues("attachments") &&
            getValues("attachments")!.length !== 0
        ) {
            updateContractOneMutation();
        } else if (getValues("attachments")!.length === 0) {
            alert("첨부문서를 등록해주세요.");
        }
    };

    const onClickCancel = () => {
        router.push(`${PATH.LICENSE.CONTRACT.MAIN}/${id}`);
    };

    return (
        <VLicenseContractEditForm
            control={control}
            register={register}
            errors={errors}
            clientOptions={GetCompanyOptionsByType([CompanyType.CLIENT])}
            projectOptions={projectOptions}
            salesRepresentativeOptions={salesRepresentativeOptions}
            finalEstimateOptions={finalEstimates}
            onClickUpdate={handleSubmit(onClickUpdate)}
            onClickCancel={onClickCancel}
            attachments={attachments}
            setAttachments={setAttachments}
            hasFinalEstimate={hasFinalEstimate}
            total_amount={totalAmount}
            remaining_amount={remainingAmount}
            {...props}
        />
    );
};

export default LicenseContractEditForm;
