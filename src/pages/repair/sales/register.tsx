import { BasicTemplate, PageTitle } from "@common/components";
import SalesRegisterForm from "@domains/sales/components/sales-register-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const RepairSalesRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="유지보수 검수 & 매출 등록" isVisible={false} />
            <SalesRegisterForm type={ProductType.MAINTENANCE} />
        </BasicTemplate>
    );
};

export default RepairSalesRegister;
