import { atom, RecoilEnv } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const loginState = atom<{
    id?: number;
    name?: string;
    permission?: string;
    exp?: string;
    iat?: string;
}>({
    key: "userState",
    default: {
        id: undefined,
        name: undefined,
        permission: undefined,
        exp: undefined,
        iat: undefined,
    },
});

export default loginState;
