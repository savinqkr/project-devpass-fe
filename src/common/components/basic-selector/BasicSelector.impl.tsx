import { IBasicSelector } from "./BasicSelector.interface";
import VBasicSelector from "./BasicSelector.view";

const BasicSelector: React.FC<IBasicSelector.IProps> = props => {
    const { placeholder, control } = props;

    return (
        <VBasicSelector
            {...props}
            options={[
                { value: "default", label: placeholder ?? "선택해주세요" },
                ...props.options,
            ]}
        />
    );
};

export default BasicSelector;
