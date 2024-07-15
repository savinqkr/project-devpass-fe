import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { ProductType } from "@enums";
import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ISalesRegisterForm {
    export interface IProps {
        type: ProductType;
    }
    export interface IVProps extends IProps {
        onClickSubmit: () => void;
        register: UseFormRegister<ISalesRegisterForm.IForm>;
        errors: FieldErrors<ISalesRegisterForm.IForm>;
        control: Control<IForm, any>;
        clientOptions: { label: string; value: number }[];
        projectOptions: { label: string; value: number }[];
        salesEmployeeOptions: { label: string; value: string }[];
        partnerOptions: { label: string; value: number }[];

        isDisabledPartnerName: boolean;

        salesTypeOptions: { label: string; value: string }[];
        partnerTypeOptions: { label: string; value: string }[];
        purchaseTypeOptions: { label: string; value: string }[];

        contract_amount: string;
        remaining_amount: string;

        licenseDocument: IAttachmentInput.IAttachment[] | undefined;
        setLicenseDocument: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
        inspectionDocument: IAttachmentInput.IAttachment[] | undefined;
        setInspectionDocument: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
    }

    export interface IForm {
        // common_type_code: number; // 공통 타입 코드
        client: {
            label: string;
            value: number;
        }; // 고객사 아이디
        project: {
            label: string;
            value: number;
        }; // 사업 아이디

        // -------------------------------------------------------------------------- 검수
        audit_date: Dayjs; // 검수일
        free_maintenance_start_date: Dayjs; // 무상유지보수 시작일
        maintenance_duration: string; // 유지보수기간
        license_document: IAttachmentInput.IAttachment[] | undefined; // 라이선스 증서
        original_license_document: IAttachmentInput.IAttachment[] | undefined;
        inspection_document: IAttachmentInput.IAttachment[] | undefined; // 검수서류
        original_inspection_document:
            | IAttachmentInput.IAttachment[]
            | undefined;

        // -------------------------------------------------------------------------- 매출 기본정보
        sales_type: number; // 매출 구분
        sales_representative_id: number; // 영업 담당자 아이디
        partner_type_code: number; // 파트너사 종류 코드
        partner_name: {
            label: string;
            value: number;
        };

        purchase_type_code: number; // 구매구분 코드
        product_type: string; // 제품종류

        // -------------------------------------------------------------------------- 매출
        first_sales: string; // 매출1
        first_sales_claim_date: Dayjs; // 매출일자1
        second_sales: string; // 매출2
        second_sales_claim_date: Dayjs; // 매출일자2
        last_sales: string; // 매출3
        last_sales_claim_date: Dayjs; // 매출일자3

        // -------------------------------------------------------------------------- 매입
        first_purchase: string; // 매입1
        first_purchase_claim_date: Dayjs; // 매입일자1
        second_purchase: string; // 매입2
        second_purchase_claim_date: Dayjs; // 매입일자2
        last_purchase: string; // 매입3
        last_purchase_claim_date: Dayjs; // 매입일자3
        purchase_partner: {
            label: string;
            value: number;
        }; // 매입 파트너사 아이디
    }
}
