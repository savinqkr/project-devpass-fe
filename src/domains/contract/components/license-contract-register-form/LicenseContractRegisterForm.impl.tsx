import { useForm } from "react-hook-form";
import { ILicenseContractRegisterForm } from "./LicenseContractRegisterForm.interface";
import VLicenseContractRegisterForm from "./LicenseContractRegisterForm.view";
import { useMutation, useQuery } from "react-query";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import contractService from "@domains/contract/services/graphql/contract.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useEffect, useState } from "react";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import moneyFormat from "@hooks/moneyFommat";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { CodeCategory } from "src/enums/code_category.enum";
import { GetCompanyOptionsByType } from "@domains/contract/hooks";
import projectService from "@domains/project/service/project.service";
import editAttachments from "@utils/editAttachments";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import estimateService from "@domains/estimate/services/estimate.service";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import dayjs from "dayjs";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { ProductType } from "@enums";
import codeService from "@common/services/code/code.service";
import moneyToNumber from "@utils/moneyToNumber";

const LicenseContractRegisterForm: React.FC<
    ILicenseContractRegisterForm.IProps
> = props => {
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
    } = useForm<ILicenseContractRegisterForm.IForm>();

    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    const [attachments, setAttachments] =
        useState<IAttachmentInput.IAttachment[]>();

    const [projectOptions, setProjectOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const [salesEmployeeOptions, setSalesEmployeeOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const [hasFinalEstimate, setHasFinalEstimate] = useState<boolean>(false);

    const [finalEstimates, setFinalEstimates] = useState<
        { label: string; value: number }[]
    >([]);

    const [totalAmount, setTotalAmount] = useState<string>("원");

    const [remainingAmount, setRemainingAmount] = useState<string>("원");

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ CommonCode - ATTACHMENT_TYPE - 공통코드 ]
    const { data: attachmentCode } = useQuery(["getAttachmentCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                value: { _eq: AttachmentType.CONTRACT },
            },
        })
    );

    // [ CommonCode - COMMON_TYPE - 공통코드 ]
    const { data: license } = useQuery(["getLicenseCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: ProductType.LICENSE },
            },
        })
    );

    // [ Project - 사업 ]
    const { refetch: refetchProjects } = useQuery(
        ["get all projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
                    is_canceled: { _eq: false },
                    deleted_at: { _is_null: true },
                    type: {
                        value: {
                            _eq: ProductType.LICENSE,
                        },
                    },
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
                    const contract = project.contracts?.find(
                        item => item.deleted_at === null
                    );
                    !contract?.id &&
                        projectList.push({
                            label: project.name,
                            value: project.id,
                        });
                });

                setProjectOptions(projectList);
            },
        }
    );

    // [ sales_representative - 영업 담당자 ]
    const { refetch: getSalesRepresentativeRefetch } = useQuery(
        ["getSalesRepresentative"],
        () =>
            projectService.getProjectByPk({
                id: getValues("project").value,
            }),
        {
            enabled: false,
            onSuccess(data) {
                // console.log(data);
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

                setSalesEmployeeOptions(salesEmployeeList);

                // 사업에 포함된 '영업 담당자' 역할을 가진 담당자가 1명인 경우 default value로 set
                salesEmployeeList.length === 1 &&
                    setValue("sales_representative", {
                        label: salesEmployeeList[0].label,
                        value: salesEmployeeList[0].value,
                    });
            },
        }
    );

    // [ final_estimate - 최종 견적서 ]
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
                    // console.log(license);
                    const finalEstimate = data.estimate.filter(item => {
                        return item.deleted_at == null;
                    });

                    // 최종견적서가 1개 이상인 경우
                    if (finalEstimate.length > 1) {
                        clearErrors("project.value");
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
                        setValue("supply_amount", "");
                        resetField("final_estimate");
                        setTotalAmount("원");
                        setRemainingAmount("원");

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
                        setValue("final_estimate.value", data.estimate[0].id);
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

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ 계약 등록 - registerContract ]
    const { mutate: registerContractOneMutation } = useMutation(
        ["registerContractOne"],
        () =>
            contractService.registerContractOne({
                // ------------------------------ [ 기본정보 ] --------------------------------------
                type_code: license?.common_code[0].code!,
                client_id: getValues("client.value"),
                project_id: getValues("project.value"),
                name: getValues("name"),

                // ------------------------ [ 기본정보 - 납부관련 ] ----------------------------------
                delivery_date: getValues("delivery_date").toDate(),
                contract_period_start: getValues(
                    "contract_period_start"
                )?.toDate(),
                contract_period_end: getValues("contract_period_end").toDate(),

                contract_amount: removeCommaOfMoney(
                    getValues("contract_amount")
                ),
                contract_date: getValues("contract_date").toDate(),
                license_document_date: getValues(
                    "license_document_date"
                )?.toDate(),
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
                // 해당 섹션 수정 예정
                final_estimate_document_id: getValues("final_estimate.value"),
                // attachments: [],
                // -------------------------------- [ 상태 ] ---------------------------------------
                created_by: user.id,
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                // console.log(getValues("attachments"));
                // console.log(loginUser);
                // console.log(attachmentCode!.common_code[0].code);
                await editAttachments(
                    getValues("original_attachments"),
                    getValues("attachments"),
                    loginUser!.id!,
                    data.registerContract.id,
                    attachmentCode!.common_code[0].code
                );

                router.push(
                    `${PATH.LICENSE.CONTRACT.MAIN}/${data.registerContract.id}`
                );
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- [ U S E  E F F E C T ] -------------------------------------
    // ---------------------------------------------------------------------------------------------
    // [ WATCH ( 고객사 - client ) ]
    useEffect(() => {
        refetchProjects();
        resetField("project");
        resetField("sales_representative");
        resetField("contract_amount");
        resetField("supply_amount");
        setFinalEstimates([]);
        resetField("final_estimate");
        setTotalAmount("원");
        setRemainingAmount("원");
    }, [watch("client")]);

    // [ WATCH ( 사업 - project ) ]
    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (name === "project" && type === "change") {
                getValues("project.value") && getFinalEstimateRefetch();
                getValues("project.value") && getSalesRepresentativeRefetch();
                resetField("contract_amount");
                resetField("supply_amount");
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("project")]);

    // [ WATCH ( 선급금, 중도금, 잔금 - advance_payment, installment_payment, remaining_balance ) ]
    useEffect(() => {
        setRemainingAmount(
            `${moneyFormat(
                moneyToNumber(totalAmount) -
                    (moneyToNumber(getValues("advance_payment")) || 0) -
                    (moneyToNumber(getValues("installment_payment")) || 0) -
                    (moneyToNumber(getValues("remaining_balance")) || 0)
            )} 원`
        );
    }, [
        watch([
            "supply_amount",
            "advance_payment",
            "installment_payment",
            "remaining_balance",
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

    // [ WATCH ( 첨부파일 - attachment ) ]
    useEffect(() => {
        setValue("attachments", attachments);
    }, [attachments]);

    // [ WATCH ( 최종견적서 - final_estimate ) ]
    useEffect(() => {
        if (allFinalEstimateData) {
            const estimate = allFinalEstimateData.estimate.find(item => {
                return getValues("final_estimate.value") === item.id;
            });

            if (estimate) {
                setHasFinalEstimate(true);
                clearErrors("project");

                setValue(
                    "contract_amount",
                    removeCurrencyOfMoney(estimate.total_price)
                );
                setValue(
                    "supply_amount",
                    removeCurrencyOfMoney(estimate.total_price)
                );
                setValue("final_estimate.value", estimate.id);
            }
        }
    }, [watch("final_estimate")]);

    // [ WATCH ( 공급금액 - supply_amount) ]
    useEffect(() => {
        // '부가세 포함'
        // 기본 부가세 : { 계약금액 ? 공급금액 }의 10% =>
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

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ S E T T I N G ] ----------------------------------------
    // ---------------------------------------------------------------------------------------------
    const onClickSubmit = () => {
        if (
            license?.common_code[0].code &&
            !!getValues("attachments") &&
            getValues("attachments")!.length !== 0 &&
            hasFinalEstimate
        ) {
            registerContractOneMutation();
        } else if (getValues("attachments")!.length == 0) {
            alert("첨부문서를 등록해주세요.");
        }
    };

    return (
        <VLicenseContractRegisterForm
            control={control}
            register={register}
            errors={errors}
            clientOptions={GetCompanyOptionsByType([CompanyType.CLIENT])}
            projectOptions={projectOptions}
            salesEmployeeOptions={salesEmployeeOptions}
            onClickSubmit={handleSubmit(onClickSubmit)}
            attachments={attachments}
            setAttachments={setAttachments}
            hasFinalEstimate={hasFinalEstimate}
            finalEstimateOptions={finalEstimates}
            total_amount={totalAmount}
            remaining_amount={remainingAmount}
            {...props}
        />
    );
};

export default LicenseContractRegisterForm;
