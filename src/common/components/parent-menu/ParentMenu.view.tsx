import { css } from "@emotion/react";
import { IParentMenu } from "./ParentMenu.interface";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import ChildMenu from "../child-menu/ChildMenu.impl";
import { Colors } from "@configs/colors";

const VParentMenu: React.FC<IParentMenu.IVProps> = props => {
    const {
        name,
        children,
        isOpen,
        onClickClosearentMenu,
        onClickOpenParentMenu,
    } = props;
    return (
        <div css={rootStyle}>
            <div css={parentMenuStyle}>
                <span>{name}</span>
                <div
                    className="toggleBtn"
                    onClick={() =>
                        isOpen
                            ? onClickClosearentMenu()
                            : onClickOpenParentMenu()
                    }
                >
                    {isOpen ? (
                        <IoChevronUp size={18} />
                    ) : (
                        <IoChevronDown size={18} />
                    )}
                </div>
            </div>
            {isOpen &&
                children.map(item => {
                    return (
                        <div key={`cat-${name}-${item.category}`}>
                            {/* <Category category={item.category} /> */}
                            {item.menus.map(ele => (
                                <ChildMenu
                                    key={`cm-${name}-${item.menus.indexOf(
                                        ele
                                    )}`}
                                    name={ele.name}
                                    path={ele.path}
                                    disabled={ele.disabled}
                                />
                            ))}
                        </div>
                    );
                })}
        </div>
    );
};

export default VParentMenu;

const rootStyle = css`
    margin-bottom: 16px;
`;

const parentMenuStyle = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 18px;
    font-size: 16px;
    font-weight: 500;
    color: ${Colors.charcoalGray};
    .toggleBtn {
        width: 20px;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
`;
