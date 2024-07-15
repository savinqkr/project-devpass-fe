import { AttachmentState } from "@enums";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IAttachmentInput {
    export interface IProps {
        register: UseFormRegister<any>;
        registerKey: string;
        errors?: FieldErrors<any>;
        validate?: any;
        msg?: string;
        label?: string;
        isMultiple?: boolean;
        isRequired?: boolean;
        isChip?: boolean;
        htmlFor: string;
        accept?: string; // 예시 ) ".txt, .xls, .xlsx, .csv, .doc, .docx, .pptx, .pdf, image/*"
        spaceWidth: string;
        files: IAttachmentInput.IAttachment[] | undefined;
        setFiles: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
    }
    export interface IVProps extends IProps {
        // files: IAttachmentInput.IAttachment[] | undefined;
        handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleDelete: (index: number) => void;
    }
    export interface IAttachment {
        id?: number;
        file: File;
        tag: AttachmentState;
        bank_name?: string | null;
        bank_account?: string | null;
    }
}
