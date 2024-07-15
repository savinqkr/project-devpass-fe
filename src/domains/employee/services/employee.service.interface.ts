import {
    GetAllUsersQuery,
    GetAllEmployeesQuery,
    GetEmployeeByPkQuery,
    DeleteEmployeeByPkMutation,
    RegisterEmployeeMutation,
    EditEmployeeByPkMutation,
    GetAllUserAndEmployeeQuery,
} from "./graphql";

export namespace IGetAllUserAndEmployeeQuery {
    export interface IInput extends GetAllUserAndEmployeeQuery.IVariable {}
    export interface IOutput extends GetAllUserAndEmployeeQuery.IResponse {}
}
export namespace IGetAllUsersQuery {
    export interface IInput extends GetAllUsersQuery.IVariable {}
    export interface IOutput extends GetAllUsersQuery.IResponse {}
}
export namespace IGetAllEmployeesQuery {
    export interface IInput extends GetAllEmployeesQuery.IVariable {}
    export interface IOutput extends GetAllEmployeesQuery.IResponse {}
}
export namespace IGetEmployeeByPkQuery {
    export interface IInput extends GetEmployeeByPkQuery.IVariable {}
    export interface IOutput extends GetEmployeeByPkQuery.IResponse {}
}
export namespace IDeleteEmployeeByPkMutation {
    export interface IInput extends DeleteEmployeeByPkMutation.IVariable {}
    export interface IOutput extends DeleteEmployeeByPkMutation.IResponse {}
}
export namespace IRegisterEmployeeMutation {
    export interface IInput extends RegisterEmployeeMutation.IVariable {}
    export interface IOutput extends RegisterEmployeeMutation.IResponse {}
}
export namespace IEditEmployeeByPkMutation {
    export interface IInput extends EditEmployeeByPkMutation.IVariable {}
    export interface IOutput extends EditEmployeeByPkMutation.IResponse {}
}

export interface IEmployeeService {
    getAllUserAndEmployee(
        where: IGetAllUserAndEmployeeQuery.IInput
    ): Promise<IGetAllUserAndEmployeeQuery.IOutput>;
    getAllUsers(
        where: IGetAllUsersQuery.IInput
    ): Promise<IGetAllUsersQuery.IOutput>;
    getAllEmployees(
        where: IGetAllEmployeesQuery.IInput
    ): Promise<IGetAllEmployeesQuery.IOutput>;
    getEmployeeByPk(
        args: IGetEmployeeByPkQuery.IInput
    ): Promise<IGetEmployeeByPkQuery.IOutput>;
    deleteEmployeeByPk(
        args: IDeleteEmployeeByPkMutation.IInput
    ): Promise<IDeleteEmployeeByPkMutation.IOutput>;
    registerEmployee(
        args: IRegisterEmployeeMutation.IInput
    ): Promise<IRegisterEmployeeMutation.IOutput>;
    editEmployeeByPk(
        args: IEditEmployeeByPkMutation.IInput
    ): Promise<IEditEmployeeByPkMutation.IOutput>;
}
