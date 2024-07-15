import codeService from "@common/services/code/code.service";
import { IGetCodeByValue } from "@common/services/code/code.service.interface";
import { UseQueryResult, useQuery } from "react-query";

export default function useGetCodeByValue(
    where: IGetCodeByValue.IInput
): UseQueryResult<IGetCodeByValue.IOutput> {
    return useQuery(
        ["get common code by value", where],
        () => codeService.getCodeByValue(where),
        {
            enabled: true,
            retry: false,
        }
    );
}
