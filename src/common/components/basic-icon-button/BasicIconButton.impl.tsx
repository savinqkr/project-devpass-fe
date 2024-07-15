import { IBasicIconButton } from "./BasicIconButton.interface";
import VBasicIconButton from "./BasicIconButton.view";

const BasicIconButton: React.FC<IBasicIconButton.IProps> = props => {
    return <VBasicIconButton {...props} />;
};

export default BasicIconButton;
