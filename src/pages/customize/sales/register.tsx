import { BasicTemplate, PageTitle } from "@common/components";
import SalesRegisterForm from "@domains/sales/components/sales-register-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const CustomizeSalesRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle
                title="커스터마이징 개발 검수 & 매출 등록"
                isVisible={false}
            />
            <SalesRegisterForm type={ProductType.CUSTOMIZE} />
        </BasicTemplate>
    );
};

export default CustomizeSalesRegister;
