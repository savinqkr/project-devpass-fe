import { BasicTemplate, PageTitle } from "@common/components";
import RepairReportEditForm from "@domains/repair-report/components/repair-report-edit-form";
import type { NextPage } from "next";

const RepairInspectionEdit: NextPage = () => {
    return (
        <div>
            <BasicTemplate>
                <PageTitle title="정기점검 수정" isVisible={false} />
                <RepairReportEditForm />
            </BasicTemplate>
        </div>
    );
};

export default RepairInspectionEdit;
