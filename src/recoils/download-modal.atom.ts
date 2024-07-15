import { atom, RecoilEnv } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const downloadModalState = atom<boolean>({
    key: `downloadModalState`,
    default: false,
});

export default downloadModalState;
