import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ISalesRegisterForm } from "./SalesRegisterForm.interface";
import VSalesRegisterForm from "./SalesRegisterForm.view";
import { useMutation, useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useEffect, useState } from "react";
import getCommonCodeByCategory from "@common/hooks/getCommonCodeByCategory";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import salesService from "@domains/sales/services/sales.service";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import PATH from "@constants/path";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import contractService from "@domains/contract/services/graphql/contract.service";
import { AttachmentState, ProductType } from "@enums";
import editAttachments from "@utils/editAttachments";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { IOrder_By } from "src/codegen/graphql";
import fetchFile from "@utils/fetchFile";
import dayjs from "dayjs";
import moneyToNumber from "@utils/moneyToNumber";
import moneyFormat from "@hooks/moneyFommat";
import codeService from "@common/services/code/code.service";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";

const SalesRegisterForm: React.FC<ISalesRegisterForm.IProps> = props => {
    const {
        getValues,
        handleSubmit,
        register,
        control,
        watch,
        setValue,
        resetField,
        setFocus,
        formState: { errors },
    } = useForm<ISalesRegisterForm.IForm>({ shouldFocusError: true });

    const { type } = props;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    const router = useRouter();

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ C O N T R A C T ] ---------------------------------------
    const [contractAmount, setContractAmount] = useState<string>("원");
    const [remainingAmount, setRemainingAmount] = useState<string>("원");

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S E L E C T ] -----------------------------------------
    const [clientOptions, setClientOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [salesEmployeeOptions, setSalesEmployeeOptions] = useState<
        { label: string; value: string }[]
    >([]);
    const [projectOptions, setProjectOptions] = useState<
        { label: string; value: number }[]
    >([]);
    const [partnerOptions, setPartnerOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const [isDisabledPartnerName, setIsDisabledPartnerName] =
        useState<boolean>(true);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    const { data: licenseDocumentCode } = useQuery(
        ["getLicenseDocumentCommonCode"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                    value: { _eq: AttachmentType.LICENSE_CERTIFICATE },
                },
            })
    );

    const { data: inspectionDocumentCode } = useQuery(
        ["getInspectionDocumentCommonCode"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                    value: { _eq: AttachmentType.INSPECTION },
                },
            })
    );

    const { data: partnerTypeCode, isSuccess: isPartnerTypeCodeSuccess } =
        useQuery(
            ["getPartnerTypeCode"],
            () =>
                codeService.getCommonCode({
                    where: {
                        category: { _eq: CodeCategory.PARTNER_TYPE },
                        value: { _eq: "D" },
                    },
                }),
            {
                enabled: true,
            }
        );
    // # ------------------------------- [ Client - 고객사 ] ---------------------------------------#
    const {} = useQuery(
        ["getAllClientQuery"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _eq: CompanyType.CLIENT,
                        },
                    },
                },
            }),
        {
            onSuccess(data) {
                var list: { label: string; value: number }[] = [];
                data.map(client => {
                    client?.deleted_at === null &&
                        list.push({ label: client!.name, value: client!.id });
                });
                setClientOptions(list);
                setPartnerOptions(list);
            },
        }
    );

    // # -------------------------------- [ Project - 사업 ] ---------------------------------------#

    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    const { refetch: refetchProjects } = useQuery(
        ["get all projects"],
        () =>
            projectService.getAllProjectsByType({
                where: {
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
                    const sales = project.sales.find(item => {
                        return item.deleted_at === null;
                    });

                    // console.log(project.contracts.length);

                    project.deleted_at === null &&
                        project.contracts.length > 0 &&
                        !sales &&
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
        resetField("project");
        resetField("sales_representative_id");
        resetField("partner_type_code");
        resetField("partner_name");
        setContractAmount("원");
        setRemainingAmount("원");
        setIsDisabledPartnerName(true);
    }, [watch("client")]);

    // # -------------------------------- [ 라이선스 증서 ] ---------------------------------------#
    const { refetch: getLicenseCertificateRefetch } = useQuery(
        ["getLicenseCertificate"],
        () =>
            attachmentService.getAllAttachment({
                where: {
                    parent_id: { _eq: getValues("project.value") },
                    type: {
                        value: { _eq: AttachmentType.LICENSE_CERTIFICATE },
                    },
                },
                order_by: [
                    {
                        created_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: false,
            async onSuccess(data) {
                if (data.attachment[0]) {
                    const { id, file_name } = data.attachment[0];

                    const fileBlob = await fetchFile(id, file_name);

                    const resolvedAttachment = {
                        id: id,
                        file: new File([fileBlob], file_name),
                        tag: AttachmentState.NEW,
                    };
                    setLicenseDocument([resolvedAttachment]);
                }
            },
        }
    );

    // project 값 선택 시 해당 사업의 라이선스 증서 조회
    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (name === "project" && type === "change") {
                getLicenseCertificateRefetch();

                commonType?.common_code[0].code && getSelectedProject();

                resetField("partner_name");
                resetField("partner_type_code");
                setIsDisabledPartnerName(true);
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("project")]);

    useEffect(() => {
        setRemainingAmount(
            `${moneyFormat(
                moneyToNumber(contractAmount) -
                    (moneyToNumber(getValues("first_sales")) || 0) -
                    (moneyToNumber(getValues("second_sales")) || 0) -
                    (moneyToNumber(getValues("last_sales")) || 0)
            )} 원`
        );
    }, [watch(["first_sales", "second_sales", "last_sales"])]);

    // [ project - 선택한 사업 조회 ]
    const { refetch: getSelectedProject } = useQuery(
        ["getContractByProjectId"],
        () =>
            contractService.getAllContract({
                where: {
                    type: {
                        value: {
                            _like: type,
                        },
                    },
                    deleted_at: {
                        _is_null: true,
                    },
                    _or: [
                        {
                            project: {
                                id: {
                                    _eq:
                                        typeof getValues("project.value") ===
                                        "number"
                                            ? getValues("project.value")
                                            : undefined,
                                },
                            },
                        },
                    ],
                },
            }),
        {
            enabled: false,
            onSuccess(data) {
                const contract = data[0];

                if (contract) {
                    // [ 무상유지보수 기간 ]
                    const freeDuration = dayjs(
                        contract.project.free_end_date
                    ).diff(dayjs(contract.project.free_start_date), "M");

                    if (contract.project.free_start_date) {
                        setValue(
                            "maintenance_duration",
                            `${freeDuration} 개월`
                        );

                        setValue(
                            "free_maintenance_start_date",
                            dayjs(contract.project.free_start_date)
                        );
                    }

                    // 총 계약금액 | 잔여 금액 ( 총 계약금액 - 매출 1,2,3 금액 )
                    setContractAmount(
                        `${removeCurrencyOfMoney(contract.contract_amount)} 원`
                    );
                    // setRemainingAmount(contract.contract_amount);
                    setRemainingAmount(
                        `${removeCurrencyOfMoney(contract.contract_amount)} 원`
                    );

                    // [ 영업 담당자 ]
                    if (contract.sales_representative.deleted_at === null) {
                        const { id, name } = contract.sales_representative;

                        setSalesEmployeeOptions([
                            { label: name, value: id.toString() },
                        ]);

                        setValue("sales_representative_id", id);
                    }
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    const { mutate: registerSalesMutation } = useMutation(
        ["registerSalesMutation"],
        () =>
            salesService.registerSales({
                common_type_code: commonType!.common_code[0].code,
                client_id: getValues("client.value"),
                project_id: getValues("project.value"),

                audit_date: getValues("audit_date")?.toDate(),
                free_maintenance_start_date: getValues(
                    "free_maintenance_start_date"
                )?.toDate(),
                maintenance_duration: getValues("maintenance_duration"),

                sales_type: getValues("sales_type"),
                sales_representative_id: getValues("sales_representative_id"),
                partner_type_code: getValues("partner_type_code"),
                partner_name: getValues("partner_name.label"),
                purchase_type_code: getValues("purchase_type_code"),
                product_type: getValues("product_type"),

                first_sales: removeCommaOfMoney(getValues("first_sales")),
                first_sales_claim_date: getValues(
                    "first_sales_claim_date"
                )?.toDate(),
                second_sales: removeCommaOfMoney(getValues("second_sales")),
                second_sales_claim_date: getValues(
                    "second_sales_claim_date"
                )?.toDate(),
                last_sales: removeCommaOfMoney(getValues("last_sales")),
                last_sales_claim_date: getValues(
                    "last_sales_claim_date"
                )?.toDate(),

                first_purchase: removeCommaOfMoney(getValues("first_purchase")),
                first_purchase_claim_date: getValues(
                    "first_purchase_claim_date"
                )?.toDate(),
                second_purchase: removeCommaOfMoney(
                    getValues("second_purchase")
                ),
                second_purchase_claim_date: getValues(
                    "second_purchase_claim_date"
                )?.toDate(),
                last_purchase: removeCommaOfMoney(getValues("last_purchase")),
                last_purchase_claim_date: getValues(
                    "last_purchase_claim_date"
                )?.toDate(),
                purchase_partner_id:
                    typeof getValues("purchase_partner.value") === "string"
                        ? undefined
                        : getValues("purchase_partner.value"),
                created_by: user.id,
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                await editAttachments(
                    getValues("original_license_document"),
                    getValues("license_document"),
                    user.id,
                    data.registerSales.id,
                    licenseDocumentCode!.common_code[0].code
                );

                await editAttachments(
                    getValues("original_inspection_document"),
                    getValues("inspection_document"),
                    user.id,
                    data.registerSales.id,
                    inspectionDocumentCode!.common_code[0].code
                );

                if (type === ProductType.LICENSE) {
                    router.push(
                        `${PATH.LICENSE.SALES.MAIN}/${data.registerSales.id}`
                    );
                } else if (type === ProductType.SERVICE) {
                    router.push(
                        `${PATH.TECHSUPPORT.SALES.MAIN}/${data.registerSales.id}`
                    );
                } else if (type === ProductType.CUSTOMIZE) {
                    router.push(
                        `${PATH.CUSTOMIZE.SALES.MAIN}/${data.registerSales.id}`
                    );
                } else if (type === ProductType.MAINTENANCE) {
                    router.push(
                        `${PATH.REPAIR.SALES.MAIN}/${data.registerSales.id}`
                    );
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------- [ P A R T N E R  N A M E ] ----------------------------------
    // '파트너사 종류'가 P1, P2인 경우, '파트너사 명' 필드 disabled 해제
    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (
                name === "partner_type_code" &&
                type === "change" &&
                isPartnerTypeCodeSuccess
            ) {
                if (
                    value.partner_type_code ===
                    partnerTypeCode?.common_code[0].code
                ) {
                    resetField("partner_name");
                    setIsDisabledPartnerName(true);
                } else {
                    setIsDisabledPartnerName(false);
                }
            }
            return () => formWatch.unsubscribe();
        });
    }, [watch("partner_type_code"), isPartnerTypeCodeSuccess]);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ A T T A C H M E N T ] --------------------------------
    const [licenseDocument, setLicenseDocument] =
        useState<IAttachmentInput.IAttachment[]>();

    const [inspectionDocument, setInspectionDocument] =
        useState<IAttachmentInput.IAttachment[]>();

    useEffect(() => {
        setValue("license_document", licenseDocument);
    }, [licenseDocument]);

    useEffect(() => {
        setValue("inspection_document", inspectionDocument);
    }, [inspectionDocument]);

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S U B M I T ] -----------------------------------------

    const onClickSubmit: SubmitHandler<ISalesRegisterForm.IForm> = form => {
        // console.log(getValues("client_id"));
        // console.log(getValues("project_id"));

        // console.log(getValues("audit_date"));
        // console.log(getValues("free_maintenance_start_date"));
        // console.log(getValues("maintenance_duration"));
        // console.log(getValues("license_certificate"));
        // console.log(getValues("inspection_document"));

        // console.log(getValues("sales_type"));
        // console.log(getValues("sales_representative_id"));
        // console.log(getValues("partner_type_code"));
        // console.log(getValues("purchase_type_code"));
        // console.log(getValues("product_type"));

        // console.log(getValues("first_sales"));
        // console.log(getValues("first_sales_claim_date"));
        // console.log(getValues("second_sales"));
        // console.log(getValues("second_sales_claim_date"));
        // console.log(getValues("last_sales"));
        // console.log(getValues("last_sales_claim_date"));

        // console.log(getValues("first_purchase"));
        // console.log(getValues("first_purchase_claim_date"));
        // console.log(getValues("second_purchase"));
        // console.log(getValues("second_purchase_claim_date"));
        // console.log(getValues("last_purchase"));
        // console.log(getValues("last_purchase_claim_date"));
        // console.log(getValues("purchase_partner_id"));

        // console.log(commonType?.common_code[0].code);
        registerSalesMutation();
    };

    return (
        <VSalesRegisterForm
            onClickSubmit={handleSubmit(onClickSubmit)}
            errors={errors}
            register={register}
            control={control}
            clientOptions={clientOptions}
            salesTypeOptions={getCommonCodeByCategory("sales_type")}
            salesEmployeeOptions={salesEmployeeOptions}
            partnerTypeOptions={getCommonCodeByCategory("partner_type")}
            purchaseTypeOptions={getCommonCodeByCategory("purchase_type")}
            partnerOptions={partnerOptions}
            isDisabledPartnerName={isDisabledPartnerName}
            projectOptions={projectOptions}
            contract_amount={contractAmount}
            remaining_amount={remainingAmount}
            licenseDocument={licenseDocument}
            setLicenseDocument={setLicenseDocument}
            inspectionDocument={inspectionDocument}
            setInspectionDocument={setInspectionDocument}
            {...props}
        />
    );
};

export default SalesRegisterForm;
