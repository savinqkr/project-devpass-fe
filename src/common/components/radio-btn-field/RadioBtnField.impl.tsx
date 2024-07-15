import { IRadioBtnField } from "./RadioBtnField.interface";
import VRadioBtnField from "./RadioBtnField.view";

const RadioBtnField: React.FC<IRadioBtnField.IProps> = props => {
    return <VRadioBtnField {...props} />;
};

export default RadioBtnField;
