import { BasicTemplate, PageTitle } from "@common/components";
import SalesEditForm from "@domains/sales/components/sales-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const RepairSalesEdit: NextPage = () => {
    return (
        <div>
            <BasicTemplate>
                <PageTitle
                    title="유지보수 검수 & 매출 수정"
                    isVisible={false}
                />
                <SalesEditForm type={ProductType.MAINTENANCE} />
            </BasicTemplate>
        </div>
    );
};

export default RepairSalesEdit;
