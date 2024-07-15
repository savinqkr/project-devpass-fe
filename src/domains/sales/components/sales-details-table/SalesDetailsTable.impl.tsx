import { ISalesDetailsTable } from "./SalesDetailsTable.interface";
import VSalesDetailsTable from "./SalesDetailsTable.view";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import salesService from "@domains/sales/services/sales.service";
import { useState } from "react";
import dayjs from "dayjs";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import PATH from "@constants/path";
import { ProductType } from "@enums";

const SalesDetailsTable: React.FC<ISalesDetailsTable.IProps> = props => {
    const router = useRouter();
    const id = router.query.id as string;

    const { type } = props;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    var [sales, setSales] = useState<ISalesDetailsTable.ISales>();

    const formatDate = (date: Date) =>
        date ? dayjs(date).format("YYYY년 MM월 DD일") : undefined;

    const {} = useQuery(
        ["getOneSalesById"],
        () => salesService.getOneSalesById({ id: parseInt(id) }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                // console.log(data);
                const {
                    client,
                    project,
                    sales_type,
                    sales_representative,
                    partner_type,
                    partner_name,
                    purchase_type,
                    product_type,
                } = data.sales_by_pk;

                var salesData: ISalesDetailsTable.ISales = {
                    client: client?.name,
                    project: project?.name,
                    audit_date: formatDate(data.sales_by_pk.audit_date),
                    free_maintenance_start_date: formatDate(
                        data.sales_by_pk.free_maintenance_start_date
                    ),
                    is_canceled: data.sales_by_pk.project.is_canceled,
                    maintenance_duration: data.sales_by_pk.maintenance_duration,
                    sales_type: sales_type?.value,
                    sales_representative: sales_representative?.name,
                    partner_type: partner_type?.value,
                    partner_name,
                    purchase_type: purchase_type?.value,
                    product_type,
                    first_sales: removeCurrencyOfMoney(
                        data.sales_by_pk.first_sales
                    ),
                    first_sales_claim_date: formatDate(
                        data.sales_by_pk.first_sales_claim_date
                    ),
                    second_sales: removeCurrencyOfMoney(
                        data.sales_by_pk.second_sales
                    ),
                    second_sales_claim_date: formatDate(
                        data.sales_by_pk.second_sales_claim_date
                    ),
                    last_sales: removeCurrencyOfMoney(
                        data.sales_by_pk.last_sales
                    ),
                    last_sales_claim_date: formatDate(
                        data.sales_by_pk.last_sales_claim_date
                    ),
                    first_purchase: removeCurrencyOfMoney(
                        data.sales_by_pk.first_purchase
                    ),
                    first_purchase_claim_date: formatDate(
                        data.sales_by_pk.first_purchase_claim_date
                    ),
                    second_purchase: removeCurrencyOfMoney(
                        data.sales_by_pk.second_purchase
                    ),
                    second_purchase_claim_date: formatDate(
                        data.sales_by_pk.second_purchase_claim_date
                    ),
                    last_purchase: removeCurrencyOfMoney(
                        data.sales_by_pk.last_purchase
                    ),
                    last_purchase_claim_date: formatDate(
                        data.sales_by_pk.last_purchase_claim_date
                    ),
                    purchase_partner: data.sales_by_pk.purchase_partner?.name,
                    deleted_at: data.sales_by_pk.deleted_at,
                };

                setSales(salesData);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------- [ A T T A C H M E N T ] -------------------------------------
    // ---------------- license document
    const [licenseDocument, setLicenseDocument] =
        useState<ISalesDetailsTable.IAttachment>();

    const [isLicenseDocumentOpen, setIsLicenseDocumentOpen] =
        useState<boolean>(false);

    const handleLicenseDocumentOpen = (
        licenseDocument: ISalesDetailsTable.IAttachment
    ) => {
        setLicenseDocument(licenseDocument);
        setIsLicenseDocumentOpen(true);
    };

    const handleLicenseDocumentClose = () => {
        setIsLicenseDocumentOpen(false);
        setLicenseDocument(undefined);
    };
    // ------------------ 첨부파일 조회
    const [licenseDocuments, setLicenseDocuments] = useState<
        Array<ISalesDetailsTable.IAttachment>
    >([]);

    // inspection document
    const [inspectionDocument, setInspectionDocument] =
        useState<ISalesDetailsTable.IAttachment>();

    const [isInspectionDocumentOpen, setInspectionDocumentOpen] =
        useState<boolean>(false);

    const handleInspectionDocumentOpen = (
        inspectionDocument: ISalesDetailsTable.IAttachment
    ) => {
        setInspectionDocument(inspectionDocument);
        setInspectionDocumentOpen(true);
    };

    const handleInspectionDocumentClose = () => {
        setInspectionDocumentOpen(false);
        setInspectionDocument(undefined);
    };
    const [inspectionDocuments, setInspectionDocuments] = useState<
        Array<ISalesDetailsTable.IAttachment>
    >([]);

    //

    const {} = useQuery(
        ["getAttachmentData"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id),
            }),
        {
            enabled: !!id,
            onSuccess(data) {
                // console.log(data);
                let licenseDocumentTemp: Array<ISalesDetailsTable.IAttachment> =
                    [];
                let inspectionDocumentTemp: Array<ISalesDetailsTable.IAttachment> =
                    [];

                data.attachment.forEach(file => {
                    if (
                        file.type.value === AttachmentType.LICENSE_CERTIFICATE
                    ) {
                        licenseDocumentTemp.push({
                            id: file.id,
                            name: file.file_name,
                            path: file.file_path,
                        });
                        setLicenseDocuments(licenseDocumentTemp);
                    } else if (file.type.value === AttachmentType.INSPECTION) {
                        inspectionDocumentTemp.push({
                            id: file.id,
                            name: file.file_name,
                            path: file.file_path,
                        });
                        setInspectionDocuments(inspectionDocumentTemp);
                    }
                });
            },
        }
    );

    const { mutate: deleteSalesByIdMutation } = useMutation(
        ["deleteSalesById"],
        () =>
            salesService.deleteSalesById({
                id: parseInt(id),
                deleted_by: user.id,
            }),
        {
            onSuccess(data) {
                if (type === ProductType.LICENSE) {
                    router.push(`${PATH.LICENSE.SALES.MAIN}`);
                } else if (type === ProductType.SERVICE) {
                    router.push(`${PATH.TECHSUPPORT.SALES.MAIN}`);
                } else if (type === ProductType.CUSTOMIZE) {
                    router.push(`${PATH.CUSTOMIZE.SALES.MAIN}`);
                } else if (type === ProductType.MAINTENANCE) {
                    router.push(`${PATH.REPAIR.SALES.MAIN}`);
                }
            },
        }
    );

    const onClickDeleted = () => {
        if (window.confirm(`${type} 검수 & 매출을 삭제하시겠습니까?`)) {
            deleteSalesByIdMutation();
        }
    };

    const onClickUpdated = () => {
        if (type === ProductType.LICENSE) {
            router.push(`${PATH.LICENSE.SALES.EDIT}/${id}`);
        } else if (type === ProductType.SERVICE) {
            router.push(`${PATH.TECHSUPPORT.SALES.EDIT}/${id}`);
        } else if (type === ProductType.CUSTOMIZE) {
            router.push(`${PATH.CUSTOMIZE.SALES.EDIT}/${id}`);
        } else if (type === ProductType.MAINTENANCE) {
            router.push(`${PATH.REPAIR.SALES.EDIT}/${id}`);
        }
    };

    return (
        <VSalesDetailsTable
            sales={sales}
            // license document
            isLicenseDocumentOpen={isLicenseDocumentOpen}
            handleLicenseDocumentOpen={handleLicenseDocumentOpen}
            handleLicenseDocumentClose={handleLicenseDocumentClose}
            licenseDocument={licenseDocument}
            licenseDocumentData={licenseDocuments}
            // inspection document
            isInspectionDocumentOpen={isInspectionDocumentOpen}
            handleInspectionDocumentOpen={handleInspectionDocumentOpen}
            handleInspectionDocumentClose={handleInspectionDocumentClose}
            inspectionDocument={inspectionDocument}
            inspectionDocumentData={inspectionDocuments}
            //
            onClickDeleted={onClickDeleted}
            onClickUpdated={onClickUpdated}
            {...props}
        />
    );
};

export default SalesDetailsTable;
