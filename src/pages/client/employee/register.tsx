import { BasicTemplate, PageTitle } from "@common/components";
import { EmployeeForm } from "@domains/employee/components";
import type { NextPage } from "next";

const ClientEmployeeRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle title="담당자 등록" isVisible={false} />
            <EmployeeForm />
        </BasicTemplate>
    );
};

export default ClientEmployeeRegister;
