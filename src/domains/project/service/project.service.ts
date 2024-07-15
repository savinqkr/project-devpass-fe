import { GraphQLClient } from "graphql-request";
import {
    IProjectService,
    IGetAllProjectsByTypeQuery,
    IRegisterProjectMutation,
    IGetProjectByPkQuery,
    IEditProjectMutation,
    IDeleteProjectByIdMutation,
    IGetProjectByConditionsQuery,
    IGetProjectMembersQuery,
    ICancelProjectByPkMutation,
} from "./project.service.interface";

import {
    GetAllProjectsByTypeQuery,
    GetProjectByPkQuery,
    RegisterProjectMutation,
    EditProjectMutation,
    DeleteProjectByIdMutation,
    GetProjectByConditionsQuery,
    GetProjectMembersQuery,
    CancelProjectByPkMutation,
} from "./graphql";

class ProjectService implements IProjectService {
    private static instance: ProjectService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): ProjectService {
        return this.instance || (this.instance = new this());
    }

    /**************************************************************
     * TYPE 별 사업 조회
     ** TYPE ) 라이선스 | 기술지원 | 커스터마이징 개발 | 유지보수
     **************************************************************
     * @param where
     * @returns
     */
    public async getAllProjectsByType(
        where: IGetAllProjectsByTypeQuery.IInput
    ): Promise<IGetAllProjectsByTypeQuery.IOutput> {
        try {
            const { project } = await this.client.request<
                GetAllProjectsByTypeQuery.IResponse,
                GetAllProjectsByTypeQuery.IVariable
            >(GetAllProjectsByTypeQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { project };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /**************************************************************
     * PK 로 사업 상세 조회하기
     **************************************************************
     * @param where
     * @returns
     */
    public async getProjectByPk(
        where: IGetProjectByPkQuery.IInput
    ): Promise<IGetProjectByPkQuery.IOutput> {
        try {
            const project = await this.client.request<
                GetProjectByPkQuery.IResponse,
                GetProjectByPkQuery.IVariable
            >(GetProjectByPkQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return project;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    public async getProjectByConditions(
        where: IGetProjectByConditionsQuery.IInput
    ): Promise<IGetProjectByConditionsQuery.IOutput> {
        try {
            const project = await this.client.request<
                GetProjectByConditionsQuery.IResponse,
                GetProjectByConditionsQuery.IVariable
            >(GetProjectByConditionsQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return project;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 사업 담당자 조회
    async getProjectMembers(
        where: IGetProjectMembersQuery.IInput
    ): Promise<IGetProjectMembersQuery.IOutput> {
        try {
            const { project_employee } = await this.client.request<
                GetProjectMembersQuery.IResponse,
                GetProjectMembersQuery.IVariable
            >(GetProjectMembersQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { project_employee };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /**************************************************************
     * 사업 등록
     **************************************************************
     * @param args
     * @returns
     */
    public async regisgerProject(
        args: IRegisterProjectMutation.IInput
    ): Promise<IRegisterProjectMutation.IOutput> {
        try {
            const { registerProject } = await this.client.request<
                RegisterProjectMutation.IResponse,
                RegisterProjectMutation.IVariable
            >(RegisterProjectMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { registerProject };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /*******************************************************************
     * 사업 수정
     ** 수정 대상인 사업의 UPDATED_AT & UPDATED_BY 추가 ( PK )
     ** 수정 내역 새로 INSERT
     ******************************************************************
     * @param args
     * @returns
     */
    public async editProject(
        args: IEditProjectMutation.IInput
    ): Promise<IEditProjectMutation.IOutput> {
        try {
            const { editProject } = await this.client.request<
                EditProjectMutation.IResponse,
                EditProjectMutation.IVariable
            >(EditProjectMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });
            return { editProject };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /*******************************************************************
     * 사업 삭제
     *******************************************************************/
    public async deleteProjectById(
        args: IDeleteProjectByIdMutation.IInput
    ): Promise<IDeleteProjectByIdMutation.IOutput> {
        try {
            const { deleteProject } = await this.client.request<
                DeleteProjectByIdMutation.IResponse,
                DeleteProjectByIdMutation.IVariable
            >(DeleteProjectByIdMutation.Document, args, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { deleteProject };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /*******************************************************************
     * 사업 해지
     *******************************************************************/
    public async cancelProjectByPk(
        where: ICancelProjectByPkMutation.IInput
    ): Promise<ICancelProjectByPkMutation.IOutput> {
        try {
            const { cancelProject } = await this.client.request<
                CancelProjectByPkMutation.IResponse,
                CancelProjectByPkMutation.IVariable
            >(CancelProjectByPkMutation.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { cancelProject };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default ProjectService.Instance;
