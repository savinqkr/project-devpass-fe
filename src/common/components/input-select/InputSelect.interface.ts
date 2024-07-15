import { SelectChangeEvent } from "@mui/material";
import { UseFormGetValues, UseFormRegister } from "react-hook-form";

export namespace IInputSelect {
    export interface IProps {
        label: string;
        type: string; // Form Interface에서 할당할 대상 ex) name, class...
        isRequired: boolean;
        optionItems: { code: string; value: string }[];
        register: UseFormRegister<any>;
        defaultValue?: number;
    }
    export interface IVProps extends IProps {
        selectedValue: string;
        onChange: (event: SelectChangeEvent) => void;
    }
}
