import { GraphQLClient } from "graphql-request";
import getToken from "@utils/getToken";
import {
    IDeleteRepairReportById,
    IGetAllRepairReport,
    IGetRepairReportOneById,
    IRegisterRepairReport,
    IRepairReportService,
    IUpdateRepairReport,
} from "./repair-report.service.interface";
import {
    DeleteRepairReportMutation,
    GetAllRepairReportQuery,
    GetRepairReportOneByIdQuery,
    RegisterRepairReportMutation,
    UpdateRepairReportMutation,
} from "./graphql";

class RepairReportService implements IRepairReportService {
    private static instance: RepairReportService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): RepairReportService {
        return this.instance || (this.instance = new this());
    }

    // --------------------------------- [ R E G I S T E R ] ---------------------------------------
    public async registerRepairReport(
        args: IRegisterRepairReport.IInput
    ): Promise<IRegisterRepairReport.IOutput> {
        // console.log(args);
        try {
            const { registerRepairReport } = await this.client.request<
                RegisterRepairReportMutation.IResponse,
                RegisterRepairReportMutation.IVariable
            >(RegisterRepairReportMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { registerRepairReport };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ----------------------------------- [ I N Q U I R Y ] ---------------------------------------
    public async getAllRepairReport(
        where: IGetAllRepairReport.IInput
    ): Promise<IGetAllRepairReport.IOutput> {
        // console.log(args);
        try {
            const { repair_report } = await this.client.request<
                GetAllRepairReportQuery.IResponse,
                GetAllRepairReportQuery.IVariable
            >(GetAllRepairReportQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return repair_report;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------ [ G E T  O N E  B Y  I D ] -----------------------------------
    public async getRepairReportOneById(
        args: IGetRepairReportOneById.IInput
    ): Promise<IGetRepairReportOneById.IOutput> {
        // console.log(args);
        try {
            const { repair_report_by_pk } = await this.client.request<
                GetRepairReportOneByIdQuery.IResponse,
                GetRepairReportOneByIdQuery.IVariable
            >(GetRepairReportOneByIdQuery.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { repair_report_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------------ [ U P D A T E ] ----------------------------------------
    public async updateRepairReport(
        args: IUpdateRepairReport.IInput
    ): Promise<IUpdateRepairReport.IOutput> {
        // console.log(args);
        try {
            const { updateRepairReport } = await this.client.request<
                UpdateRepairReportMutation.IResponse,
                UpdateRepairReportMutation.IVariable
            >(UpdateRepairReportMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { updateRepairReport };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // ------------------------------------ [ D E L E T E ] ----------------------------------------
    public async deleteRepairReportOneById(
        args: IDeleteRepairReportById.IInput
    ): Promise<IDeleteRepairReportById.IOutput> {
        // console.log(args);
        try {
            const { deletedRepairReport } = await this.client.request<
                DeleteRepairReportMutation.IResponse,
                DeleteRepairReportMutation.IVariable
            >(DeleteRepairReportMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { deletedRepairReport };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default RepairReportService.Instance;
