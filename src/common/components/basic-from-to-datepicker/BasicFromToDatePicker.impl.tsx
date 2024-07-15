import { IBasicFromToDatePicker } from "./BasicFromToDatePicker.interface";
import VBasicFromToDatePicker from "./BasicFromToDatePicker.view";

/**
 *
 * @param errMsg 날짜를 선택하지 않았을 경우 보여지는 메세지.
 * @example errMsg={{ from: "시작일을 선택해주세요.", to: "종료일을 선택해주세요."}}
 */
const BasicFromToDatePicker: React.FC<
    IBasicFromToDatePicker.IProps
> = props => {
    return <VBasicFromToDatePicker {...props} />;
};

export default BasicFromToDatePicker;
