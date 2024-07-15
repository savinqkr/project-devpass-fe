import { BasicTemplate, PageTitle } from "@common/components";
import SalesRegisterForm from "@domains/sales/components/sales-register-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const TechSupportSalesRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="기술지원 검수 & 매출 등록" isVisible={false} />
            <SalesRegisterForm type={ProductType.SERVICE} />
        </BasicTemplate>
    );
};

export default TechSupportSalesRegister;
