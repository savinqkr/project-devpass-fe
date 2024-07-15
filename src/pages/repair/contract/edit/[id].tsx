import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import ContractEditForm from "@domains/contract/components/contract-edit-form";
import { ProductType } from "@enums";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const RepairContractEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <PageTitle
                title="유지보수 계약 수정"
                isVisible={false}
                path={`${PATH.REPAIR.CONTRACT.MAIN}/${id}`}
            />
            <ContractEditForm type={ProductType.MAINTENANCE} />
        </BasicTemplate>
    );
};

export default RepairContractEdit;
