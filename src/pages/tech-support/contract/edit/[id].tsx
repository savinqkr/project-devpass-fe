import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractEditForm from "@domains/contract/components/contract-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const TechSupportContractEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <PageTitle
                title="기술지원 계약 수정"
                isVisible={false}
                path={`${PATH.TECHSUPPORT.CONTRACT.MAIN}/${id}`}
            />
            <ContractEditForm type={ProductType.SERVICE} />
        </BasicTemplate>
    );
};

export default TechSupportContractEdit;
