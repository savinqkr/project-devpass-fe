import { atom, RecoilEnv } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const chatScreenState = atom<boolean>({
    key: `chatScreenState`,
    default: false,
});

export default chatScreenState;
