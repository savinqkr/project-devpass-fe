import { useRouter } from "next/router";
import { IChildMenu } from "./ChildMenu.interface";
import VChildMenu from "./ChildMenu.view";
import { useRecoilState, useSetRecoilState } from "recoil";
import drawerState from "@recoils/drawer-state.atom";
import chatScreenState from "@recoils/chat-screen-state.atom";

const ChildMenu: React.FC<IChildMenu.IProps> = props => {
    const { path } = props;

    const router = useRouter();
    const setIsDrawerOpen = useSetRecoilState(drawerState);
    const [chatScreenRecoil, setChatScreenRecoil] =
        useRecoilState(chatScreenState);

    const onClickChildMenu = (event: React.MouseEvent) => {
        setChatScreenRecoil(false);
        setIsDrawerOpen(false);

        // router.push(path); // <a> 태그로 대체 ( 새탭 열기 때문 )
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            // Open in new tab
            window.open(path, "_blank");
        } else {
            // Navigate in the same tab
            router.push(path);
        }
    };

    return (
        <VChildMenu
            {...props}
            onClickChildMenu={onClickChildMenu}
            isCurrentMenu={router.pathname === path}
        />
    );
};

export default ChildMenu;
