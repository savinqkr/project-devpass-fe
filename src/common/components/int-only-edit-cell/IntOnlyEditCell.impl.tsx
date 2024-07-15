import { IIntOnlyEditInputCell } from "./IntOnlyEditCell.interface";
import VIntOnlyEditInputCell from "./IntOnlyEditCell.view";

const IntOnlyEditInputCell: React.FC<IIntOnlyEditInputCell.IProps> = props => {
    const { id, value, field, api } = props;

    const handleChange = (event: any) => {
        const newValue = event.target.value;
        if (/^\d*$/.test(newValue)) {
            api.setEditCellValue({ id, field, value: newValue });
        }
    };

    return <VIntOnlyEditInputCell {...props} handleChange={handleChange} />;
};

export default IntOnlyEditInputCell;
