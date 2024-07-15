import { GraphQLClient } from "graphql-request";
import {
    ICodeService,
    IGetCodeByCategory,
    IGetCodeByPk,
    IGetCodeByValue,
    IGetCommonCode,
} from "./code.service.interface";
import {
    GetCodesByCategoryQuery,
    GetCodeByValueQuery,
    GetCodeByPkQuery,
    GetCommonCodeQuery,
} from "./graphql";

class CodeService implements ICodeService {
    private static instance: CodeService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
    );

    public static get Instance(): CodeService {
        return this.instance || (this.instance = new this());
    }

    public async getCommonCode(
        where: IGetCommonCode.IInput
    ): Promise<IGetCommonCode.IOutput> {
        try {
            const { common_code } = await this.client.request<
                GetCommonCodeQuery.IResponse,
                GetCommonCodeQuery.IVariable
            >(GetCommonCodeQuery.Document, where);
            return { common_code };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 카테고리별 CODE 조회
    public async getCodeByCategory(
        where: IGetCodeByCategory.IInput
    ): Promise<IGetCodeByCategory.IOutput> {
        try {
            const { common_code } = await this.client.request<
                GetCodesByCategoryQuery.IResponse,
                GetCodesByCategoryQuery.IVariable
            >(GetCodesByCategoryQuery.Document, where);
            return { common_code };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // value 값과 일치하는 code 조회
    public async getCodeByValue(
        where: IGetCodeByValue.IInput
    ): Promise<IGetCodeByValue.IOutput> {
        try {
            const { common_code } = await this.client.request<
                GetCodeByValueQuery.IResponse,
                GetCodeByValueQuery.IVariable
            >(GetCodeByValueQuery.Document, where);
            return { common_code };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // code(pk) 값과 일치하는 code 조회
    public async getCodeBypk(
        where: IGetCodeByPk.IInput
    ): Promise<IGetCodeByPk.IOutput> {
        try {
            const { common_code_by_pk } = await this.client.request<
                GetCodeByPkQuery.IResponse,
                GetCodeByPkQuery.IVariable
            >(GetCodeByPkQuery.Document, where);
            return { common_code_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default CodeService.Instance;
