import { SetterOrUpdater } from "recoil";

export namespace IHeader {
    export interface IProps {}
    export interface IVProps extends IProps {
        open: boolean;
        anchorEl: HTMLElement | null;
        handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        handleClose: () => void;
        onClickLogout: () => void;
        isDrawerOpen: boolean;
        setIsDrawerOpen: SetterOrUpdater<boolean>;
        // session: string;
        // sessionBarValue: number;
        // onClickRefreshSession: () => void;
    }
    export interface IForm {}
}
