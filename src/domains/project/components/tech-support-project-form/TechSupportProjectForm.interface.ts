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

export namespace ITechSupportProjectForm {
    export interface IProps {
        register: UseFormRegister<ITechSupportProjectForm.IForm>;
        control: Control<ITechSupportProjectForm.IForm, any>;
        watch: UseFormWatch<ITechSupportProjectForm.IForm>;
        errors: FieldErrors<ITechSupportProjectForm.IForm>;
        setValue: UseFormSetValue<ITechSupportProjectForm.IForm>;
        getValues: UseFormGetValues<ITechSupportProjectForm.IForm>;
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
        start_date: Dayjs; // 계약 기간 ( 시작일 )
        end_date: Dayjs; // 계약 기간 ( 종료일 )
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
