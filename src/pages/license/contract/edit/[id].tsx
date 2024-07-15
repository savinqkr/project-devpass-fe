import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import LicenseContractEditForm from "@domains/contract/components/license-contract-edit-form/LicenseContractEditForm.impl";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const LicenseContractEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <PageTitle
                title="라이선스 계약 수정"
                isVisible={false}
                path={`${PATH.LICENSE.CONTRACT.MAIN}/${id}`}
            />
            <LicenseContractEditForm />
        </BasicTemplate>
    );
};

export default LicenseContractEdit;
