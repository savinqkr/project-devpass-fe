import { IGetEstimateByPkQuery } from "@domains/estimate/services/estimate.service.interface";
import {
    GridColDef,
    GridEventListener,
    GridRowsProp,
    GridValidRowModel,
} from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dayjs } from "dayjs";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import {
    Control,
    FieldErrors,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";

export namespace ILicenseEstimateForm {
    export interface IProps {
        register: UseFormRegister<ILicenseEstimateForm.IForm>;
        control: Control<ILicenseEstimateForm.IForm, any>;
        watch: UseFormWatch<ILicenseEstimateForm.IForm>;
        getValues: UseFormGetValues<ILicenseEstimateForm.IForm>;
        setValue: UseFormSetValue<ILicenseEstimateForm.IForm>;
        errors: FieldErrors<ILicenseEstimateForm.IForm>;
        onClickSubmit: () => void;
        rows: GridRowsProp;
        setRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        detailsApiRef: MutableRefObject<GridApiCommunity>;
        // originalEstimateData?: IGetEstimateByPkQuery.IOutput;
        // isAutoCompleteActivated: boolean;
        // setIsAutoCompleteActivated: Dispatch<SetStateAction<boolean>>;
        // removeOriginalEstimateDataCache?: () => void;
    }
    export interface IVProps extends IProps {
        // SELECTOR 옵션
        clientOptions: {
            label: string;
            value: number;
        }[];
        projectOptions: {
            label: string;
            value: number;
        }[];
        employeeOptions: string[];
        headEmployeeOptions: {
            label: string;
            value: number;
        }[];
        tailOptions: {
            label: string;
            value: number;
        }[];
        // // 부가세포함 CheckBox
        // vatChecked: boolean;
        // handleVat: (event: any) => void;
        // // 특별 할인 금액 CheckBox
        // specialDiscountChecked: boolean;
        // handleSpecialDiscount: (event: any) => void;
        // 세부내역 DataGrid
        columns: GridColDef[];
        detailsApiRef: MutableRefObject<GridApiCommunity>;
        handleClickAddRow: () => void;
        handleClickDeleteRow: () => void;
        onCellEditStart: GridEventListener<"cellEditStart">;
    }
    export interface IForm {
        project_id: {
            label: string;
            value: number | string;
        }; // 라이선스 사업
        employee_name: string; // 담당자 이름
        employee_email: string; // 담당자 이메일
        employee_contact: string; // 담당자 연락처
        employee_phone: string; // 담당자 핸드폰번호
        head_employee_name: string; // 본사 견적 담당자 담당자 이름
        head_employee_email: string; // 본사 견적 담당자 담당자 이메일
        head_employee_contact: string; // 본사 견적 담당자 담당자 연락처
        destination: string; // 수신처 ( 기본 - 담당자 X : 고객사 / 담당자 O : 담당자의 회사 )
        doc_num: string; // 문서번호 ( D2TYYYYMMDD-NNN )
        case_name: string; // 건명 ( 기본 - 고객사명 + 사업명 )
        estimate_date: Dayjs; // 견적일자 ( 기본 - 오늘 )
        validity: Dayjs; // 유효기간 ( 기본 - 오늘 + 30일 )
        estimate_price: string; // 견적 금액
        vat_include: boolean; // 부가세포함 여부
        discount_rate: number; // 할인율
        total_price: string; // 총 공급금액 ( 부가세포함 X )
        add_special_discount: boolean; // 특별 할인 금액 적용 여부
        special_discount_price: string; // 특별 할인 금액
        total_price_vat: string; // 총 공급금액 ( 부가세포함 O )
        tail: string; // TAIL
        selected_client: {
            label: string;
            value: number | string;
        };
        // selected_employee: {
        //     label: string;
        //     value: number | string;
        // };
        selected_head_employee: {
            label: string;
            value: number | string;
        };
        selected_tail: {
            label: string;
            value: number | string;
        };
    }
    export interface IDetailForm {
        id: number;
        type: string; // 구분
        purpose?: string; // 용도
        class?: string; // 클래스
        product?: string; // 품목명
        details?: string; // 세부내역
        unit?: string; // 단위
        amount: number; // 수량
        price?: number; // 단가
        standard_price?: number; // 기준금액
        supply_price?: number; // 공급금액
        note?: string;
    }
}
