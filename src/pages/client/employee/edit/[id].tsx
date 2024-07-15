import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import { EmployeeForm } from "@domains/employee/components";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const CompanyEdit: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    return (
        <BasicTemplate>
            <PageTitle
                title="담당자 수정"
                isVisible={false}
                path={`${PATH.CLIENT.EMPLOYEE.MAIN}/${id}`}
            />
            <EmployeeForm />
        </BasicTemplate>
    );
};

export default CompanyEdit;
