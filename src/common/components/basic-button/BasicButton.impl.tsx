import { IBasicButton } from "./BasicButton.interface";
import VBasicButton from "./BasicButton.view";

const BasicButton: React.FC<IBasicButton.IProps> = props => {
    return <VBasicButton {...props} />;
};

export default BasicButton;
