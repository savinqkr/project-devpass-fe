import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentState } from "@enums";

const useEditPassbooks = async (
    originalFiles: IAttachmentInput.IAttachment[] | undefined,
    selectedFiles: IAttachmentInput.IAttachment[] | undefined,
    created_by: number,
    parent_id: number,
    type_code: number
) => {
    // UPLOAD FILES
    const newPassbooks = selectedFiles?.filter(
        file => file.tag === AttachmentState.NEW && file.file
    );

    if (!!newPassbooks && newPassbooks.length > 0) {
        newPassbooks.forEach(async attahment => {
            const { file, bank_account, bank_name, tag } = attahment;
            await attachmentService.uploadFile({
                file,
                bank_name: bank_name!,
                bank_account: bank_account!,
                created_by,
                parent_id,
                type_code,
            });
        });
    }

    // DELETE FILES
    originalFiles?.forEach(async originalFile => {
        if (
            !selectedFiles?.some(
                selectedFile =>
                    selectedFile.file === originalFile.file &&
                    selectedFile.bank_account === originalFile.bank_account &&
                    selectedFile.bank_name === originalFile.bank_name
            )
        ) {
            await attachmentService.deleteFile({ id: originalFile.id! });
        }
    });
};

export default useEditPassbooks;
