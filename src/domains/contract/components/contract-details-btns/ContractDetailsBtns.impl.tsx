import { useMutation } from "react-query";
import { IContractDetailsBtns } from "./ContractDetailsBtns.interface";
import VContractDetailsBtns from "./ContractDetailsBtns.view";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import contractService from "@domains/contract/services/graphql/contract.service";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";
import { ProductType } from "@enums";

const ContractDetailsBtns: React.FC<IContractDetailsBtns.IProps> = props => {
    const router = useRouter();
    const id: string = router.query.id as string;

    const { type } = props;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- [ M U T A T I O N ] ----------------------------------------
    const { mutate: deleteContractMutation } = useMutation(
        ["deleteContractById"],
        () =>
            contractService.deleteContractById({
                id: parseInt(id),
                deleted_by: user.id,
            }),
        {
            onSuccess(data) {
                if (type === ProductType.LICENSE) {
                    router.push(`${PATH.LICENSE.CONTRACT.MAIN}`);
                } else if (type === ProductType.SERVICE) {
                    router.push(`${PATH.TECHSUPPORT.CONTRACT.MAIN}`);
                } else if (type === ProductType.CUSTOMIZE) {
                    router.push(`${PATH.CUSTOMIZE.CONTRACT.MAIN}`);
                } else if (type === ProductType.MAINTENANCE) {
                    router.push(`${PATH.REPAIR.CONTRACT.MAIN}`);
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ O N C L I C K ] -----------------------------------------
    const onClickDeleted = () => {
        if (window.confirm(`${type} 계약을 삭제하시겠습니까?`)) {
            deleteContractMutation();
        }
    };

    const onClickUpdated = () => {
        if (type === ProductType.LICENSE) {
            router.push(`${PATH.LICENSE.CONTRACT.EDIT}/${id}`);
        } else if (type === ProductType.SERVICE) {
            router.push(`${PATH.TECHSUPPORT.CONTRACT.EDIT}/${id}`);
        } else if (type === ProductType.CUSTOMIZE) {
            router.push(`${PATH.CUSTOMIZE.CONTRACT.EDIT}/${id}`);
        } else if (type === ProductType.MAINTENANCE) {
            router.push(`${PATH.REPAIR.CONTRACT.EDIT}/${id}`);
        }
    };

    return (
        <VContractDetailsBtns
            onClickDeleted={onClickDeleted}
            onClickUpdated={onClickUpdated}
            {...props}
        />
    );
};

export default ContractDetailsBtns;
