import { IGetProjectByPkQuery } from "@domains/project/service/project.service.interface";
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

export namespace IRepairProjectForm {
    export interface IProps {
        register: UseFormRegister<IRepairProjectForm.IForm>;
        control: Control<IRepairProjectForm.IForm, any>;
        watch: UseFormWatch<IRepairProjectForm.IForm>;
        errors: FieldErrors<IRepairProjectForm.IForm>;
        setValue: UseFormSetValue<IRepairProjectForm.IForm>;
        getValues: UseFormGetValues<IRepairProjectForm.IForm>;
        licenseContractApiRef: MutableRefObject<GridApiCommunity>;
        employeeRows: readonly GridValidRowModel[];
        setEmployeeRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        onClickSubmit: () => void;
        originalProjectData?: IGetProjectByPkQuery.IOutput;
        isAutoCompleteActivated: boolean;
        setIsAutoCompleteActivated: Dispatch<SetStateAction<boolean>>;
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
        consultantOptions: {
            label: string;
            value: number;
        }[];
        inspectCycleOptions: {
            label: string;
            value: string;
        }[];
        inspectMethodOptions: {
            label: string;
            value: string;
        }[];
        // 파트너사 그리드
        licenseContractColumns: GridColDef[];
        licenseContractRows: readonly GridValidRowModel[];
        // 담당자 그리드
        employeeApiRef: MutableRefObject<GridApiCommunity>;
        employeeColumns: GridColDef[];
        onClickAddEmployee: () => void;
        onClickRemoveEmployee: () => void;
    }
    export interface IForm {
        name: string; // 유지보수 사업명
        client_id: {
            label: string;
            value: number | string;
        }; // 고객사 ID
        contractor_id: {
            label: string;
            value: number;
        }; // 계약사 ID
        start_date: Dayjs; //계약 기간 ( 시작일 )
        end_date: Dayjs; // 계약 기간 ( 종료일 )
        // 라이선스 도입 사업
        license_contracts: number[];
        // 담당자 ( 회사 | 역할 | 이름 )
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
        // 엔지니어(컨설턴트)
        selected_consultant: {
            label: string;
            value: number | string;
        };
        consultant_name: string;
        consultant_email: string;
        consultant_contact: string;
        consultant_phone: string;
        inspect_cycle: string;
        inspect_method: string;
        inspect_option: string;
        inspect_note: string;
        repair_rate: string;
        repair_last_year_rate: string;
    }
}
