import { css } from "@emotion/react";
import { IMenu } from "./Menu.interface";
import ParentMenu from "../parent-menu";
import MENUS from "@constants/menus";

const VMenu: React.FC<IMenu.IVProps> = props => {
    return (
        <div css={rootStyle}>
            {MENUS.map(item => (
                <ParentMenu
                    key={item.parent}
                    name={item.parent}
                    children={item.children}
                />
            ))}
        </div>
    );
};

export default VMenu;

const rootStyle = css`
    width: 250px;
    min-width: 250px;
    max-width: 250px;
    height: 100%;
    padding: 32px 0px;
    box-shadow: 4px 0px 4px -2px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
`;
