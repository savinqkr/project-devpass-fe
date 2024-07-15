import { IAutoCompleteTextfield } from "./AutoCompleteTextfield.interface";
import VAutoCompleteTextfield from "./AutoCompleteTextfield.view";

const AutoCompleteTextfield: React.FC<
    IAutoCompleteTextfield.IProps
> = props => {
    return <VAutoCompleteTextfield {...props} />;
};

export default AutoCompleteTextfield;
