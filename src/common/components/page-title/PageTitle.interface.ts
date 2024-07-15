export namespace IPageTitle {
    export interface IProps {
        title: string;
        isVisible: boolean;
        path?: string; // 이동할 페이지 path
    }
    export interface IVProps extends IProps {
        onClickRouteBack: () => void;
    }
}
