import { ProductType } from "@enums";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export namespace ILicenseContractDetailsTable {
    export interface IProps {
        type: ProductType;
    }
    export interface IVProps extends IProps {
        contract: IContract | undefined;
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        detailsRows: readonly GridValidRowModel[];
        detailsColumns: GridColDef[];
        // 최종 견적서
        isFinalEstimateOpen: boolean;
        handleFinalEstimateOpen: () => void;
        handleFinalEstimateClose: () => void;
        finalEstimate: number | undefined;
    }
    export interface IContract {
        id: number;
        client: string; // 고객사
        project: string; //사업
        contractor: string; // 계약사
        name: string; // 계약명
        contract_period_start: string; // 계약기간 (시작)
        contract_period_end: string; // 계약기간 (종료)
        contract_date: string; // 계약일
        contract_amount: string; // 계약금액
        including_vat: string; // 부가세 포함
        performance_guarantee_rate: number; // 계약이행보증요율
        defect_performance_guarantee_rate: number; // 하자이행보증요율
        defect_warranty_period_start: string; // 하자이행보증기간 (시작)
        defect_warranty_period_end: string; // 하자이행보증기간 (종료)
        sales_representative: string;

        is_canceled: boolean;
        issuance_method: string; // 발행 방법
        issuing_site: string; // 발행 사이트
        inspection_target: string; // 검수등록 대상
        inspection_site: string; // 검수 사이트
        monthly_standard_amount: string; // 매월 기준 금액
        billing_cycle: string; // 청구 주기
        billing_amount_once: string; // 1회 청구 금액
        billing_date: string; // 계산서 발행일
        payment_timing: string; // 입금 시기
        note: string; // 비고

        deleted_at: Date;
    }

    export interface IAttachment {
        id: number;
        name: string;
        path: string;
    }
}
