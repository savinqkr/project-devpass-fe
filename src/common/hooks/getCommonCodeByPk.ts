import codeService from "@common/services/code/code.service";
import { IGetRoleCodeByPkQuery } from "@domains/role/services/role.service.interface";
import { UseQueryResult, useQuery } from "react-query";

export default function useGetCodeByPk(
    where: IGetRoleCodeByPkQuery.IInput
): UseQueryResult<IGetRoleCodeByPkQuery.IOutput> {
    return useQuery(
        ["get common code by value", where],
        () => codeService.getCodeBypk(where),
        {
            enabled: true,
            retry: false,
        }
    );
}
