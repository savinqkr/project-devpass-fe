import { IAttachmentInput } from "./AttachmentInput.interface";
import VAttachmentInput from "./AttachmentInput.view";
import { AttachmentState } from "@enums";

const AttachmentInput: React.FC<IAttachmentInput.IProps> = props => {
    const { files, setFiles, isMultiple } = props;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files![0];
        if (selectedFile) {
            const updatedFiles = isMultiple
                ? [
                      ...(files || []),
                      { file: selectedFile, tag: AttachmentState.NEW },
                  ]
                : [{ file: selectedFile, tag: AttachmentState.NEW }];
            setFiles(updatedFiles);
        }
    };

    const handleDelete = (index: number) => {
        const updatedFiles = [...(files || [])];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    return (
        <VAttachmentInput
            {...props}
            files={files}
            handleFileChange={handleFileChange}
            handleDelete={handleDelete}
        />
    );
};

export default AttachmentInput;
