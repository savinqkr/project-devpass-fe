import { ILicenseContractDetailsTable } from "./LicenseContractDetailsTable.interface";
import VLicenseContractDetailsTable from "./LicenseContractDetailsTable.view";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import contractService from "@domains/contract/services/graphql/contract.service";
import { useState } from "react";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import dayjs from "dayjs";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import downloadModalState from "@recoils/download-modal.atom";
import { useRecoilState } from "recoil";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import estimateService from "@domains/estimate/services/estimate.service";
import { CodeCategory } from "src/enums/code_category.enum";
import { Box } from "@mui/material";
import { EstimateDetailsOptionTypeEnum, ProductType } from "@enums";
import codeService from "@common/services/code/code.service";
import { TextareaCell } from "@common/components";

const LicenseContractDetailsTable: React.FC<
    ILicenseContractDetailsTable.IProps
> = props => {
    const router = useRouter();
    const id: string = router.query.id as string;

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    const [contract, setContract] = useState<
        ILicenseContractDetailsTable.IContract | undefined
    >();

    const dateFormat = (date: Date) => {
        return date ? dayjs(date).format("YYYY년 MM월 DD일") : date;
    };

    // 계약 정보 조회
    const { data: contractData } = useQuery(
        ["getContractOneById"],
        () => contractService.getContractOneById({ id: parseInt(id) }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                setContract({
                    id: data.contract_by_pk.id,
                    client: data.contract_by_pk.client.name,
                    project: data.contract_by_pk.project.name,
                    name: data.contract_by_pk.name,
                    delivery_date: dateFormat(
                        data.contract_by_pk.delivery_date
                    ),
                    contract_period_start: dateFormat(
                        data.contract_by_pk.contract_period_start
                    ),
                    contract_period_end: dateFormat(
                        data.contract_by_pk.contract_period_end
                    ),
                    contract_date: dateFormat(
                        data.contract_by_pk.contract_date
                    ),
                    license_document_date: dateFormat(
                        data.contract_by_pk.license_document_date
                    ),
                    contract_amount: removeCurrencyOfMoney(
                        data.contract_by_pk.contract_amount
                    ),
                    supply_amount: removeCurrencyOfMoney(
                        data.contract_by_pk.supply_amount
                    ),
                    including_vat: removeCurrencyOfMoney(
                        data.contract_by_pk.including_vat
                    ),
                    is_canceled: data.contract_by_pk.project.is_canceled,
                    sales_representative:
                        data.contract_by_pk.sales_representative.name,

                    performance_guarantee_rate:
                        data.contract_by_pk.performance_guarantee_rate,
                    defect_performance_guarantee_rate:
                        data.contract_by_pk.defect_performance_guarantee_rate,
                    defect_warranty_period_start: dateFormat(
                        data.contract_by_pk.defect_warranty_period_start
                    ),
                    defect_warranty_period_end: dateFormat(
                        data.contract_by_pk.defect_warranty_period_end
                    ),
                    payment_method: data.contract_by_pk.payment_method,
                    advance_payment_guarantee_rate:
                        data.contract_by_pk.advance_payment_guarantee_rate,
                    advance_payment: removeCurrencyOfMoney(
                        data.contract_by_pk.advance_payment
                    ),
                    advance_payment_claim_date: dateFormat(
                        data.contract_by_pk.advance_payment_claim_date
                    ),
                    installment_payment: removeCurrencyOfMoney(
                        data.contract_by_pk.installment_payment
                    ),
                    installment_payment_claim_date: dateFormat(
                        data.contract_by_pk.installment_payment_claim_date
                    ),
                    remaining_balance: removeCurrencyOfMoney(
                        data.contract_by_pk.remaining_balance
                    ),
                    remaining_balance_claim_date: dateFormat(
                        data.contract_by_pk.remaining_balance_claim_date
                    ),

                    deleted_at: data.contract_by_pk.deleted_at,
                });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ----------------------------- [ P R O D U C T  T A B L E ] ----------------------------------
    var [detailsRows, setDetailsRows] = useState<GridRowsProp>([]);
    var detailsColumns: GridColDef[] = [
        { width: 50, headerName: "No.", field: "id" },
        { width: 200, headerName: "구분", field: "type" },
        { width: 100, headerName: "용도", field: "purpose" },
        { width: 100, headerName: "Class", field: "class" },
        { width: 240, headerName: "품목명", field: "name" },
        {
            field: EstimateDetailsOptionTypeEnum.DETAILS,
            headerName: "세부내역",
            width: 280,
            type: "string",
            renderCell: params => <TextareaCell {...params} />,
        },
        { width: 80, headerName: "단위", field: "unit" },
        { width: 80, headerName: "수량", field: "amount" },
        { width: 180, headerName: "단가", field: "price" },
        { width: 180, headerName: "기준금액", field: "standard_price" },
        { width: 180, headerName: "공급금액", field: "supply_price" },
        // {
        //     width: 180,
        //     headerName: "월유지보수금액",
        //     field: "monthly_repair_price",
        // },
        // {
        //     width: 180,
        //     headerName: "총유지보수금액",
        //     field: "total_repair_price",
        // },
        {
            field: EstimateDetailsOptionTypeEnum.NOTE,
            headerName: "비고",
            width: 240,
            type: "string",
            renderCell: params => <TextareaCell {...params} />,
        },
    ];

    const onClickRow = (id: number) => {
        router.push(`${PATH.LICENSE.CONTRACT.MAIN}/${id}`);
    };

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- [ A T T A C H M E N T ] ------------------------------------
    const [attachment, setAttachment] =
        useState<ILicenseContractDetailsTable.IAttachment>();

    const [isAttachmentOpen, setIsAttachmentOpen] =
        useRecoilState(downloadModalState);

    const handleAttachmentOpen = (
        attachment: ILicenseContractDetailsTable.IAttachment
    ) => {
        setAttachment(attachment);
        setIsAttachmentOpen(true);
    };

    const handleAttachmentClose = () => {
        setIsAttachmentOpen(false);
        setAttachment(undefined);
    };

    // 첨부파일 조회
    const [attachments, setAttachments] = useState<
        Array<ILicenseContractDetailsTable.IAttachment>
    >([]);
    const {} = useQuery(
        ["getAttachmentData"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id),
            }),
        {
            enabled: !!id,
            onSuccess(data) {
                let attachmentTemp: Array<ILicenseContractDetailsTable.IAttachment> =
                    [];

                data.attachment.forEach(file => {
                    if (file.type.value === AttachmentType.CONTRACT) {
                        attachmentTemp.push({
                            id: file.id,
                            name: file.file_name,
                            path: file.file_path,
                        });
                        setAttachments(attachmentTemp);
                    }
                });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------- [ L I C E N S E  D O C U M E N T ] ------------------------------

    const [isLicenseDocumentOpen, setIsLicenseDocumentOpen] =
        useState<boolean>(false);

    const handleLicenseDocumentOpen = () => {
        setIsLicenseDocumentOpen(true);
    };

    const handleLicenseDocumentClose = () => {
        setIsLicenseDocumentOpen(false);
    };
    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ E S T I M A T E S ] -------------------------------------

    const { data: license } = useQuery(["getLicenseCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: ProductType.LICENSE },
            },
        })
    );

    const [finalEstimate, setFinalEstimate] = useState<number>();

    const [isFinalEstimateOpen, setIsFinalEstimateOpen] =
        useState<boolean>(false);

    const handleFinalEstimateOpen = () => {
        setIsFinalEstimateOpen(true);
    };

    const handleFinalEstimateClose = () => {
        setIsFinalEstimateOpen(false);
        setFinalEstimate(undefined);
    };

    const {} = useQuery(
        ["getEstimatesData"],
        () =>
            estimateService.getFinalEstimateByProject({
                project_id: contractData?.contract_by_pk.project.id!,
                type_code: license?.common_code[0].code!,
            }),
        {
            enabled: Boolean(
                license && contractData?.contract_by_pk.project.id
            ),
            onSuccess(data) {
                const details = data.estimate[0].details
                    .sort((a, b) => a.row_index - b.row_index)
                    .map((item, idx) => {
                        // console.log(item.details);

                        return {
                            id: idx + 1,
                            pk: item.product + idx,
                            name: item.product,
                            purpose: item.purpose,
                            class: item.class,
                            type: item.type,
                            details: item.details,
                            unit: item.unit,
                            amount: item.amount,
                            price: `${removeCurrencyOfMoney(item.price)}원`,
                            note: item.note,
                            supply_price: `${removeCurrencyOfMoney(
                                item.supply_price
                            )}원`,
                            standard_price: `${removeCurrencyOfMoney(
                                item.standard_price
                            )}원`,
                            // monthly_repair_price: `${removeCurrencyOfMoney(
                            //     item.monthly_repair_price
                            // )}원`,
                            // total_repair_price: `${removeCurrencyOfMoney(
                            //     item.total_repair_price
                            // )}원`,
                        };
                    });

                setDetailsRows(details);

                setFinalEstimate(data.estimate[0].id);
            },
        }
    );

    return (
        <VLicenseContractDetailsTable
            contract={contract}
            onClickRow={onClickRow}
            detailsColumns={detailsColumns.map(item => {
                return {
                    ...item,
                    field: item.field,
                    headerName: item.headerName,
                    flex: item.flex,
                    width: item.width,
                    sortable: false,
                    align: "center",
                    headerAlign: "center",
                };
            })}
            detailsRows={detailsRows}
            isAttachmentOpen={isAttachmentOpen}
            handleAttachmentOpen={handleAttachmentOpen}
            handleAttachmentClose={handleAttachmentClose}
            attachment={attachment}
            attachmentData={attachments}
            isFinalEstimateOpen={isFinalEstimateOpen}
            handleFinalEstimateOpen={handleFinalEstimateOpen}
            handleFinalEstimateClose={handleFinalEstimateClose}
            finalEstimate={finalEstimate}
            isLicenseDocumentOpen={isLicenseDocumentOpen}
            handleLicenseDocumentClose={handleLicenseDocumentClose}
            handleLicenseDocumentOpen={handleLicenseDocumentOpen}
            {...props}
        />
    );
};

export default LicenseContractDetailsTable;
