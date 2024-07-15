import { IMenuDrawer } from "./MenuDrawer.interface";
import VMenuDrawer from "./MenuDrawer.view";

const MenuDrawer: React.FC<IMenuDrawer.IProps> = props => {
    return <VMenuDrawer {...props} />;
};

export default MenuDrawer;
