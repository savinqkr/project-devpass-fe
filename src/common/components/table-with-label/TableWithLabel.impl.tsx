import { ITableWithLabel } from "./TableWithLabel.interface";
import VTableWithLabel from "./TableWithLabel.view";

const TableWithLabel: React.FC<ITableWithLabel.IProps> = props => {
    return <VTableWithLabel {...props} />;
};

export default TableWithLabel;
