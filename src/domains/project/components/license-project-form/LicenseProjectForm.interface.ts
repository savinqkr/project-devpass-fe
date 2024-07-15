import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
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

export namespace ILicenseProjectForm {
    export interface IProps {
        register: UseFormRegister<ILicenseProjectForm.IForm>;
        control: Control<ILicenseProjectForm.IForm, any>;
        watch: UseFormWatch<ILicenseProjectForm.IForm>;
        errors: FieldErrors<ILicenseProjectForm.IForm>;
        setValue: UseFormSetValue<ILicenseProjectForm.IForm>;
        getValues: UseFormGetValues<ILicenseProjectForm.IForm>;
        partnerRows: readonly GridValidRowModel[];
        setPartnerRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        employeeRows: readonly GridValidRowModel[];
        setEmployeeRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        onClickSubmit: () => void;
    }
    export interface IVProps extends IProps {
        // SELECTOR 옵션
        clientOptions: {
            label: string;
            value: number;
        }[];
        companyOptions: {
            label: string;
            value: number;
        }[];
        roleOptions: {
            label: string;
            value: number;
        }[];
        employeeOptions: {
            label: string;
            value: number;
        }[];
        // 파트너사 그리드
        partnerApiRef: MutableRefObject<GridApiCommunity>;
        partnerColumns: GridColDef[];
        onClickAddPartner: () => void;
        onClickRemovePartner: () => void;
        // 담당자 그리드
        employeeApiRef: MutableRefObject<GridApiCommunity>;
        employeeColumns: GridColDef[];
        onClickAddEmployee: () => void;
        onClickRemoveEmployee: () => void;
    }
    export interface IForm {
        name: string; // 사업명
        client_id: {
            label: string;
            value: number;
        }; // 고객사 ID
        contractor_id: {
            label: string;
            value: number;
        }; // 계약사 ID
        start_date: Dayjs; // 사업 기간 ( 시작일 )
        end_date: Dayjs; // 사업 기간 ( 종료일 )
        optrans_date: Dayjs; // 운영 전환일
        inspect_date: Dayjs; // 검수일
        free_start_date: Dayjs; // 무상 기간 ( 시작일 )
        free_end_date: Dayjs; // 무상 기간 ( 종료일 )
        participate_type?: string;
        note?: string; // 비고
        selected_partner: {
            label: string;
            value: number | string;
        };
        selected_company: {
            label: string;
            value: number | string;
        };
        selected_role: {
            label: string;
            value: number | string;
        };
        selected_employee: {
            label: string;
            value: number | string;
        };
    }
}
