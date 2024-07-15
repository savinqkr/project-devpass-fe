import { ISearchSelector } from "./SearchSelector.interface";
import VSearchSelector from "./SearchSelector.view";

const SearchSelector: React.FC<ISearchSelector.IProps> = props => {
    const { placeholder } = props;

    return (
        <VSearchSelector
            {...props}
            options={[
                { value: "default", label: placeholder ?? "선택해주세요" },
                ...props.options,
            ]}
        />
    );
};

export default SearchSelector;
