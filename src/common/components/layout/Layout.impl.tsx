import { useRecoilState } from "recoil";
import { ILayout } from "./Layout.interface";
import VLayout from "./Layout.view";
import userState from "@recoils/login-state.atom";
import { useEffect } from "react";
import useParseJwt from "@hooks/useParseJwt";
import PATH from "@constants/path";
import { useRouter } from "next/router";

const Layout: React.FC<ILayout.IProps> = props => {
    const router = useRouter();
    const hasToken: boolean =
        typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    const [loginUser, setLoginUser] = useRecoilState(userState);

    const fetchUserData = () => {
        if (hasToken) {
            const accessToken = localStorage.getItem("accessToken");
            const parsedJwt = useParseJwt(accessToken, !hasToken);
            setLoginUser(parsedJwt);
        }
    };

    useEffect(() => {
        if (!hasToken) {
            router.push(PATH.LOGIN);
        } else {
            fetchUserData();
        }
    }, [hasToken]);

    return <VLayout {...props} />;
};

export default Layout;
