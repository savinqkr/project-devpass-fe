import { useState } from "react";
import { IBasicSnackBar } from "./BasicSnackBar.interface";
import VBasicSnackBar from "./BasicSnackBar.view";

const BasicSnackBar: React.FC<IBasicSnackBar.IProps> = props => {
    const { setIsOpen } = props;

    const onClose = () => {
        setIsOpen(false);
    };

    return <VBasicSnackBar onClose={onClose} {...props} />;
};

export default BasicSnackBar;
