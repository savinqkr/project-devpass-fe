import { ILicenseContractDetailsTable } from "./ContractDetailsTable.interface";
import VLicenseContractDetailsTable from "./ContractDetailsTable.view";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import contractService from "@domains/contract/services/graphql/contract.service";
import { useEffect, useState } from "react";
import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import dayjs from "dayjs";
import estimateService from "@domains/estimate/services/estimate.service";
import { CodeCategory } from "src/enums/code_category.enum";
import codeService from "@common/services/code/code.service";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { EstimateDetailsOptionTypeEnum, ProductType } from "@enums";
import { TextareaCell } from "@common/components";
import PATH from "@constants/path";
import { Box, Typography } from "@mui/material";

const LicenseContractDetailsTable: React.FC<
    ILicenseContractDetailsTable.IProps
> = props => {
    const router = useRouter();
    const id: string = router.query.id as string;

    const { type } = props;

    // ---------------------------------------------------------------------------------------------
    // ----------------------------- [ P R O D U C T  T A B L E ] ----------------------------------
    var [detailsRows, setDetailsRows] = useState<GridRowsProp>([]);
    var detailsColumns: GridColDef[] =
        type === ProductType.MAINTENANCE
            ? [
                  { width: 50, headerName: "No.", field: "id" },
                  { width: 200, headerName: "구분", field: "type" },
                  { width: 100, headerName: "용도", field: "purpose" },
                  { width: 100, headerName: "Class", field: "class" },
                  { width: 240, headerName: "품목명", field: "name" },
                  {
                      field: EstimateDetailsOptionTypeEnum.DETAILS,
                      headerName: "세부내역",
                      width: 280,
                      type: "string",
                      renderCell: params => <TextareaCell {...params} />,
                  },
                  { width: 80, headerName: "단위", field: "unit" },
                  { width: 80, headerName: "수량", field: "amount" },
                  { width: 180, headerName: "단가", field: "price" },

                  { width: 180, headerName: "공급금액", field: "supply_price" },
                  {
                      width: 180,
                      headerName: "월유지보수금액",
                      field: "monthly_repair_price",
                  },
                  {
                      width: 180,
                      headerName: "총유지보수금액",
                      field: "total_repair_price",
                  },
                  {
                      field: "repair_period",
                      headerName: "유지보수 기간",
                      width: 240,
                      renderCell({ id, row }) {
                          return (
                              <Box
                                  sx={{
                                      position: "relative",
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      width: "100%",
                                  }}
                              >
                                  <Typography
                                      sx={{
                                          fontSize: 12,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                      }}
                                  >
                                      {`${row.start_date} ~ ${row.end_date} ( ${row.period} 개월 )`}
                                  </Typography>
                              </Box>
                          );
                      },
                  },
              ]
            : [
                  { width: 50, headerName: "No.", field: "id" },
                  { width: 200, headerName: "구분", field: "type" },
                  { width: 100, headerName: "용도", field: "purpose" },
                  { width: 100, headerName: "Class", field: "class" },
                  { width: 240, headerName: "품목명", field: "name" },
                  {
                      field: EstimateDetailsOptionTypeEnum.DETAILS,
                      headerName: "세부내역",
                      width: 280,
                      type: "string",
                      renderCell: params => <TextareaCell {...params} />,
                  },
                  { width: 80, headerName: "단위", field: "unit" },
                  { width: 80, headerName: "수량", field: "amount" },
                  { width: 180, headerName: "단가", field: "price" },
                  {
                      width: 180,
                      headerName: "기준금액",
                      field: "standard_price",
                  },
                  { width: 180, headerName: "공급금액", field: "supply_price" },

                  {
                      field: EstimateDetailsOptionTypeEnum.NOTE,
                      headerName: "비고",
                      width: 240,
                      type: "string",
                      renderCell: params => <TextareaCell {...params} />,
                  },
              ];
    const onClickRow = (id: number) => {
        router.push(`${PATH.LICENSE.CONTRACT.MAIN}/${id}`);
    };

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    var [contract, setContract] = useState<
        ILicenseContractDetailsTable.IContract | undefined
    >();

    const dateFormat = (date: Date) => {
        return date ? dayjs(date).format("YYYY년 MM월 DD일") : date;
    };

    // 계약 정보 조회
    const { data: contractData, mutate: getContractOneByIdMutation } =
        useMutation(
            ["getContractOneById"],
            () => contractService.getContractOneById({ id: parseInt(id) }),
            {
                onSuccess(data) {
                    // console.log(data);
                    const {
                        id,
                        client,
                        project,
                        contractor,
                        name,
                        contract_period_start,
                        contract_period_end,
                        contract_date,
                        contract_amount,
                        including_vat,
                        sales_representative,
                        performance_guarantee_rate,
                        defect_performance_guarantee_rate,
                        defect_warranty_period_start,
                        defect_warranty_period_end,
                        issuing_site,
                        issuance_method,
                        inspection_target,
                        inspection_site,
                        monthly_standard_amount,
                        billing_cycle,
                        billing_amount_once,
                        billing_date,
                        payment_timing,
                        note,
                        deleted_at,
                    } = data.contract_by_pk;

                    setContract({
                        id,
                        client: client.name,
                        project: project.name,
                        contractor: contractor.name,
                        name,
                        contract_period_start: dateFormat(
                            contract_period_start
                        ),
                        contract_period_end: dateFormat(contract_period_end),
                        contract_date: dateFormat(contract_date),
                        contract_amount: removeCurrencyOfMoney(contract_amount),
                        including_vat: removeCurrencyOfMoney(including_vat),
                        sales_representative: sales_representative.name,

                        is_canceled: project.is_canceled,
                        performance_guarantee_rate,
                        defect_performance_guarantee_rate:
                            defect_performance_guarantee_rate,
                        defect_warranty_period_start: dateFormat(
                            defect_warranty_period_start
                        ),
                        defect_warranty_period_end: dateFormat(
                            defect_warranty_period_end
                        ),
                        issuing_site: issuing_site,
                        issuance_method: issuance_method.value,
                        inspection_target,
                        inspection_site,
                        monthly_standard_amount: removeCurrencyOfMoney(
                            monthly_standard_amount
                        ),
                        billing_cycle: billing_cycle.value,
                        billing_amount_once:
                            removeCurrencyOfMoney(billing_amount_once),
                        billing_date,
                        payment_timing,
                        note,

                        deleted_at,
                    });
                },
            }
        );

    useEffect(() => {
        if (router.isReady) {
            getContractOneByIdMutation();
        }
    }, [router.isReady]);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ E S T I M A T E S ] -------------------------------------

    const { data: commonType } = useQuery(["getCommonCode"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: type },
            },
        })
    );

    const [finalEstimate, setFinalEstimate] = useState<number>();

    const [isFinalEstimateOpen, setIsFinalEstimateOpen] =
        useState<boolean>(false);

    const handleFinalEstimateOpen = () => {
        setIsFinalEstimateOpen(true);
    };

    const handleFinalEstimateClose = () => {
        setIsFinalEstimateOpen(false);
        setFinalEstimate(undefined);
    };

    const {} = useQuery(
        ["getEstimatesData"],
        () =>
            estimateService.getFinalEstimateByProject({
                project_id: contractData?.contract_by_pk.project.id!,
                type_code: commonType?.common_code[0].code!,
            }),
        {
            enabled: Boolean(
                commonType && contractData?.contract_by_pk.project.id
            ),
            onSuccess(data) {
                setFinalEstimate(data.estimate[0].id);

                const details = data.estimate[0].details
                    .sort((a, b) => a.row_index - b.row_index)
                    .map((item, idx) => {
                        const period = dayjs(item.start_date).diff(
                            dayjs(item.end_date),
                            "month"
                        );

                        return {
                            id: idx + 1,
                            pk: item.product + idx,
                            name: item.product,
                            purpose: item.purpose,
                            class: item.class,
                            type: item.type,
                            details: item.details,
                            unit: item.unit,
                            amount: item.amount,
                            price: `${removeCurrencyOfMoney(item.price)}원`,
                            note: item.note,
                            standard_price: `${removeCurrencyOfMoney(
                                item.standard_price
                            )}원`,
                            supply_price: `${removeCurrencyOfMoney(
                                item.supply_price
                            )}원`,
                            monthly_repair_price: `${removeCurrencyOfMoney(
                                item.monthly_repair_price
                            )}원`,
                            total_repair_price: `${removeCurrencyOfMoney(
                                item.total_repair_price
                            )}원`,
                            start_date: dayjs(item.start_date).format(
                                "YYYY/MM/DD"
                            ),
                            end_date: dayjs(item.end_date).format("YYYY/MM/DD"),
                            period: period,
                        };
                    });
                setDetailsRows(details);
            },
        }
    );

    return (
        <VLicenseContractDetailsTable
            contract={contract}
            onClickRow={onClickRow}
            detailsColumns={detailsColumns.map(item => {
                return {
                    ...item,
                    field: item.field,
                    headerName: item.headerName,
                    flex: item.flex,
                    width: item.width,
                    sortable: false,
                    align: "center",
                    headerAlign: "center",
                };
            })}
            detailsRows={detailsRows}
            isFinalEstimateOpen={isFinalEstimateOpen}
            handleFinalEstimateOpen={handleFinalEstimateOpen}
            handleFinalEstimateClose={handleFinalEstimateClose}
            finalEstimate={finalEstimate}
            {...props}
        />
    );
};

export default LicenseContractDetailsTable;
