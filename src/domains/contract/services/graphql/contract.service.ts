import { GraphQLClient } from "graphql-request";
import getToken from "@utils/getToken";
import {
    IContractService,
    IDeleteContractById,
    IGetAllContract,
    IGetContractOneById,
    IGetMonthlyContractAmount,
    IRegisterContractOne,
    IUpdateContractById,
} from "./contract.service.interface";
import {
    DeleteContractByIdMutation,
    RegisterContractOneMutation,
    UpdateContractByIdMutation,
} from "./mutation";
import { GetAllContractQuery, GetContractOneByIdQuery } from "./query";
import { GetMonthlyContractAmount } from "./query/getMonthlyContractAmount.query";

class ContractService implements IContractService {
    private static instance: ContractService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     // headers: {
        //     //     Authorization: `Bearer ${getToken()}`,
        //     // },
        // }
    );

    public static get Instance(): ContractService {
        return this.instance || (this.instance = new this());
    }

    // ---------------------------------- [ Contract 생성 ] ----------------------------------------
    public async registerContractOne(
        args: IRegisterContractOne.IInput
    ): Promise<IRegisterContractOne.IOutput> {
        try {
            const { registerContract } = await this.client.request<
                RegisterContractOneMutation.IResponse,
                RegisterContractOneMutation.IVariable
            >(RegisterContractOneMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { registerContract };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // -------------------------------- [ Contract 전체 조회 ] --------------------------------------
    public async getAllContract(
        where: IGetAllContract.IInput
    ): Promise<IGetAllContract.IOutput> {
        try {
            const { contract } = await this.client.request<
                GetAllContractQuery.IResponse,
                GetAllContractQuery.IVariable
            >(GetAllContractQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return contract;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // -------------------------------- [ Contract 조회: id ] --------------------------------------
    public async getContractOneById(
        args: IGetContractOneById.IInput
    ): Promise<IGetContractOneById.IOutput> {
        // console.log(args);
        try {
            const { contract_by_pk } = await this.client.request<
                GetContractOneByIdQuery.IResponse,
                GetContractOneByIdQuery.IVariable
            >(GetContractOneByIdQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { contract_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // --------------------------------- [ Contract 수정: id ] --------------------------------------
    public async updateContractById(
        args: IUpdateContractById.IInput
    ): Promise<IUpdateContractById.IOutput> {
        // console.log(args);
        try {
            const { updateContract } = await this.client.request<
                UpdateContractByIdMutation.IResponse,
                UpdateContractByIdMutation.IVariable
            >(UpdateContractByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { updateContract };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // --------------------------------- [ Contract 삭제: id ] --------------------------------------
    public async deleteContractById(
        args: IDeleteContractById.IInput
    ): Promise<IDeleteContractById.IOutput> {
        // console.log(args);
        try {
            const { deleteContract } = await this.client.request<
                DeleteContractByIdMutation.IResponse,
                DeleteContractByIdMutation.IVariable
            >(DeleteContractByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { deleteContract };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ----------------------- [ 월 별 계약금 ( 수주금액 ) 조회 : year ] -----------------------------
    public async getMonthlyContractAmount(
        args: IGetMonthlyContractAmount.IInput
    ): Promise<IGetMonthlyContractAmount.IOutput> {
        // console.log(args);
        try {
            const { getMonthlyContractData } = await this.client.request<
                GetMonthlyContractAmount.IResponse,
                GetMonthlyContractAmount.IVariable
            >(GetMonthlyContractAmount.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { getMonthlyContractData };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default ContractService.Instance;
