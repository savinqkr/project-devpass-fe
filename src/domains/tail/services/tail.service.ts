import { GraphQLClient } from "graphql-request";
import getToken from "@utils/getToken";
import {
    IDeletedTailById,
    IGetAllTailByType,
    IGetAllTails,
    IGetTailById,
    IRegisterTailOne,
    ITailService,
    IUpdatedTail,
} from "./tail.service.interface";
import { GetAllTailQuery, GetTailByIdQuery } from "./graphql/query";
import {
    DeletedTailByIdMutation,
    RegisterTailOneMutation,
    UpdatedTailMutation,
} from "./graphql/mutation";
import { GetAllTailByTypeQuery } from "./graphql/query/getAllTailsByType.query";

class TailService implements ITailService {
    private static instance: TailService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): TailService {
        return this.instance || (this.instance = new this());
    }

    // // -------------------------------- [ 전체 TAIL 조회 ] ---------------------------------------
    public async getAllTails(
        args: IGetAllTails.IInput
    ): Promise<IGetAllTails.IOutput> {
        // console.log(args);
        try {
            const { tail } = await this.client.request<
                GetAllTailQuery.IResponse,
                GetAllTailQuery.IVariable
            >(GetAllTailQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { tail };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------------ [ TAIL 조회: type ] -------------------------------------------
    public async getAllTailByType(
        where: IGetAllTailByType.IInput
    ): Promise<IGetAllTailByType.IOutput> {
        try {
            const { tail } = await this.client.request<
                GetAllTailByTypeQuery.IResponse,
                GetAllTailByTypeQuery.IVariable
            >(GetAllTailByTypeQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { tail };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------------ [ TAIL 조회: id ] -------------------------------------------
    public async getTailById(
        args: IGetTailById.IInput
    ): Promise<IGetTailById.IOutput> {
        // console.log(args);
        try {
            const { tail_by_pk } = await this.client.request<
                GetTailByIdQuery.IResponse,
                GetTailByIdQuery.IVariable
            >(GetTailByIdQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { tail_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------------ [ TAIL 생성 ] -------------------------------------------
    public async registerTailOne(
        args: IRegisterTailOne.IInput
    ): Promise<IRegisterTailOne.IOutput> {
        // console.log(args);
        try {
            const { insert_tail_one } = await this.client.request<
                RegisterTailOneMutation.IResponse,
                RegisterTailOneMutation.IVariable
            >(RegisterTailOneMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { insert_tail_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // --------------------------------- [ TAIL 수정 ] -----------------------------------------
    public async updatedTail(
        args: IUpdatedTail.IInput
    ): Promise<IUpdatedTail.IOutput> {
        // console.log(args);
        try {
            const { update_tail_by_pk } = await this.client.request<
                UpdatedTailMutation.IResponse,
                UpdatedTailMutation.IVariable
            >(UpdatedTailMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_tail_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // --------------------------------- [ TAIL 삭제: id ] -----------------------------------------
    public async deletedTailById(
        args: IDeletedTailById.IInput
    ): Promise<IDeletedTailById.IOutput> {
        // console.log(args);
        try {
            const { update_tail_by_pk } = await this.client.request<
                DeletedTailByIdMutation.IResponse,
                DeletedTailByIdMutation.IVariable
            >(DeletedTailByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { update_tail_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default TailService.Instance;
