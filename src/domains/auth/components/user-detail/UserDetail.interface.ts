import { IGetEmployeeByPkQuery } from "@domains/employee/services/employee.service.interface";

export namespace IUserDetail {
    export interface IProps {}
    export interface IVProps extends IProps {
        userData: IGetEmployeeByPkQuery.IOutput | undefined;
        onClickDeleteUser: () => void;
        onClickEditUser: () => void;
    }
    export interface IForm {}
}
