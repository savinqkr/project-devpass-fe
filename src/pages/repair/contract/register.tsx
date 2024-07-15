import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractRegisterForm from "@domains/contract/components/contract-register-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const RepairContractRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="유지보수 계약 등록" isVisible={false} />
            <ContractRegisterForm
                type={ProductType.MAINTENANCE}
                routePath={PATH.REPAIR.CONTRACT.MAIN}
            />
        </BasicTemplate>
    );
};

export default RepairContractRegister;
