import { GraphQLClient } from "graphql-request";
import {
    GetAllRoleCodeQuery,
    GetRoleCodeByPkQuery,
    RegisterRoleCodeMutation,
    EditRoleCodeMutation,
    DeleteRoleCodeMutation,
} from "./graphql";
import {
    IRoleService,
    IGetAllRoleCodeQuery,
    IGetRoleCodeByPkQuery,
    IRegisterRoleCodeMutation,
    IEditRoleCodeMutation,
    IDeleteRoleCodeMutation,
} from "./role.service.interface";

class RoleService implements IRoleService {
    private static instance: RoleService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): RoleService {
        return this.instance || (this.instance = new this());
    }

    // ROLE CODE 목록 조회
    public async getAllRoleCode(
        where: IGetAllRoleCodeQuery.IInput
    ): Promise<IGetAllRoleCodeQuery.IOutput> {
        try {
            const { role_code } = await this.client.request<
                GetAllRoleCodeQuery.IResponse,
                GetAllRoleCodeQuery.IVariable
            >(GetAllRoleCodeQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { role_code };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ROLE CODE 상세 조회 ( BY PK )
    public async getRoleCodeByPk(
        args: IGetRoleCodeByPkQuery.IInput
    ): Promise<IGetRoleCodeByPkQuery.IOutput> {
        try {
            const { role_code_by_pk } = await this.client.request<
                GetRoleCodeByPkQuery.IResponse,
                GetRoleCodeByPkQuery.IVariable
            >(GetRoleCodeByPkQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { role_code_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ROLE CODE 등록
    public async registerRoleCode(
        args: IRegisterRoleCodeMutation.IInput
    ): Promise<IRegisterRoleCodeMutation.IOutput> {
        try {
            const { insert_role_code_one } = await this.client.request<
                RegisterRoleCodeMutation.IResponse,
                RegisterRoleCodeMutation.IVariable
            >(RegisterRoleCodeMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { insert_role_code_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ROLE CODE 수정
    public async editRoleCode(
        args: IEditRoleCodeMutation.IInput
    ): Promise<IEditRoleCodeMutation.IOutput> {
        try {
            const { update_role_code_by_pk } = await this.client.request<
                EditRoleCodeMutation.IResponse,
                EditRoleCodeMutation.IVariable
            >(EditRoleCodeMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_role_code_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ROLE CODE 삭제
    public async deleteRoleCode(
        args: IDeleteRoleCodeMutation.IInput
    ): Promise<IDeleteRoleCodeMutation.IOutput> {
        try {
            const { delete_role_code_by_pk } = await this.client.request<
                DeleteRoleCodeMutation.IResponse,
                DeleteRoleCodeMutation.IVariable
            >(DeleteRoleCodeMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { delete_role_code_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default RoleService.Instance;
