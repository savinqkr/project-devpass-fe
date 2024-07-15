import { GraphQLClient } from "graphql-request";
import {
    ICompanyService,
    IEditCompanyByPkMutation,
    IGetCompanyByTypeQuery,
    IGetCompanyByPkQuery,
    IRegisterCompanyMutation,
    IDeleteCompanyByPkMutation,
} from "./company.service.interface";
import { GetCompanyByTypeQuery, GetCompanyByPkQuery } from "./graphql/queries";
import {
    RegisterCompanyMutation,
    EditCompanyByPkMutation,
    DeleteCompanyByPkMutation,
} from "./graphql/mutations";

class CompanyService implements ICompanyService {
    private static instance: CompanyService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): CompanyService {
        return this.instance || (this.instance = new this());
    }

    // COMPANY 조회 ( COMPANY_TYPE )
    public async getCompanies(
        where: IGetCompanyByTypeQuery.IInput
    ): Promise<IGetCompanyByTypeQuery.IOutput> {
        try {
            const { company } = await this.client.request<
                GetCompanyByTypeQuery.IResponse,
                GetCompanyByTypeQuery.IVariable
            >(GetCompanyByTypeQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return company;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // COMPANY 조회 ( PK )
    public async getCompanyByPk(
        where: IGetCompanyByPkQuery.IInput
    ): Promise<IGetCompanyByPkQuery.IOutput> {
        try {
            const { company_by_pk } = await this.client.request<
                GetCompanyByPkQuery.IResponse,
                GetCompanyByPkQuery.IVariable
            >(GetCompanyByPkQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return company_by_pk;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // COMPANY 등록
    public async registerCompany(
        args: IRegisterCompanyMutation.IInput
    ): Promise<IRegisterCompanyMutation.IOutput> {
        try {
            const insert_company_one = await this.client.request<
                RegisterCompanyMutation.IResponse,
                RegisterCompanyMutation.IVariable
            >(RegisterCompanyMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return insert_company_one;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // COMPANY 수정 ( BY ID )
    public async editCompanyByPk(
        args: IEditCompanyByPkMutation.IInput
    ): Promise<IEditCompanyByPkMutation.IOutput> {
        try {
            const { update_company_by_pk } = await this.client.request<
                EditCompanyByPkMutation.IResponse,
                EditCompanyByPkMutation.IVariable
            >(EditCompanyByPkMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_company_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // COMPANY 삭제 ( PK )
    public async deleteCompanyByPk(
        args: IDeleteCompanyByPkMutation.IInput
    ): Promise<IDeleteCompanyByPkMutation.IOutput> {
        try {
            const { delete_company_by_pk, delete_employees } =
                await this.client.request<
                    DeleteCompanyByPkMutation.IResponse,
                    DeleteCompanyByPkMutation.IVariable
                >(DeleteCompanyByPkMutation.Document, args, {
                    Authorization: `Bearer ${window.localStorage.getItem(
                        "accessToken"
                    )}`,
                });
            return { delete_company_by_pk, delete_employees };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default CompanyService.Instance;
