export namespace IProductDetailTable {
    export interface IProps {
        productData: IProduct | undefined;
    }
    export interface IVProps extends IProps {}

    export interface IProduct {
        type: string;
        purpose: string;
        class: string;
        name: string;
        unit: string;
        price: string;
        note: string;
        created_at: string;
        updated_at: string;
        deleted_at: string;
    }
}
