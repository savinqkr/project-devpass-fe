export namespace IChildMenu {
    export interface IProps {
        name: string;
        path: string;
        disabled?: boolean;
    }
    export interface IVProps extends IProps {
        onClickChildMenu: (event: React.MouseEvent) => void;
        isCurrentMenu: boolean;
    }
}
