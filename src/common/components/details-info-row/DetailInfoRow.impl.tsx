import { IDetailInfoRow } from "./DetailInfoRow.interface";
import VDetailInfoRow from "./DetailInfoRow.view";

const DetailInfoRow: React.FC<IDetailInfoRow.IProps> = props => {
    return <VDetailInfoRow {...props} />;
};

export default DetailInfoRow;
