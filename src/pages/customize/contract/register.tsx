import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractRegisterForm from "@domains/contract/components/contract-register-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const CustomizeContractRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="커스터마이징 개발 계약 등록" isVisible={false} />
            <ContractRegisterForm
                type={ProductType.CUSTOMIZE}
                routePath={PATH.CUSTOMIZE.CONTRACT.MAIN}
            />
        </BasicTemplate>
    );
};

export default CustomizeContractRegister;
