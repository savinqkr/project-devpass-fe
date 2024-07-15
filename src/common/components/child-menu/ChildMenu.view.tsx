import { css } from "@emotion/react";
import { IChildMenu } from "./ChildMenu.interface";
import { Colors } from "@configs/colors";

const VChildMenu: React.FC<IChildMenu.IVProps> = props => {
    const { name, path, disabled, onClickChildMenu, isCurrentMenu } = props;

    return (
        <div
            css={rootStyle(isCurrentMenu, disabled || false)}
            onClick={() => {
                if (!disabled) {
                    onClickChildMenu();
                }
            }}
        >
            {!disabled ? <a href={path}>{name}</a> : <span>{name}</span>}
        </div>
    );
};

export default VChildMenu;

const rootStyle = (isCurrentMenu: boolean, disabled: boolean) => css`
    padding: 8px 0px 8px 30px;
    font-size: 14px;
    font-weight: 500;
    color: ${isCurrentMenu
        ? Colors.oceanBlue
        : disabled
          ? Colors.grayC
          : Colors.charcoalGray};
    cursor: ${disabled ? "default" : "pointer"};
    &:hover {
        color: ${!disabled && Colors.oceanBlue};
    }
`;
