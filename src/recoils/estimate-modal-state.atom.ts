import { atom, RecoilEnv } from "recoil";
import { CommonType } from "src/enums/common_type.enum";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const estimateModalState = atom<{
    isOpen: boolean;
    type?: CommonType;
    selectedEstimateId?: number;
}>({
    key: `estimateModalState`,
    default: {
        isOpen: false,
        type: undefined,
        selectedEstimateId: undefined,
    },
});

export default estimateModalState;
