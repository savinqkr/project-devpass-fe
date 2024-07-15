import { IParentMenu } from "./ParentMenu.interface";
import VParentMenu from "./ParentMenu.view";
import { useRecoilState } from "recoil";
import currentMenuState from "@recoils/current-menu-state.atom";

const ParentMenu: React.FC<IParentMenu.IProps> = props => {
    const { name } = props;

    const [currentMenu, setCurrentMenu] = useRecoilState(currentMenuState);

    const isOpen = currentMenu.some(
        menu => menu.parentMenu === name && menu.isOpen
    );

    const onClickOpenParentMenu = () => {
        setCurrentMenu([
            ...currentMenu,
            {
                parentMenu: name,
                isOpen: true,
            },
        ]);
    };
    const onClickClosearentMenu = () => {
        const updatedMenu = currentMenu.filter(
            menu => menu.parentMenu !== name
        );
        setCurrentMenu(updatedMenu);
    };

    return (
        <VParentMenu
            {...props}
            isOpen={isOpen}
            onClickOpenParentMenu={onClickOpenParentMenu}
            onClickClosearentMenu={onClickClosearentMenu}
        />
    );
};

export default ParentMenu;
