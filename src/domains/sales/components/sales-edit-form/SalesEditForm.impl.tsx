import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ISalesEditForm } from "./SalesEditForm.interface";
import VSalesEditForm from "./SalesEditForm.view";
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
import editDefaultValueFormatter from "@domains/sales/hooks/editDefaultValueFormatter";
import { CodeCategory } from "src/enums/code_category.enum";
import projectService from "@domains/project/service/project.service";
import contractService from "@domains/contract/services/graphql/contract.service";
import { AttachmentState, ProductType } from "@enums";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import fetchFile from "@utils/fetchFile";
import editAttachments from "@utils/editAttachments";
import codeService from "@common/services/code/code.service";
import moneyFormat from "@hooks/moneyFommat";
import moneyToNumber from "@utils/moneyToNumber";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";

const SalesEditForm: React.FC<ISalesEditForm.IProps> = props => {
    const {
        getValues,
        setValue,
        handleSubmit,
        register,
        control,
        watch,
        resetField,
        formState: { errors },
    } = useForm<ISalesEditForm.IForm>();

    const { type } = props;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    const router = useRouter();
    const id = router.query.id as string;

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
    // [ Client - 고객사 ]
    const {} = useQuery(
        ["getAllClientQuery"],
        () =>
            companyService.getCompanies({
                where: { type: { value: { _eq: CompanyType.CLIENT } } },
            }),
        {
            onSuccess(data) {
                var list = data.map(client => {
                    return { label: client!.name, value: client!.id };
                });
                setClientOptions(list);
                setPartnerOptions(list);
            },
        }
    );

    const { data: commonType, isSuccess } = useQuery(
        ["getCommonTypeQuery"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: {
                        _eq: CodeCategory.COMMON_TYPE,
                    },
                    value: {
                        _eq: type,
                    },
                },
            })
    );

    const { data: partnerTypeCode, isSuccess: isSuccessPartnerTypeCode } =
        useQuery(["getPartnerTypeCode"], () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.PARTNER_TYPE },
                    value: { _eq: "D" },
                },
            })
        );

    // [ Project - 사업 ]
    const { refetch: refetchProjects, isSuccess: projectSuccess } = useQuery(
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
            enabled: isSuccess,
            onSuccess(data) {
                var projectList: { label: string; value: number }[] =
                    data.project
                        .filter(item => {
                            return (
                                item.contracts.length > 0
                                //  &&
                                // item.sales.length === 0
                            );
                        })
                        .map(project => {
                            return {
                                label: project.name,
                                value: project.id,
                            };
                        });

                setProjectOptions(projectList);

                !licenseDocument && !inspectionDocument && attachmentRefetch();
            },
        }
    );

    useEffect(() => {
        commonType?.common_code[0].code && refetchProjects();

        const formWatch = watch((value, { name, type }) => {
            if (name === "client" && type === "change") {
                resetField("project");
                resetField("sales_representative_id");
                resetField("product_type");
                resetField("purchase_type_code");
                resetField("sales_type_code");
                resetField("partner_type_code");
                resetField("partner_name");
                resetField("free_maintenance_start_date");
                resetField("maintenance_duration");
                setContractAmount("원");
                setRemainingAmount("원");
                setIsDisabledPartnerName(true);
            }

            return () => formWatch.unsubscribe();
        });
    }, [watch("client")]);

    // [ sales_representative - 영업 담당자 ]
    const { refetch: getSalesRepresentativeRefetch } = useQuery(
        ["getContractByProjectId"],
        () =>
            contractService.getAllContract({
                where: {
                    type: {
                        value: {
                            _in: [type],
                        },
                    },
                    project: { id: { _eq: getValues("project.value") } },
                },
            }),
        {
            enabled: false,
            onSuccess(data) {
                const contract = data.find(item => {
                    return item?.deleted_at === null;
                });

                if (
                    contract &&
                    contract.sales_representative.deleted_at === null
                ) {
                    const { id, name } = contract.sales_representative;

                    setSalesEmployeeOptions([
                        { label: name, value: id.toString() },
                    ]);

                    setValue("sales_representative_id", id);
                }
            },
        }
    );

    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            // name === "project" && console.log(type);

            if (name === "project" && type === "change") {
                getSalesRepresentativeRefetch();
                console.log("change");
                resetField("project");
                resetField("sales_type_code");
                resetField("sales_representative_id");
                resetField("partner_type_code");
                resetField("partner_name");
                resetField("product_type");
                resetField("purchase_type_code");

                resetField("free_maintenance_start_date");
                resetField("maintenance_duration");
                setContractAmount("원");
                setRemainingAmount("원");
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

    // ---------------------------------------------------------------------------------------------
    // ------------------------------- [ P A R T N E R  N A M E ] ----------------------------------
    // '파트너사 종류'가 P1, P2인 경우, '파트너사 명' 필드 disabled 해제
    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (
                name === "partner_type_code" &&
                type === "change" &&
                isSuccessPartnerTypeCode
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
    }, [watch("partner_type_code"), isSuccessPartnerTypeCode]);

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // [ Default Value - 기본 값 ]
    const {} = useQuery(
        ["getSalesOneById"],
        () => salesService.getOneSalesById({ id: parseInt(id) }),
        {
            enabled: router.isReady && projectSuccess,
            onSuccess(data) {
                // console.log(data);
                const target = data.sales_by_pk;

                const fieldsToSet: {
                    key: string;
                    value: any;
                    type: "str" | "num" | "date" | "money";
                }[] = [
                    {
                        key: "client",
                        value: {
                            label: target.client.name,
                            value: target.client.id,
                        },
                        type: "str",
                    },
                    {
                        key: "project",
                        value: {
                            label: target.project.name,
                            value: target.project.id,
                        },
                        type: "str",
                    },
                    {
                        key: "audit_date",
                        value: target.audit_date,
                        type: "date",
                    },

                    {
                        key: "free_maintenance_start_date",
                        value: target.free_maintenance_start_date,
                        type: "date",
                    },
                    {
                        key: "maintenance_duration",
                        value: target.maintenance_duration,
                        type: "num",
                    },
                    {
                        key: "sales_type_code",
                        value: target.sales_type.code,
                        type: "num",
                    },
                    {
                        key: "purchase_type_code",
                        value: target.purchase_type.code,
                        type: "num",
                    },
                    {
                        key: "partner_type_code",
                        value: target.partner_type.code,
                        type: "num",
                    },
                    {
                        key: "product_type",
                        value: target.product_type,
                        type: "str",
                    },
                    {
                        key: "first_sales",
                        value: target.first_sales,
                        type: "money",
                    },

                    {
                        key: "first_sales_claim_date",
                        value: target.first_sales_claim_date,
                        type: "date",
                    },
                    {
                        key: "second_sales",
                        value: target.second_sales,
                        type: "money",
                    },
                    {
                        key: "second_sales_claim_date",
                        value: target.second_sales_claim_date,
                        type: "date",
                    },
                    {
                        key: "last_sales",
                        value: target.last_sales,
                        type: "money",
                    },

                    {
                        key: "last_sales_claim_date",
                        value: target.last_sales_claim_date,
                        type: "date",
                    },
                    {
                        key: "first_purchase",
                        value: target.first_purchase,
                        type: "money",
                    },
                    {
                        key: "first_purchase_claim_date",
                        value: target.first_purchase_claim_date,
                        type: "date",
                    },
                    {
                        key: "second_purchase",
                        value: target.second_purchase,
                        type: "money",
                    },
                    {
                        key: "second_purchase_claim_date",
                        value: target.second_purchase_claim_date,
                        type: "date",
                    },
                    {
                        key: "last_purchase",
                        value: target.last_purchase,
                        type: "money",
                    },
                    {
                        key: "last_purchase_claim_date",
                        value: target.last_purchase_claim_date,
                        type: "date",
                    },
                    {
                        key: "purchase_partner",
                        value: {
                            label: target.purchase_partner?.name,
                            value: target.purchase_partner?.id,
                        },
                        type: "str",
                    },
                ];

                editDefaultValueFormatter(fieldsToSet, setValue);

                getSalesRepresentativeRefetch();

                if (
                    target.partner_type.code ===
                    partnerTypeCode?.common_code[0].code
                ) {
                    setIsDisabledPartnerName(true);
                } else {
                    setIsDisabledPartnerName(false);

                    const partner = partnerOptions.find(item => {
                        return item.label === target.partner_name;
                    });

                    partner &&
                        setValue("partner_name", {
                            label: partner.label,
                            value: partner.value,
                        });
                }

                const contract = data.sales_by_pk.project.contracts.find(
                    item => {
                        return item.deleted_at === null;
                    }
                );

                if (contract) {
                    setContractAmount(
                        `${removeCurrencyOfMoney(contract?.contract_amount)} 원`
                    );

                    setRemainingAmount(
                        `${moneyFormat(
                            moneyToNumber(contractAmount) -
                                (moneyToNumber(getValues("first_sales")) || 0) -
                                (moneyToNumber(getValues("second_sales")) ||
                                    0) -
                                (moneyToNumber(getValues("last_sales")) || 0)
                        )} 원`
                    );
                }
            },
        }
    );

    // -------------------------------- [ attachment - 첨부문서 ] -----------------------------------
    const [licenseDocument, setLicenseDocument] =
        useState<IAttachmentInput.IAttachment[]>();
    const [inspectionDocument, setInspectionDocument] =
        useState<IAttachmentInput.IAttachment[]>();

    const { data: licenseDocumentCode } = useQuery(
        ["getLicenseDocumentCommonTypeQuery"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: {
                        _eq: CodeCategory.ATTACHMENT_TYPE,
                    },
                    value: {
                        _eq: AttachmentType.LICENSE,
                    },
                },
            })
    );

    const { data: inspectionDocumentCode } = useQuery(
        ["getInspectionDocumentCommonTypeQuery"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: {
                        _eq: CodeCategory.ATTACHMENT_TYPE,
                    },
                    value: {
                        _eq: AttachmentType.INSPECTION,
                    },
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
                //  LICENSE DOCUMENT
                let licenseDocument = data.attachment.filter(
                    item =>
                        item.type.value ===
                            AttachmentType.LICENSE_CERTIFICATE &&
                        item.deleted_at === null
                );

                //
                const resolvedLicenseDocument = await Promise.all(
                    licenseDocument.map(async file => {
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
                setLicenseDocument(resolvedLicenseDocument);
                setValue("original_license_document", resolvedLicenseDocument);

                // INSPECTION DOCUMENT
                let inspectionDocument = data.attachment.filter(
                    item =>
                        item.type.value === AttachmentType.INSPECTION &&
                        item.deleted_at === null
                );

                const resolvedInspectionDocument = await Promise.all(
                    inspectionDocument.map(async file => {
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
                setInspectionDocument(resolvedInspectionDocument);
                setValue(
                    "original_inspection_document",
                    resolvedInspectionDocument
                );
            },
        }
    );

    useEffect(() => {
        setValue("license_document", licenseDocument);
    }, [licenseDocument]);

    useEffect(() => {
        setValue("inspection_document", inspectionDocument);
    }, [inspectionDocument]);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------

    // [ Update - 수정 ]
    const { mutate: updatedSalesByIdMutation } = useMutation(
        ["updatedSalesMutation"],
        () =>
            salesService.updatedSalesById({
                id: parseInt(id),
                common_type_code: commonType!.common_code[0].code,
                client_id: getValues("client.value"),
                project_id: getValues("project.value"),

                audit_date: getValues("audit_date")?.toDate(),
                free_maintenance_start_date: getValues(
                    "free_maintenance_start_date"
                )?.toDate(),
                maintenance_duration: getValues("maintenance_duration"),

                sales_type: getValues("sales_type_code"),
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
                        ? null
                        : getValues("purchase_partner.value"),
                updated_by: user.id,
            }),
        {
            async onSuccess(data) {
                await editAttachments(
                    getValues("original_license_document"),
                    getValues("license_document"),
                    user.id,
                    data.updateSales.id,
                    licenseDocumentCode!.common_code[0].code
                );

                await editAttachments(
                    getValues("original_inspection_document"),
                    getValues("inspection_document"),
                    user.id,
                    data.updateSales.id,
                    inspectionDocumentCode!.common_code[0].code
                );

                if (type === ProductType.LICENSE) {
                    router.push(
                        `${PATH.LICENSE.SALES.MAIN}/${data.updateSales.id}`
                    );
                } else if (type === ProductType.SERVICE) {
                    router.push(
                        `${PATH.TECHSUPPORT.SALES.MAIN}/${data.updateSales.id}`
                    );
                } else if (type === ProductType.CUSTOMIZE) {
                    router.push(
                        `${PATH.CUSTOMIZE.SALES.MAIN}/${data.updateSales.id}`
                    );
                } else if (type === ProductType.MAINTENANCE) {
                    router.push(
                        `${PATH.REPAIR.SALES.MAIN}/${data.updateSales.id}`
                    );
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S U B M I T ] -----------------------------------------
    const onClickUpdate: SubmitHandler<ISalesEditForm.IForm> = form => {
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
        updatedSalesByIdMutation();
    };

    const onClickCancel = () => {
        if (type === ProductType.LICENSE) {
            router.push(`${PATH.LICENSE.SALES.MAIN}/${id}`);
        } else if (type === ProductType.SERVICE) {
            router.push(`${PATH.TECHSUPPORT.SALES.MAIN}/${id}`);
        } else if (type === ProductType.CUSTOMIZE) {
            router.push(`${PATH.CUSTOMIZE.SALES.MAIN}/${id}`);
        } else if (type === ProductType.MAINTENANCE) {
            router.push(`${PATH.REPAIR.SALES.MAIN}/${id}`);
        }
    };

    return (
        <VSalesEditForm
            onClickUpdate={handleSubmit(onClickUpdate)}
            onClickCancel={onClickCancel}
            errors={errors}
            register={register}
            control={control}
            clientOptions={clientOptions}
            salesTypeOptions={getCommonCodeByCategory("sales_type")}
            salesEmployeeOptions={salesEmployeeOptions}
            projectOptions={projectOptions}
            partnerTypeOptions={getCommonCodeByCategory("partner_type")}
            purchaseTypeOptions={getCommonCodeByCategory("purchase_type")}
            partnerOptions={partnerOptions}
            isDisabledPartnerName={isDisabledPartnerName}
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

export default SalesEditForm;
