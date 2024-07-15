import { IMuiDataGrid } from "./MuiDataGrid.interface";
import VMuiDataGrid from "./MuiDataGrid.view";

const MuiDataGrid: React.FC<IMuiDataGrid.IProps> = props => {
    return <VMuiDataGrid {...props} />;
};

export default MuiDataGrid;
