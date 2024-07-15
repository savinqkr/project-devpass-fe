import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IEmployeeForm {
    export interface IProps {}

    export interface IVProps extends IProps {
        register: UseFormRegister<IEmployeeForm.IForm>;
        control: Control<IEmployeeForm.IForm, any>;
        errors: FieldErrors<IEmployeeForm.IForm>;
        onClickSubmit: () => void;
        // company
        companyOptions: { value: string; label: string }[];
        // roles
        roleOptions: { value: string; label: string }[];
        roles: {
            value: string;
            label: string;
        }[];
        onClickAddRoleChip: () => void;
        handleDeleteRoleChip: (role: { value: string; label: string }) => void;
    }
    export interface IForm {
        name: string; // 이름
        department: string; // 부서
        position: string; // 직함
        email: string; // 이메일
        contact: string; // 연락처
        phone: string; // 휴대폰 번호
        note: string; // 비고
        // selectedCompany: string; // 선택된 회사 ID ( selector value )
        selectedCompany: {
            label: string;
            value: number | string;
        };
        selectedRole: string; // 선택된 역할 CODE ( selector value )
    }
}
