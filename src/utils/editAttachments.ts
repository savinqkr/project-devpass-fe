import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentState } from "@enums";

const editAttachments = async (
    originalFiles: IAttachmentInput.IAttachment[] | undefined,
    selectedFiles: IAttachmentInput.IAttachment[] | undefined,
    created_by: number,
    parent_id: number,
    type_code: number
) => {
    // UPLOAD NEW FILES
    const newFiles = selectedFiles
        ?.filter(file => file.tag === AttachmentState.NEW && file.file)
        .map(file => file.file!);

    if (newFiles && newFiles.length > 0) {
        await attachmentService.uploadFiles({
            files: newFiles,
            created_by,
            parent_id,
            type_code,
        });
    }

    // DELETE REMOVED FILES
    originalFiles?.forEach(async originalFile => {
        if (
            !selectedFiles?.some(
                selectedFile => selectedFile.file === originalFile.file
            )
        ) {
            await attachmentService.deleteFile({ id: originalFile.id! });
        }
    });
};

export default editAttachments;
