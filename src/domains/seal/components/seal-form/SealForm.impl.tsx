import { ISealForm } from "./SealForm.interface";
import VSealForm from "./SealForm.view";

const SealForm: React.FC<ISealForm.IProps> = props => {
    return <VSealForm {...props} />;
};

export default SealForm;
