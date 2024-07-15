import { atom, RecoilEnv } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const drawerState = atom<boolean>({
    key: `drawerState`,
    default: false,
});

export default drawerState;
