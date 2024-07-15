import { GraphQLClient } from "graphql-request";
import {
    IDeleteEstimateMutation,
    IEstimateService,
    IGetAllEstimatesQuery,
    IGetEstimateByPkQuery,
    IGetEstimateCountByProjectQuery,
    IEditEstimateMutation,
    IRegisterEstimateMutation,
    ISetFinalEstimateByPkMutation,
    IGetRecentEstimateQuery,
    IGetEstimateCountQuery,
    IGetFinalEstimateByProjectQuery,
    IGetFinalEstiamteDetailsQuery,
    IGetFinalEstimateDetailsBySelectedLicenseContracts,
} from "./estimate.service.interface";
import {
    GetAllEstimatesQuery,
    GetEstimateCountByProjectQuery,
    GetEstimateByPkQuery,
    DeleteEstimateMutation,
    EditEstimateMutation,
    RegisterEstimateMutation,
    SetFinalEstimateByPkMutation,
    GetEstimateCountQuery,
    GetRecentEstimateQuery,
    GetFinalEstimateByProjectQuery,
    GetFinalEstiamteDetailsQuery,
    GetFinalEstimateDetailsBySelectedLicenseContractsQuery,
} from "./graphql";
import { CommonType } from "src/enums/common_type.enum";

class EstimateService implements IEstimateService {
    private static instance: EstimateService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): EstimateService {
        return this.instance || (this.instance = new this());
    }

    public async getAllEstimates(
        where: IGetAllEstimatesQuery.IInput
    ): Promise<IGetAllEstimatesQuery.IOutput> {
        try {
            const { estimate } = await this.client.request<
                GetAllEstimatesQuery.IResponse,
                GetAllEstimatesQuery.IVariable
            >(GetAllEstimatesQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { estimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getEstimateByPk(
        where: IGetEstimateByPkQuery.IInput
    ): Promise<IGetEstimateByPkQuery.IOutput> {
        try {
            const { estimate_by_pk } = await this.client.request<
                GetEstimateByPkQuery.IResponse,
                GetEstimateByPkQuery.IVariable
            >(GetEstimateByPkQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { estimate_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getEstimateCountByProject(
        where: IGetEstimateCountByProjectQuery.IInput
    ): Promise<IGetEstimateCountByProjectQuery.IOutput> {
        try {
            const { project_by_pk } = await this.client.request<
                GetEstimateCountByProjectQuery.IResponse,
                GetEstimateCountByProjectQuery.IVariable
            >(GetEstimateCountByProjectQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return project_by_pk.estimates_aggregate.aggregate;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    async getEstimateCount(): Promise<IGetEstimateCountQuery.IOutput> {
        try {
            const { estimate_aggregate } = await this.client.request<
                GetEstimateCountQuery.IResponse,
                GetEstimateCountQuery.IVariable
            >(
                GetEstimateCountQuery.Document,
                {},
                {
                    Authorization: `Bearer ${window.localStorage.getItem(
                        "accessToken"
                    )}`,
                }
            );

            return estimate_aggregate.aggregate;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getRecentEstimate(
        where: IGetRecentEstimateQuery.IInput
    ): Promise<IGetRecentEstimateQuery.IOutput> {
        try {
            const { estimate } = await this.client.request<
                GetRecentEstimateQuery.IResponse,
                GetRecentEstimateQuery.IVariable
            >(GetRecentEstimateQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { estimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getFinalEstimateByProject(
        where: IGetFinalEstimateByProjectQuery.IInput
    ): Promise<IGetFinalEstimateByProjectQuery.IOutput> {
        try {
            const { estimate } = await this.client.request<
                GetFinalEstimateByProjectQuery.IResponse,
                GetFinalEstimateByProjectQuery.IVariable
            >(GetFinalEstimateByProjectQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { estimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /********************************************************
     * 유지보수 사업에서 등록한 라이선스 사업 목록 조회
     * ( project_contract 테이블 )
     * @param where
     * @returns
     ********************************************************/
    public async getFinalEstimateDetails(
        where: IGetFinalEstiamteDetailsQuery.IInput
    ): Promise<IGetFinalEstiamteDetailsQuery.IOutput> {
        try {
            const { project_contract } = await this.client.request<
                GetFinalEstiamteDetailsQuery.IResponse,
                GetFinalEstiamteDetailsQuery.IVariable
            >(GetFinalEstiamteDetailsQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            const project_contract_details = project_contract.flatMap(
                ({ repair_project, license_contract }) => {
                    // 유지보수 사업
                    const {
                        name,
                        start_date: repair_project_start_date,
                        end_date: repair_project_end_date,
                    } = repair_project;

                    // 라이선스 계약
                    const {
                        id,
                        contract_period_start,
                        contract_period_end,
                        license_project,
                    } = license_contract;

                    const estimates = license_project?.estimates ?? [];

                    // 각 견적의 세부내역
                    const project_contract_details = estimates.flatMap(
                        estimate => {
                            return estimate.details.map(detail => ({
                                license_project_id: license_project.id,
                                license_project_name: license_project.name,
                                ...detail,
                                repair_project_start_date,
                                repair_project_end_date,
                                contract_id: license_contract.id,
                                contract_period_start,
                                contract_period_end,
                            }));
                        }
                    );

                    return project_contract_details;
                }
            );

            return {
                details: project_contract_details,
            };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /**
     * [ 라이선스 도입 사업 추가 ] 모달에서 선택한 라이선스 계약에 해당하는
     * 견적의 세부내역 불러오기
     */
    public async getFinalEstimateDetailsBySelectedLicenseContracts(
        where: IGetFinalEstimateDetailsBySelectedLicenseContracts.IInput
    ): Promise<IGetFinalEstimateDetailsBySelectedLicenseContracts.IOutput> {
        try {
            const { project_contract_where, esitmate_where, contract_where } =
                where;

            const { repair_project, project_contract, estimate } =
                await this.client.request<
                    GetFinalEstimateDetailsBySelectedLicenseContractsQuery.IResponse,
                    GetFinalEstimateDetailsBySelectedLicenseContractsQuery.IVariable
                >(
                    GetFinalEstimateDetailsBySelectedLicenseContractsQuery.Document,
                    where,
                    {
                        Authorization: `Bearer ${window.localStorage.getItem(
                            "accessToken"
                        )}`,
                    }
                );

            // 유지보수 사업 단계에서 등록된 라이선스 계약
            const registeredLicenseContractIds = project_contract.map(
                ele => ele.license_contract.id
            );

            // 리턴할 품목들의 라이선스 계약 ID
            console.log(esitmate_where?.project?.contracts?.id?._in);
            const selectedContractIds =
                esitmate_where?.project?.contracts?.id?._in === undefined
                    ? registeredLicenseContractIds
                    : esitmate_where?.project?.contracts?.id?._in || [];

            // selectedContractIds 에 해당하는 contract 를 포함한 estiamte 목록
            const filteredEstiamtes = estimate.filter(ele =>
                ele.license_project.contracts.some(contract =>
                    selectedContractIds.includes(contract.id)
                )
            );

            // 유지보수 사업 정보
            const { repair_rate, repair_last_year_rate, start_date, end_date } =
                repair_project[0];

            const details = filteredEstiamtes.flatMap(estiamte => {
                return estiamte.details
                    .filter(ele => ele.product_type === CommonType.LICENSE)
                    .flatMap(detail => ({
                        repair_rate,
                        repair_last_year_rate,
                        repair_project_start_date: start_date,
                        repair_project_end_date: end_date,
                        license_project_id: estiamte.license_project.id,
                        license_project_name: estiamte.license_project.name,
                        ...detail,
                        license_contract_id:
                            estiamte.license_project.contracts[0].id,
                        contract_period_start:
                            estiamte.license_project.contracts[0]
                                .contract_period_start,
                        contract_period_end:
                            estiamte.license_project.contracts[0]
                                .contract_period_end,
                    }));
            });

            return { details };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /********************************************************
     * 견적 등록
     * @param args
     * @returns
     ********************************************************/
    public async registerEstimate(
        args: IRegisterEstimateMutation.IInput
    ): Promise<IRegisterEstimateMutation.IOutput> {
        try {
            const { registerEstimate } = await this.client.request<
                RegisterEstimateMutation.IResponse,
                RegisterEstimateMutation.IVariable
            >(RegisterEstimateMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { registerEstimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /********************************************************
     * 견적 수정
     * @param args
     * @returns
     ********************************************************/
    public async editEstimate(
        args: IEditEstimateMutation.IInput
    ): Promise<IEditEstimateMutation.IOutput> {
        try {
            const { editEstimate } = await this.client.request<
                EditEstimateMutation.IResponse,
                EditEstimateMutation.IVariable
            >(EditEstimateMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { editEstimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /********************************************************
     * 견적 삭제
     * @param args
     * @returns
     ********************************************************/
    public async deleteEstimate(
        args: IDeleteEstimateMutation.IInput
    ): Promise<IDeleteEstimateMutation.IOutput> {
        try {
            const { deleteEstimate } = await this.client.request<
                DeleteEstimateMutation.IResponse,
                DeleteEstimateMutation.IVariable
            >(DeleteEstimateMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { deleteEstimate };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /********************************************************
     * 견적 확정
     * @param args
     * @returns
     ********************************************************/
    public async setFinalEstimateByPkMutation(
        args: ISetFinalEstimateByPkMutation.IInput
    ): Promise<ISetFinalEstimateByPkMutation.IOutput> {
        try {
            const { update_estimate_by_pk } = await this.client.request<
                SetFinalEstimateByPkMutation.IResponse,
                SetFinalEstimateByPkMutation.IVariable
            >(SetFinalEstimateByPkMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { update_estimate_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default EstimateService.Instance;
