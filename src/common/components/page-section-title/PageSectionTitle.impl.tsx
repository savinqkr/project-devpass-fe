import { IPageSectionTitle } from "./PageSectionTitle.interface";
import VPageSectionTitle from "./PageSectionTitle.view";

const PageSectionTitle: React.FC<IPageSectionTitle.IProps> = props => {
    return <VPageSectionTitle {...props} />;
};

export default PageSectionTitle;
