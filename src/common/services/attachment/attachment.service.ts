import { GraphQLClient } from "graphql-request";
import {
    IAttachmentService,
    IDownloadFileGet,
    IGetAtteachmentsByPid,
    IUploadFilePost,
    IUploadFilesPost,
    IGetAttachmentsByType,
    IDeleteFile,
    IGetAllAttachment,
} from "./attachment.service.interface";
import {
    GetAllAttachmentsQuery,
    GetAttachmentsByParentIdQuery,
    GetAttachmentsByTypeQuery,
} from "./graphql";

class AttachmentService implements IAttachmentService {
    private static instance: AttachmentService;

    private client = process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT ?? "";

    private graphqlClient = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
    );

    public static get Instance(): AttachmentService {
        return this.instance || (this.instance = new this());
    }

    /**********************************************************************
     * UPLOAD FILE ( SINGLE )
     ** 한 개의 파일을 업로드하는 함수
     * *********************************************************************
     * @param {file} file -
     * @returns
     */
    public async uploadFile(
        args: IUploadFilePost.IInput
    ): Promise<boolean | undefined> {
        const {
            file,
            created_by,
            parent_id,
            type_code,
            bank_account,
            bank_name,
        } = args;
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                `${this.client}/file/upload?tc=${type_code}&pid=${parent_id}&cid=${created_by}&bn=${bank_name}&ba=${bank_account}`,
                {
                    method: "POST",
                    headers: {
                        "apollo-require-preflight": "true",
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.error(error);
            if (
                error.response &&
                error.response.errors &&
                error.response.errors.length > 0
            ) {
                alert(error.response.errors[0].message);
            }
        }
    }

    /**********************************************************************
     * UPLOAD FILES ( MULTIPLE )
     ** 여러 개의 파일을 업로드하는 함수
     **********************************************************************
     * @param args
     * @returns
     */
    public async uploadFiles(args: IUploadFilesPost.IInput) {
        const { files, created_by, parent_id, type_code } = args;
        try {
            const formData = new FormData();

            files.forEach(file => {
                formData.append("files", file);
            });

            const response = await fetch(
                `${this.client}/file/uploads?tc=${type_code}&pid=${parent_id}&cid=${created_by}`,
                {
                    method: "POST",
                    headers: {
                        "apollo-require-preflight": "true",
                    },
                    body: formData,
                }
            );
            const responseData = await response.json();
            if (response.ok) {
                return responseData.data;
            } else {
                console.error(responseData);
                alert(responseData.errors[0].message);
            }
        } catch (error: any) {
            console.error(error);
            alert(error["response"].errors[0]["message"]);
        }
    }
    /**********************************************************************
     * DOWNLOAD FILE
     ** 파일 다운로드
     **********************************************************************
     * @param args
     */
    public async downloadFile(args: IDownloadFileGet.IInput): Promise<any> {
        const { id } = args;
        try {
            const response = await fetch(`${this.client}/file/download/${id}`, {
                method: "GET",
            });
            if (response.ok) {
                return true;
            }
        } catch (error: any) {
            console.error(error);
            alert(error["response"].errors[0]["message"]);
        }
    }

    /**********************************************************************
     * DELETE FILE
     ** 서버에 저장된 파일 삭제 & DB 에 저장된 파일 정보 삭제
     **********************************************************************
     * @param args
     */
    public async deleteFile(args: IDeleteFile.IInput): Promise<any> {
        const { id } = args;
        try {
            const response = await fetch(`${this.client}/file/delete/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                return true;
            }
        } catch (error: any) {
            console.error(error);
            alert(error["response"].errors[0]["message"]);
        }
    }

    /**********************************************************************
     * GET ATTACHMENTS BY PARENT ID
     **부모 ID 에 속하는 모든 ATTACHMENT 정보 조회
     **********************************************************************
     * @param where
     * @returns
     */
    public async getAttachmentsByParentId(
        where: IGetAtteachmentsByPid.IInput
    ): Promise<IGetAtteachmentsByPid.IOutput> {
        try {
            const { attachment } = await this.graphqlClient.request<
                GetAttachmentsByParentIdQuery.IResponse,
                GetAttachmentsByParentIdQuery.IVariable
            >(GetAttachmentsByParentIdQuery.Document, where);
            return { attachment };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /**********************************************************************
     * GET ATTACHMENTS BY TYPES
     **TYPE 에 따른 ATTACHMENT 정보 조회
     **********************************************************************
     * @param where
     * @returns
     */
    public async getAttachmentsByType(
        where: IGetAttachmentsByType.IInput
    ): Promise<IGetAttachmentsByType.IOutput> {
        try {
            const { attachment } = await this.graphqlClient.request<
                GetAttachmentsByTypeQuery.IResponse,
                GetAttachmentsByTypeQuery.IVariable
            >(GetAttachmentsByTypeQuery.Document, where);
            return { attachment };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    /**********************************************************************
     * GET ALL ATTACHMENTS
     **where과 order 조건으로 데이터 조회
     **********************************************************************
     * @param where
     * @returns
     */
    public async getAllAttachment(
        where: IGetAllAttachment.IInput
    ): Promise<IGetAllAttachment.IOutput> {
        try {
            const { attachment } = await this.graphqlClient.request<
                GetAllAttachmentsQuery.IResponse,
                GetAllAttachmentsQuery.IVariable
            >(GetAllAttachmentsQuery.Document, where);
            return { attachment };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default AttachmentService.Instance;
