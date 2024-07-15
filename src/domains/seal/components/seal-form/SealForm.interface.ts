import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { ModalMode } from "@enums";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ISealForm {
    export interface IProps {
        title: string;
        mode: ModalMode;
        register: UseFormRegister<ISealForm.IForm>;
        errors: FieldErrors<ISealForm.IForm>;
        onClickSubmit: () => void;
        isDisabled: boolean;
        onClickClose: () => void;
        seal: IAttachmentInput.IAttachment[] | undefined;
        setSeal: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
    }
    export interface IVProps extends IProps {}
    export interface IForm {
        seal?: IAttachmentInput.IAttachment[];
        originalSeal?: IAttachmentInput.IAttachment[];
    }
}
