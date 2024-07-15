import { IBasicChipField } from "./BasicChipField.interface";
import VBasicChipField from "./BasicChipField.view";

/**
 *
 * @param errMsg 값을 선택하지 않은 경우 보여지는 메세지. Ex) "날짜를 선택해주세요."
 */
const BasicChipField: React.FC<IBasicChipField.IProps> = props => {
    return <VBasicChipField {...props} />;
};

export default BasicChipField;
