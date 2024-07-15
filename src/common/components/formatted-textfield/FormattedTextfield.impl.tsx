import { useState } from "react";
import { IFormattedTextfield } from "./FormattedTextfield.interface";
import VFormattedTextfield from "./FormattedTextfield.view";

const FormattedTextfield: React.FC<IFormattedTextfield.IProps> = props => {
    const { defaultValue } = props;

    const [value, setValue] = useState(defaultValue || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <VFormattedTextfield
            {...props}
            value={value}
            handleChange={handleChange}
        />
    );
};

export default FormattedTextfield;
