import { IProductDetailTable } from "./ProductDetailTable.interface";
import VProductDetailTable from "./ProductDetailTable.view";

const ProductDetailTable: React.FC<IProductDetailTable.IProps> = props => {
    return <VProductDetailTable {...props} />;
};

export default ProductDetailTable;
