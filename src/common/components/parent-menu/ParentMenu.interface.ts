export namespace IParentMenu {
    export interface IProps {
        name: string;
        children: {
            category: string;
            menus: {
                name: string;
                path: string;
                disabled?: boolean;
            }[];
        }[];
        setIsDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    }
    export interface IVProps extends IProps {
        isOpen: boolean;
        onClickOpenParentMenu: () => void;
        onClickClosearentMenu: () => void;
    }
}
