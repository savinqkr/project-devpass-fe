import { css } from "@emotion/react";
import { IBasicButton } from "./BasicButton.interface";
import { Button, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";

const VBasicButton: React.FC<IBasicButton.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const {
        width,
        height,
        type,
        title,
        color,
        elevationDisabled,
        isDisabled,
        isResponsive,
        icon,
        isSubmitBtn,
        onClick,
        borderRadius,
    } = props;

    return (
        <>
            {isResponsive && isMedium ? (
                <Button
                    id="small-btn"
                    type={isSubmitBtn ? "submit" : "button"}
                    variant={type}
                    css={smallButtonStyle}
                    color={color}
                    onClick={onClick}
                    disabled={isDisabled}
                    disableElevation={elevationDisabled}
                    sx={{ borderRadius: borderRadius }}
                >
                    {icon}
                </Button>
            ) : (
                <Button
                    type={isSubmitBtn ? "submit" : "button"}
                    variant={type}
                    css={buttonStyle(width, height)}
                    color={color}
                    onClick={onClick}
                    disabled={isDisabled}
                    disableElevation={elevationDisabled}
                    sx={{ borderRadius: borderRadius }}
                >
                    {title}
                </Button>
            )}
        </>
    );
};

export default VBasicButton;

const smallButtonStyle = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
`;

const buttonStyle = (width: string, height?: string) => css`
    width: ${width};
    height: ${height};

    #small-btn {
        width: ${height ? height : "56px"};
        height: ${height};
    }
    #icon {
        width: 27px;
    }
`;
