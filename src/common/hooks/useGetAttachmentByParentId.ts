import attachmentService from "@common/services/attachment/attachment.service";
import { IGetAtteachmentsByPid } from "@common/services/attachment/attachment.service.interface";
import { UseQueryResult, useQuery } from "react-query";

export default function useGetAttachment(
    where: IGetAtteachmentsByPid.IInput
): UseQueryResult<IGetAtteachmentsByPid.IOutput> {
    return useQuery(
        ["get attachment by parent id", where],
        () => attachmentService.getAttachmentsByParentId(where),
        {
            enabled: false,
            retry: false,
        }
    );
}
