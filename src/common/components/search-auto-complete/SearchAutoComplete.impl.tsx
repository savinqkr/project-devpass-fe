import { ISearchAutoComplete } from "./SearchAutoComplete.interface";
import VSearchAutoComplete from "./SearchAutoComplete.view";

const SearchAutoComplete: React.FC<ISearchAutoComplete.IProps> = props => {
    return <VSearchAutoComplete {...props} />;
};

export default SearchAutoComplete;
