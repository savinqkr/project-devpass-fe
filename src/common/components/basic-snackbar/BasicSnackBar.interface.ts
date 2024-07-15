import { Theme } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

export namespace IBasicSnackBar {
    export interface IProps {
        isOpen: boolean;
        setIsOpen: Dispatch<SetStateAction<boolean>>;
        message: string;
    }
    export interface IVProps extends IProps {
        onClose: () => void;
    }
}
