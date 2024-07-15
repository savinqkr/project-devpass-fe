import { IBasicTemplate } from "./BasicTemplate.interface";
import VBasicTemplate from "./BasicTemplate.view";

const BasicTemplate: React.FC<IBasicTemplate.IProps> = props => {
    return <VBasicTemplate {...props} />;
};

export default BasicTemplate;
