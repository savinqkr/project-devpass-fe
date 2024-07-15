import { useRouter } from "next/router";
import { IPageTitle } from "./PageTitle.interface";
import VPageTitle from "./PageTitle.view";
import { useRecoilState } from "recoil";
import chatScreenState from "@recoils/chat-screen-state.atom";

const PageTitle: React.FC<IPageTitle.IProps> = props => {
    const { path } = props;
    const router = useRouter();
    const [chatScreenRecoil, setChatScreenRecoil] =
        useRecoilState(chatScreenState);

    const onClickRouteBack = () => {
        setChatScreenRecoil(false);
        if (path) {
            router.push(path);
        }
    };
    return <VPageTitle onClickRouteBack={onClickRouteBack} {...props} />;
};

export default PageTitle;
