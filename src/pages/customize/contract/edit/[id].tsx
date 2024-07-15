import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractEditForm from "@domains/contract/components/contract-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const CustomizeContractEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <PageTitle
                title="커스터마이징 개발 계약 수정"
                isVisible={false}
                path={`${PATH.CUSTOMIZE.CONTRACT.MAIN}/${id}`}
            />
            <ContractEditForm type={ProductType.CUSTOMIZE} />
        </BasicTemplate>
    );
};

export default CustomizeContractEdit;
