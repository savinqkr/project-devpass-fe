export namespace ITailDetailsBtns {
    export interface IProps {}
    export interface IVProps extends IProps {
        onClickDeleted: () => void;
        onClickUpdated: () => void;
    }
}
