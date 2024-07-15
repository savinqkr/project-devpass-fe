import { GridColDef } from "@mui/x-data-grid";
import { IRepairEstiamteDetail } from "./RepairEstiamteDetail.interface";
import VRepairEstiamteDetail from "./RepairEstiamteDetail.view";
import { EstimateDetailsOptionTypeEnum } from "@enums";
import numberToMoney from "@utils/numberToMoney";
import moneyToNumber from "@utils/moneyToNumber";
import dayjs from "dayjs";
import { TextareaCell } from "@common/components";

const RepairEstiamteDetail: React.FC<IRepairEstiamteDetail.IProps> = props => {
    const { estimateData } = props;

    const detailColumns: GridColDef[] = [
        {
            field: EstimateDetailsOptionTypeEnum.LICENSE_PROJECT_NAME,
            headerName: "사업명",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.YEAR,
            headerName: "도입년도",
            width: 200,
        },
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
            field: EstimateDetailsOptionTypeEnum.SUPPLY_PRICE,
            headerName: "공급금액",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE,
            headerName: "월유지보수금액",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE,
            headerName: "총유지보수금액",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.START_DATE,
            headerName: "시작일",
            width: 200,
        },
        {
            field: EstimateDetailsOptionTypeEnum.END_DATE,
            headerName: "종료일",
            width: 200,
        },
    ];

    return (
        <VRepairEstiamteDetail
            {...props}
            detailRows={
                estimateData?.estimate_by_pk.details
                    .sort((a, b) => a.row_index - b.row_index)
                    .map((row, idx) => ({
                        id: idx,
                        [EstimateDetailsOptionTypeEnum.LICENSE_PROJECT_NAME]:
                            row.license_project_name,
                        [EstimateDetailsOptionTypeEnum.YEAR]: dayjs(
                            row.year
                        ).format("YYYY년"),
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
                        [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                            numberToMoney(moneyToNumber(row.supply_price)),
                        [EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE]:
                            numberToMoney(
                                moneyToNumber(row.monthly_repair_price || "0")
                            ),
                        [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                            numberToMoney(
                                moneyToNumber(row.total_repair_price || "0")
                            ),
                        [EstimateDetailsOptionTypeEnum.START_DATE]: dayjs(
                            row.start_date
                        ).format("YYYY년 MM월 DD일"),
                        [EstimateDetailsOptionTypeEnum.END_DATE]: dayjs(
                            row.end_date
                        ).format("YYYY년 MM월 DD일"),
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

export default RepairEstiamteDetail;
