import { IInputNote } from "./InputNote.interface";
import VInputNote from "./InputNote.view";

const InputNote: React.FC<IInputNote.IProps> = props => {
    return <VInputNote {...props} />;
};

export default InputNote;
