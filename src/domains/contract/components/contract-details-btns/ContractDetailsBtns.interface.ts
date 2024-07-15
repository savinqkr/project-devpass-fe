import { ProductType } from "@enums";

export namespace IContractDetailsBtns {
    export interface IProps {
        type: ProductType;
        isCanceled: boolean;
    }
    export interface IVProps extends IProps {
        onClickUpdated: () => void;
        onClickDeleted: () => void;
    }
}
