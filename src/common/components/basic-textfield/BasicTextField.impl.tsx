import { IBasicTextField } from "./BasicTextField.interface";
import VBasicTextField from "./BasicTextField.view";

/**
 *
 * @param {startAdornment}  Field 왼쪽에 단위 표시
 * @param {startAdornment}  Field 오른쪽에 단위 표시
 */
const BasicTextField: React.FC<IBasicTextField.IProps> = props => {
    const { allowedPattern } = props;

    const handleBeforeInput = (event: any) => {
        if (allowedPattern !== undefined) {
            const newChar = event.nativeEvent.data;
            if (newChar && !allowedPattern?.test(newChar)) {
                event.preventDefault();
            }
        }
    };

    return <VBasicTextField {...props} handleBeforeInput={handleBeforeInput} />;
};

export default BasicTextField;
