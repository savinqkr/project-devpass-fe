import { BasicTemplate, PageTitle } from "@common/components";
import SalesRegisterForm from "@domains/sales/components/sales-register-form/SalesRegisterForm.impl";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const LicenseSalesRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="라이선스 검수 & 매출 등록" isVisible={false} />
            <SalesRegisterForm type={ProductType.LICENSE} />
        </BasicTemplate>
    );
};

export default LicenseSalesRegister;
