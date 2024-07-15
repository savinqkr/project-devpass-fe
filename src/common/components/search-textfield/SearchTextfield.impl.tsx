import { ISearchTextfield } from "./SearchTextfield.interface";
import VSearchTextfield from "./SearchTextfield.view";

/**
 *
 * @param errMsg 값을 선택하지 않았을 경우 보여지는 메세지. Ex) "값을 선택해주세요."
 * @param height 40px 미만으로 내려가지 않는 것을 권장드립니다. ( 기본 56px )
 */
const SearchTextfield: React.FC<ISearchTextfield.IProps> = props => {
    // const { placeholder } = props;
    return (
        <VSearchTextfield
            {...props}
            // options={[
            //     { value: "default", label: placeholder ?? "선택해주세요" },
            //     ...props.options,
            // ]}
        />
    );
};

export default SearchTextfield;
