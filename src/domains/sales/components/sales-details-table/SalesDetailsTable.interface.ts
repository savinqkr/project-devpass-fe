import { ProductType } from "@enums";

export namespace ISalesDetailsTable {
    export interface IProps {
        type: ProductType;
    }
    export interface IVProps extends IProps {
        sales: ISales | undefined;
        // 라이선스 증서
        isLicenseDocumentOpen: boolean;
        handleLicenseDocumentOpen: (license: IAttachment) => void;
        handleLicenseDocumentClose: () => void;
        licenseDocument: IAttachment | undefined;
        licenseDocumentData: Array<IAttachment>;
        // 검수 서류
        isInspectionDocumentOpen: boolean;
        handleInspectionDocumentOpen: (license: IAttachment) => void;
        handleInspectionDocumentClose: () => void;
        inspectionDocument: IAttachment | undefined;
        inspectionDocumentData: Array<IAttachment>;
        //
        onClickDeleted: () => void;
        onClickUpdated: () => void;
    }

    export interface ISales {
        // common_type_code: number; // 공통 타입 코드
        client: string; // 고객사
        project: string; // 사업
        is_canceled: boolean;

        // -------------------------------------------------------------------------- 검수
        audit_date?: string; // 검수일
        free_maintenance_start_date?: string; // 무상유지보수 시작일
        maintenance_duration?: string; // 유지보수기간
        // license_certificate: IAttachmentInput.IAttachment[]; // 라이선스 증서
        // inspection_document: IAttachmentInput.IAttachment[]; // 검수서류

        // -------------------------------------------------------------------------- 매출 기본정보
        sales_type: string; // 매출 구분
        sales_representative: string; // 영업 담당자 아이디
        partner_type: string; // 파트너사 종류 코드
        partner_name: string;

        purchase_type: string; // 구매구분 코드
        product_type: string; // 제품종류

        // -------------------------------------------------------------------------- 매출
        first_sales?: string; // 매출1
        first_sales_claim_date?: string; // 매출일자1
        second_sales?: string; // 매출2
        second_sales_claim_date?: string; // 매출일자2
        last_sales?: string; // 매출3
        last_sales_claim_date?: string; // 매출일자3

        // -------------------------------------------------------------------------- 매입
        first_purchase?: string; // 매입1
        first_purchase_claim_date?: string; // 매입일자1
        second_purchase?: string; // 매입2
        second_purchase_claim_date?: string; // 매입일자2
        last_purchase?: string; // 매입3
        last_purchase_claim_date?: string; // 매입일자3
        purchase_partner?: string; // 매입 파트너사
        deleted_at: Date;
    }

    export interface IAttachment {
        id: number;
        name: string;
        path: string;
    }
}
