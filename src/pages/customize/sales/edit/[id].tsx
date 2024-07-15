import { BasicTemplate, PageTitle } from "@common/components";
import SalesEditForm from "@domains/sales/components/sales-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const CustomizeSalesEdit: NextPage = () => {
    return (
        <div>
            <BasicTemplate>
                <PageTitle
                    title="커스터마이징 개발 검수 & 매출 수정"
                    isVisible={false}
                />
                <SalesEditForm type={ProductType.CUSTOMIZE} />
            </BasicTemplate>
        </div>
    );
};

export default CustomizeSalesEdit;
