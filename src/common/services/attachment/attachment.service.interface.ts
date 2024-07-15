import {
    GetAllAttachmentsQuery,
    GetAttachmentsByParentIdQuery,
    GetAttachmentsByTypeQuery,
} from "./graphql";

export namespace IUploadFilePost {
    export interface IInput {
        file: File;
        created_by: number;
        parent_id: number;
        type_code: number;
        bank_name?: string;
        bank_account?: string;
    }
    export interface IOutput extends Promise<any> {}
}
export namespace IUploadFilesPost {
    export interface IInput {
        files: Array<File>;
        created_by: number;
        parent_id: number;
        type_code: number;
    }
    export interface IOutput extends Promise<boolean> {}
}
export namespace IDownloadFileGet {
    export interface IInput {
        id: number;
    }
    export interface IOutput extends Promise<boolean> {}
}

export namespace IDeleteFile {
    export interface IInput {
        id: number;
    }
    export interface IOutput extends Promise<boolean> {}
}

export namespace IGetAtteachmentsByPid {
    export interface IInput extends GetAttachmentsByParentIdQuery.IVariable {}
    export interface IOutput extends GetAttachmentsByParentIdQuery.IResponse {}
}
export namespace IGetAttachmentsByType {
    export interface IInput extends GetAttachmentsByTypeQuery.IVariable {}
    export interface IOutput extends GetAttachmentsByTypeQuery.IResponse {}
}
export namespace IGetAllAttachment {
    export interface IInput extends GetAllAttachmentsQuery.IVariable {}
    export interface IOutput extends GetAllAttachmentsQuery.IResponse {}
}

export interface IAttachmentService {
    uploadFile(args: IUploadFilePost.IInput): IUploadFilePost.IOutput;
    uploadFiles(args: IUploadFilesPost.IInput): IUploadFilePost.IOutput;
    downloadFile(args: IDownloadFileGet.IInput): IDownloadFileGet.IOutput;
    deleteFile(args: IDeleteFile.IInput): IDeleteFile.IOutput;
    getAttachmentsByParentId(
        where: IGetAtteachmentsByPid.IInput
    ): Promise<IGetAtteachmentsByPid.IOutput>;
    getAttachmentsByType(
        where: IGetAttachmentsByType.IInput
    ): Promise<IGetAttachmentsByType.IOutput>;
    getAllAttachment(
        where: IGetAllAttachment.IInput
    ): Promise<IGetAllAttachment.IOutput>;
}
