import { IBasicDatePicker } from "./BasicDatePicker.interface";
import VBasicDatePicker from "./BasicDatePicker.view";

/**
 *
 * @param errMsg 값을 선택하지 않은 경우 보여지는 메세지. Ex) "날짜를 선택해주세요."
 */
const BasicDatePicker: React.FC<IBasicDatePicker.IProps> = props => {
    return <VBasicDatePicker {...props} />;
};

export default BasicDatePicker;
