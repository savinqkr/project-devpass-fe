import { useState } from "react";
import { IBasicMarkdown } from "./BasicMarkdown.interface";
import VBasicMarkdown from "./BasicMarkdown.view";

const BasicMarkdown: React.FC<IBasicMarkdown.IProps> = props => {
    return <VBasicMarkdown {...props} />;
};

export default BasicMarkdown;
