import { Dispatch, SetStateAction } from "react";
import { UseFormRegister } from "react-hook-form";

export namespace IBasicAttachmentInput {
    export interface IProps {
        register: UseFormRegister<any>;
        registerKey: string;
        isRequired: boolean;
        isMultiple?: boolean;
        isChip?: boolean;
        label?: string;
        htmlFor: string;
        spaceWidth: string;
        file?: File;
        setFile?: Dispatch<SetStateAction<File | undefined>>;
        files?: File[];
        setFiles?: Dispatch<SetStateAction<File[]>>;
    }
    export interface IVProps extends IProps {
        handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleDeleteFile: (index?: number) => void;
    }
    export interface IForm {}
}
