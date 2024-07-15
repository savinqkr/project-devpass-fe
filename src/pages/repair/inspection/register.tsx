import { BasicTemplate, PageTitle } from "@common/components";
import RepairReportRegisterForm from "@domains/repair-report/components/repair-report-register-form/RepairReportRegisterForm.impl";
import type { NextPage } from "next";

const RepairInspectionRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="정기점검 등록" isVisible={false} />
            <RepairReportRegisterForm />
        </BasicTemplate>
    );
};

export default RepairInspectionRegister;
