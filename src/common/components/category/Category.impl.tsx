import { ICategory } from "./Category.interface";
import VCategory from "./Category.view";

const Category: React.FC<ICategory.IProps> = props => {
    return <VCategory {...props} />;
};

export default Category;
