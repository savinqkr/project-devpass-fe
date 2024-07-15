import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractRegisterForm from "@domains/contract/components/contract-register-form/ContractRegisterForm.impl";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const TechSupportContractRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="기술지원 계약 등록" isVisible={false} />
            <ContractRegisterForm
                type={ProductType.SERVICE}
                routePath={PATH.TECHSUPPORT.CONTRACT.MAIN}
            />
        </BasicTemplate>
    );
};

export default TechSupportContractRegister;
