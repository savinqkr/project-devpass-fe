import { atom } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const currentMenuState = atom<
    {
        parentMenu?: string;
        isOpen?: boolean;
    }[]
>({
    key: `currentMenuState`,
    default: [],
});

export default currentMenuState;
