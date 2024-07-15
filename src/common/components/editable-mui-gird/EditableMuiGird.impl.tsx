import { IEditableMuiGird } from "./EditableMuiGird.interface";
import VEditableMuiGird from "./EditableMuiGird.view";

const EditableMuiGird: React.FC<IEditableMuiGird.IProps> = props => {
    return <VEditableMuiGird {...props} />;
};

export default EditableMuiGird;
