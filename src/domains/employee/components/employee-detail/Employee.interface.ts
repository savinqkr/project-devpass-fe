import { IGetEmployeeByPkQuery } from "@domains/employee/services/employee.service.interface";

export namespace IEmployeeDetail {
    export interface IProps {}
    export interface IVProps extends IProps {
        employeeData: IGetEmployeeByPkQuery.IOutput | undefined;
    }
    export interface IForm {}
}
