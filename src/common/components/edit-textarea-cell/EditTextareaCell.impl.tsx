import { useCallback, useLayoutEffect, useState } from "react";
import { IEditTextareaCell } from "./EditTextareaCell.interface";
import VEditTextareaCell from "./EditTextareaCell.view";
import { useGridApiContext } from "@mui/x-data-grid";
import { InputBaseProps } from "@mui/material";

function isKeyboardEvent(event: any): event is React.KeyboardEvent {
    return !!event.key;
}

const EditTextareaCell: React.FC<IEditTextareaCell.IProps> = props => {
    const { id, field, value, colDef, hasFocus } = props;

    const [valueState, setValueState] = useState(value);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

    const apiRef = useGridApiContext();

    useLayoutEffect(() => {
        if (hasFocus && inputRef) {
            inputRef.focus();
        }
    }, [hasFocus, inputRef]);

    const handleRef = useCallback((el: HTMLElement | null) => {
        setAnchorEl(el);
    }, []);

    const handleChange = useCallback<NonNullable<InputBaseProps["onChange"]>>(
        event => {
            const newValue = event.target.value;
            setValueState(newValue);
            apiRef.current.setEditCellValue(
                { id, field, value: newValue, debounceMs: 200 },
                event
            );
        },
        [apiRef, field, id]
    );

    return (
        <VEditTextareaCell
            {...props}
            handleRef={handleRef}
            anchorEl={anchorEl}
            colDef={colDef}
            valueState={valueState}
            handleChange={handleChange}
            setInputRef={setInputRef}
        />
    );
};

export default EditTextareaCell;
