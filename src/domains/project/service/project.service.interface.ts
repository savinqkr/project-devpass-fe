import {
    CancelProjectByPkMutation,
    DeleteProjectByIdMutation,
    EditProjectMutation,
    GetAllProjectsByTypeQuery,
    GetProjectByConditionsQuery,
    GetProjectByPkQuery,
    RegisterProjectMutation,
} from "./graphql";
import { GetProjectMembersQuery } from "./graphql/queries/get-project-members.query";

export namespace IGetAllProjectsByTypeQuery {
    export interface IInput extends GetAllProjectsByTypeQuery.IVariable {}
    export interface IOutput extends GetAllProjectsByTypeQuery.IResponse {}
}
export namespace IGetProjectByPkQuery {
    export interface IInput extends GetProjectByPkQuery.IVariable {}
    export interface IOutput extends GetProjectByPkQuery.IResponse {}
}
export namespace IGetProjectByConditionsQuery {
    export interface IInput extends GetProjectByConditionsQuery.IVariable {}
    export interface IOutput extends GetProjectByConditionsQuery.IResponse {}
}
export namespace IGetProjectMembersQuery {
    export interface IInput extends GetProjectMembersQuery.IVariable {}
    export interface IOutput extends GetProjectMembersQuery.IResponse {}
}
export namespace IRegisterProjectMutation {
    export interface IInput extends RegisterProjectMutation.IVariable {}
    export interface IOutput extends RegisterProjectMutation.IResponse {}
}
export namespace IEditProjectMutation {
    export interface IInput extends EditProjectMutation.IVariable {}
    export interface IOutput extends EditProjectMutation.IResponse {}
}
export namespace IDeleteProjectByIdMutation {
    export interface IInput extends DeleteProjectByIdMutation.IVariable {}
    export interface IOutput extends DeleteProjectByIdMutation.IResponse {}
}
export namespace ICancelProjectByPkMutation {
    export interface IInput extends CancelProjectByPkMutation.IVariable {}
    export interface IOutput extends CancelProjectByPkMutation.IResponse {}
}

export interface IProjectService {
    getAllProjectsByType(
        where: IGetAllProjectsByTypeQuery.IInput
    ): Promise<IGetAllProjectsByTypeQuery.IOutput>;
    getProjectByPk(
        where: IGetProjectByPkQuery.IInput
    ): Promise<IGetProjectByPkQuery.IOutput>;
    getProjectByConditions(
        where: IGetProjectByConditionsQuery.IInput
    ): Promise<IGetProjectByConditionsQuery.IOutput>;
    getProjectMembers(
        where: IGetProjectMembersQuery.IInput
    ): Promise<IGetProjectMembersQuery.IOutput>;
    regisgerProject(
        args: IRegisterProjectMutation.IInput,
        partners: Array<number>,
        employees: Array<{ employee_id: number; role_code: number }>
    ): Promise<IRegisterProjectMutation.IOutput>;
    editProject(
        args: IEditProjectMutation.IInput,
        partners: Array<number>,
        employees: Array<{ employee_id: number; role_code: number }>
    ): Promise<IEditProjectMutation.IOutput>;
    deleteProjectById(
        args: IDeleteProjectByIdMutation.IInput
    ): Promise<IDeleteProjectByIdMutation.IOutput>;
    cancelProjectByPk(
        where: ICancelProjectByPkMutation.IInput
    ): Promise<ICancelProjectByPkMutation.IOutput>;
}
