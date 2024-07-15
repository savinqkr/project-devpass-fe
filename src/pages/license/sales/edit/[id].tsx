import { BasicTemplate, PageTitle } from "@common/components";
import SalesEditForm from "@domains/sales/components/sales-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";

const LicenseSalesEdit: NextPage = () => {
    return (
        <div>
            <BasicTemplate>
                <PageTitle
                    title="라이선스 검수 & 매출 수정"
                    isVisible={false}
                />
                <SalesEditForm type={ProductType.LICENSE} />
            </BasicTemplate>
        </div>
    );
};

export default LicenseSalesEdit;
