import { css } from "@emotion/react";
import { IBasicIconButton } from "./BasicIconButton.interface";
import { Button } from "@mui/material";

const VBasicIconButton: React.FC<IBasicIconButton.IVProps> = props => {
    const {
        width,
        height,
        type,
        icon,
        color,
        isDisabled,
        isSubmitBtn,
        onClick,
        borderRadius,
    } = props;
    return (
        <Button
            type={isSubmitBtn ? "submit" : "button"}
            variant={type}
            css={buttonStyle(width, height)}
            color={color}
            onClick={onClick}
            disabled={isDisabled}
            sx={{ borderRadius: borderRadius }}
        >
            {icon}
        </Button>
    );
};

export default VBasicIconButton;

const buttonStyle = (width: string, height?: string) => css`
    width: ${width};
    height: ${height};
    min-width: ${width};
    padding: 0;
`;
