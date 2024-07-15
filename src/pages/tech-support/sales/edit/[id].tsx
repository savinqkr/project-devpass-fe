import { BasicTemplate, PageTitle } from "@common/components";
import SalesEditForm from "@domains/sales/components/sales-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const TechSupportSalesEdit: NextPage = () => (
    <div>
        <BasicTemplate>
            <PageTitle title="기술지원 검수 & 매출 수정" isVisible={false} />
            <SalesEditForm type={ProductType.SERVICE} />
        </BasicTemplate>
    </div>
);

export default TechSupportSalesEdit;
