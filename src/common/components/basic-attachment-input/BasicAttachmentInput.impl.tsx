import { IBasicAttachmentInput } from "./BasicAttachmentInput.interface";
import VBasicAttachmentInput from "./BasicAttachmentInput.view";

const BasicAttachmentInput: React.FC<IBasicAttachmentInput.IProps> = props => {
    const { file, setFile, files, setFiles, isMultiple } = props;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (!isMultiple) {
                setFile!(selectedFile);
            } else {
                setFiles!([...(files || []), selectedFile]);
            }
        }
    };
    const handleDeleteFile = (index?: number) => {
        if (isMultiple) {
            const updatedFiles = [...files!];
            updatedFiles.splice(index!, 1);
            setFiles!(updatedFiles);
        } else {
            setFile!(undefined);
        }
    };

    return (
        <VBasicAttachmentInput
            {...props}
            handleFileChange={handleFileChange}
            handleDeleteFile={handleDeleteFile}
        />
    );
};

export default BasicAttachmentInput;
