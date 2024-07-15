import { BasicTemplate, PageTitle } from "@common/components";
import LicenseContractRegisterForm from "@domains/contract/components/license-contract-register-form";
import type { NextPage } from "next";

const LicenseContractRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="라이선스 계약 등록" isVisible={false} />
            <LicenseContractRegisterForm />
        </BasicTemplate>
    );
};

export default LicenseContractRegister;
