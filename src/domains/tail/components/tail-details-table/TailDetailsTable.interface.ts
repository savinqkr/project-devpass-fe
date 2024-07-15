export namespace ITailDetailsTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        tail: IVTail | undefined;
        onClickDelete: () => void;
    }
    export interface IVTail {
        type: string;
        name: string;
        contents: string;
        deleted_at: Date;
    }
}
