import { EstimateDetailsOptionTypeEnum } from "@enums";
import { ICustomizeEstimateDetail } from "./CustomizeEstimateDetail.interface";
import VTechSupportEstimateDetail from "./CustomizeEstimateDetail.view";
import { GridColDef } from "@mui/x-data-grid";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import { TextareaCell } from "@common/components";

const CustomizeEstimateDetail: React.FC<
    ICustomizeEstimateDetail.IProps
> = props => {
    const { estimateData } = props;

    const detailColumns: GridColDef[] = [
        {
            field: EstimateDetailsOptionTypeEnum.TYPE,
            headerName: "구분",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.PURPOSE,
            headerName: "용도",
            width: 160,
        },
        {
            field: EstimateDetailsOptionTypeEnum.CLASS,
            headerName: "Class",
            width: 160,
        },
        {
            field: EstimateDetailsOptionTypeEnum.PRODUCT,
            headerName: "품목",
            width: 240,
        },
        {
            field: EstimateDetailsOptionTypeEnum.DETAILS,
            headerName: "세부내역",
            width: 280,
            type: "string",
            renderCell: params => <TextareaCell {...params} />,
        },
        {
            field: EstimateDetailsOptionTypeEnum.UNIT,
            headerName: "단위",
            width: 160,
        },
        {
            field: EstimateDetailsOptionTypeEnum.AMOUNT,
            headerName: "수량",
            width: 120,
        },
        {
            field: EstimateDetailsOptionTypeEnum.PRICE,
            headerName: "단가",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.STANDARD_PRICE,
            headerName: "기준금액",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.SUPPLY_PRICE,
            headerName: "공급금액",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.NOTE,
            headerName: "비고",
            width: 400,
            type: "string",
            renderCell: params => <TextareaCell {...params} />,
        },
    ];
    return (
        <VTechSupportEstimateDetail
            {...props}
            detailRows={
                estimateData?.estimate_by_pk.details
                    .sort((a, b) => a.row_index - b.row_index)
                    .map((row, idx) => ({
                        id: idx,
                        [EstimateDetailsOptionTypeEnum.TYPE]: row.type,
                        [EstimateDetailsOptionTypeEnum.PURPOSE]: row.purpose,
                        [EstimateDetailsOptionTypeEnum.CLASS]: row.class,
                        [EstimateDetailsOptionTypeEnum.PRODUCT]: row.product,
                        [EstimateDetailsOptionTypeEnum.DETAILS]: row.details,
                        [EstimateDetailsOptionTypeEnum.UNIT]: row.unit,
                        [EstimateDetailsOptionTypeEnum.AMOUNT]: numberToMoney(
                            row.amount
                        ),
                        [EstimateDetailsOptionTypeEnum.PRICE]: numberToMoney(
                            moneyToNumber(row.price)
                        ),
                        [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                            numberToMoney(
                                moneyToNumber(row.standard_price || "")
                            ),
                        [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                            numberToMoney(moneyToNumber(row.supply_price)),
                        [EstimateDetailsOptionTypeEnum.NOTE]: row.note,
                    })) || []
            }
            detailColumns={detailColumns.map(col => ({
                ...col,
                field: col.field,
                headerName: col.headerName,
                flex: col.flex,
                width: col.width,
                sortable: true,
                align: "center",
                headerAlign: "center",
            }))}
        />
    );
};

export default CustomizeEstimateDetail;
