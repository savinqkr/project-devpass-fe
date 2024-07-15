import { useEffect, useState } from "react";
import { IInputSelect } from "./InputSelect.interface";
import VInputSelect from "./InputSelect.view";
import { SelectChangeEvent } from "@mui/material";

const InputSelect: React.FC<IInputSelect.IProps> = props => {
    const { defaultValue } = props;
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        setSelectedValue(defaultValue?.toString() ?? "");
    }, [defaultValue]);

    const onChange = (event: SelectChangeEvent) => {
        setSelectedValue(event.target.value);
    };

    return (
        <VInputSelect
            selectedValue={selectedValue}
            onChange={onChange}
            {...props}
        />
    );
};

export default InputSelect;
