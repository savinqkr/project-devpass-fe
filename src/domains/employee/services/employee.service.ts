import { GraphQLClient } from "graphql-request";
import {
    IDeleteEmployeeByPkMutation,
    IEmployeeService,
    IGetAllUsersQuery,
    IGetAllUserAndEmployeeQuery,
    IGetAllEmployeesQuery,
    IGetEmployeeByPkQuery,
    IRegisterEmployeeMutation,
    IEditEmployeeByPkMutation,
} from "./employee.service.interface";

import {
    GetAllUserAndEmployeeQuery,
    GetAllUsersQuery,
    GetAllEmployeesQuery,
    GetEmployeeByPkQuery,
    DeleteEmployeeByPkMutation,
    RegisterEmployeeMutation,
    EditEmployeeByPkMutation,
} from "./graphql";

class EmployeeService implements IEmployeeService {
    private static instance: EmployeeService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): EmployeeService {
        return this.instance || (this.instance = new this());
    }

    // 전체 사용자 & 직원 조회
    public async getAllUserAndEmployee(
        where: IGetAllUserAndEmployeeQuery.IInput
    ): Promise<IGetAllUserAndEmployeeQuery.IOutput> {
        try {
            const { employee } = await this.client.request<
                GetAllUserAndEmployeeQuery.IResponse,
                GetAllUserAndEmployeeQuery.IVariable
            >(GetAllUserAndEmployeeQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { employee };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 전체 사용자 조회
    public async getAllUsers(
        where: IGetAllUsersQuery.IInput
    ): Promise<IGetAllUsersQuery.IOutput> {
        try {
            const { employee } = await this.client.request<
                GetAllUsersQuery.IResponse,
                GetAllUsersQuery.IVariable
            >(GetAllUsersQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { employee };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 전체 담당자 조회
    public async getAllEmployees(
        where: IGetAllEmployeesQuery.IInput
    ): Promise<IGetAllEmployeesQuery.IOutput> {
        try {
            const { employee } = await this.client.request<
                GetAllEmployeesQuery.IResponse,
                GetAllEmployeesQuery.IVariable
            >(GetAllEmployeesQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { employee };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 직원 상세 조회
    public async getEmployeeByPk(
        args: IGetEmployeeByPkQuery.IInput
    ): Promise<IGetEmployeeByPkQuery.IOutput> {
        try {
            const { employee_by_pk } = await this.client.request<
                GetEmployeeByPkQuery.IResponse,
                GetEmployeeByPkQuery.IVariable
            >(GetEmployeeByPkQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { employee_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 직원 삭제
    public async deleteEmployeeByPk(
        args: IDeleteEmployeeByPkMutation.IInput
    ): Promise<IDeleteEmployeeByPkMutation.IOutput> {
        try {
            const { delete_employee_by_pk } = await this.client.request<
                DeleteEmployeeByPkMutation.IResponse,
                DeleteEmployeeByPkMutation.IVariable
            >(DeleteEmployeeByPkMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { delete_employee_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 직원 등록
    public async registerEmployee(
        args: IRegisterEmployeeMutation.IInput
    ): Promise<IRegisterEmployeeMutation.IOutput> {
        try {
            const { insert_employee_one } = await this.client.request<
                RegisterEmployeeMutation.IResponse,
                RegisterEmployeeMutation.IVariable
            >(RegisterEmployeeMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { insert_employee_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
    // 사용자 & 직원 수정
    public async editEmployeeByPk(
        args: IEditEmployeeByPkMutation.IInput
    ): Promise<IEditEmployeeByPkMutation.IOutput> {
        try {
            const {
                delete_employee_role,
                insert_employee_role,
                update_employee_by_pk,
            } = await this.client.request<
                EditEmployeeByPkMutation.IResponse,
                EditEmployeeByPkMutation.IVariable
            >(EditEmployeeByPkMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return {
                delete_employee_role,
                insert_employee_role,
                update_employee_by_pk,
            };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}
export default EmployeeService.Instance;
