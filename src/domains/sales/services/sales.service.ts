import { GraphQLClient } from "graphql-request";
import getToken from "@utils/getToken";
import {
    IDeleteSalesById,
    IGetAllSales,
    IGetGoalByYear,
    IGetOneSalesById,
    IGetSalesStatus,
    IGetUniqueYears,
    IRegisterGoal,
    IRegisterSales,
    ISalesService,
    IUpdatedGoal,
    IUpdatedSalesById,
} from "./sales.service.interface";
import {
    DeleteSalesByIdMutation,
    GetAllSalesQuery,
    GetGoalByYearQuery,
    GetOneSalesByIdQuery,
    GetSalesStatusQuery,
    GetUniqueYearsQuery,
    RegisterGoalMutation,
    RegisterSalesMutation,
    UpdatedGoalMutation,
    UpdatedSalesByIdMutation,
} from "./graphql";

class SalesService implements ISalesService {
    private static instance: SalesService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): SalesService {
        return this.instance || (this.instance = new this());
    }

    // ---------------------------------- [ Sales 생성 ] ----------------------------------------
    public async registerSales(
        args: IRegisterSales.IInput
    ): Promise<IRegisterSales.IOutput> {
        try {
            const { registerSales } = await this.client.request<
                RegisterSalesMutation.IResponse,
                RegisterSalesMutation.IVariable
            >(RegisterSalesMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { registerSales };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------ [ 모든 Sale 조회: Filter ( client_id | project_id) ] ----------------------
    public async getAllSales(
        where: IGetAllSales.IInput
    ): Promise<IGetAllSales.IOutput> {
        // console.log(where);
        try {
            const { sales } = await this.client.request<
                GetAllSalesQuery.IResponse,
                GetAllSalesQuery.IVariable
            >(
                GetAllSalesQuery.Document,

                where,
                {
                    Authorization: `Bearer ${window.localStorage.getItem(
                        "accessToken"
                    )}`,
                }
            );
            return sales;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales 조회: id ] ---------------------------------------
    public async getOneSalesById(
        args: IGetOneSalesById.IInput
    ): Promise<IGetOneSalesById.IOutput> {
        // console.log(args);
        try {
            const { sales_by_pk } = await this.client.request<
                GetOneSalesByIdQuery.IResponse,
                GetOneSalesByIdQuery.IVariable
            >(GetOneSalesByIdQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { sales_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales 수정: id ] ---------------------------------------
    public async updatedSalesById(
        args: IUpdatedSalesById.IInput
    ): Promise<IUpdatedSalesById.IOutput> {
        // console.log(args);
        try {
            const { updateSales } = await this.client.request<
                UpdatedSalesByIdMutation.IResponse,
                UpdatedSalesByIdMutation.IVariable
            >(UpdatedSalesByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { updateSales };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales 삭제: id ] ---------------------------------------
    public async deleteSalesById(
        args: IDeleteSalesById.IInput
    ): Promise<IDeleteSalesById.IOutput> {
        // console.log(args);
        try {
            const { deleteSales } = await this.client.request<
                DeleteSalesByIdMutation.IResponse,
                DeleteSalesByIdMutation.IVariable
            >(DeleteSalesByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { deleteSales };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales Status Goal 생성 ] ---------------------------------------
    public async registerGoal(
        args: IRegisterGoal.IInput
    ): Promise<IRegisterGoal.IOutput> {
        // console.log(args);
        try {
            const { insert_sales_status_one } = await this.client.request<
                RegisterGoalMutation.IResponse,
                RegisterGoalMutation.IVariable
            >(RegisterGoalMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { insert_sales_status_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales Status Goal 수정 ] ---------------------------------------
    public async updatedGoal(
        args: IUpdatedGoal.IInput
    ): Promise<IUpdatedGoal.IOutput> {
        // console.log(args);
        try {
            const { update_sales_status_by_pk } = await this.client.request<
                UpdatedGoalMutation.IResponse,
                UpdatedGoalMutation.IVariable
            >(UpdatedGoalMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_sales_status_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Goal 조회: year ] ---------------------------------------
    public async getGoalByYear(
        args: IGetGoalByYear.IInput
    ): Promise<IGetGoalByYear.IOutput> {
        // console.log(args);
        try {
            const { sales_status_by_pk } = await this.client.request<
                GetGoalByYearQuery.IResponse,
                GetGoalByYearQuery.IVariable
            >(GetGoalByYearQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { sales_status_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Sales Status 월 별 데이터 조회: year ] ---------------------------------------
    public async getMonthlySalesData(
        args: IGetSalesStatus.IInput
    ): Promise<IGetSalesStatus.IOutput> {
        // console.log(args);
        try {
            const { getMonthlySalesData } = await this.client.request<
                GetSalesStatusQuery.IResponse,
                GetSalesStatusQuery.IVariable
            >(GetSalesStatusQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { getMonthlySalesData };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ---------------------------------- [ Unique Years 조회 ] ---------------------------------------
    public async getUniqueYears(
        args: IGetUniqueYears.IInput
    ): Promise<IGetUniqueYears.IOutput> {
        // console.log(args);
        try {
            const { getUniqueYears } = await this.client.request<
                GetUniqueYearsQuery.IResponse,
                GetUniqueYearsQuery.IVariable
            >(GetUniqueYearsQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { getUniqueYears };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default SalesService.Instance;
