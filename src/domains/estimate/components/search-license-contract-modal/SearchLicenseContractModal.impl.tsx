import { useRecoilState } from "recoil";
import { ISearchLicenseContractModal } from "./SearchLicenseContractModal.interface";
import VSearchLicenseContractModal from "./SearchLicenseContractModal.view";
import repairDetailsEstimateModalState from "@recoils/repair-estimate-detail-modal-state.atom";
import { useForm } from "react-hook-form";
import { GridColDef, GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import contractService from "@domains/contract/services/graphql/contract.service";
import { IOrder_By } from "src/codegen/graphql";
import dayjs from "dayjs";
import projectService from "@domains/project/service/project.service";
import { CommonType } from "src/enums/common_type.enum";

const SearchLicenseContractModal: React.FC<
    ISearchLicenseContractModal.IProps
> = props => {
    const [repairDetailsEstimateModal, setRepairDetailsEstimateModal] =
        useRecoilState(repairDetailsEstimateModalState);

    const { setValue, getValues, register, control, watch } =
        useForm<ISearchLicenseContractModal.ISearch>();

    // MUI DATAGRID API REF
    const dataGridApiRef = useGridApiRef();
    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: "id", headerName: "No.", flex: 0.5 },
        { field: "contract_period_start", headerName: "계약일", flex: 1 },
        { field: "project_name", headerName: "사업명", flex: 2 },
    ];

    // 선택한 사업에 등록된 라이선스 도입 사업 목록 조회
    const { data: registeredLicenseContracts } = useQuery(
        [
            `get registered license contracts of repair project ${repairDetailsEstimateModal.selectedRepairProjectId}`,
            repairDetailsEstimateModal,
        ],
        () =>
            projectService.getProjectByPk({
                id: repairDetailsEstimateModal.selectedRepairProjectId!,
            }),
        {
            enabled: !!repairDetailsEstimateModal.selectedRepairProjectId,
            onSuccess(data) {
                const licenseContractedIds =
                    data.project_by_pk.license_contracts.map(
                        ele => ele.contract.id
                    );
                setRepairDetailsEstimateModal(prev => ({
                    ...prev,
                    registeredLicenseContractId: licenseContractedIds,
                }));
            },
        }
    );

    // 라이선스 도입 사업 목록
    const { data: licenseContracts } = useQuery(
        [
            "get license contract by selected retail project",
            repairDetailsEstimateModal,
        ],
        () =>
            contractService.getAllContract({
                where: {
                    client_id: {
                        _eq: repairDetailsEstimateModal.selectedClientId,
                    },
                    type: {
                        value: { _eq: CommonType.LICENSE },
                    },
                    project: {
                        is_canceled: { _eq: false },
                    },
                    deleted_at: { _is_null: true },
                },
                order_by: [
                    {
                        contract_period_start: IOrder_By.Asc,
                    },
                ],
            }),
        {
            enabled: !!repairDetailsEstimateModal.selectedClientId,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                const contracts = data.map((contract, idx) => ({
                    id: idx + 1,
                    idx: idx + 1,
                    pk: contract?.id,
                    contract_period_start: dayjs(
                        contract?.contract_period_start
                    ).format("YYYY년 MM월 DD일"),
                    contract_period_end: dayjs(
                        contract?.contract_period_end
                    ).format("YYYY년 MM월 DD일"),
                    project_name: contract?.project.name,
                }));
                setRows(contracts);
            },
        }
    );

    // 모달이 열렸을 때, 이미 등록되어 있는  라이선스 도입 사업과
    // Recoil 에 저장된 새로 선택한 라이선스 도입 사업 목록
    // =>  체크된 상태로 SET
    useEffect(() => {
        if (!!registeredLicenseContracts && !!licenseContracts) {
            // 품목테이블에 적용된 라이선스 도입 사업 목록 > 체크 상태로 전환
            const selectedLicenseContractRowIds = rows
                .filter(
                    ele =>
                        repairDetailsEstimateModal.appliedLicenseContractId?.includes(
                            ele.pk
                        )
                )
                .map(ele => ele.id);

            dataGridApiRef.current.setRowSelectionModel([
                ...selectedLicenseContractRowIds,
            ]);
        }
    }, [registeredLicenseContracts, licenseContracts]);

    // 선택한 견적을 RECOIL 에 SET & 모달 닫기
    const onClickApply = () => {
        const selectedRows = Array.from(
            dataGridApiRef.current.getSelectedRows().values()
        );
        if (selectedRows.length !== 0) {
            setRepairDetailsEstimateModal(prev => ({
                ...prev,
                isOpen: false,
                selectedLicenseContractId: selectedRows.map(ele => ele.pk),
            }));
        } else {
            alert("사업을 선택해주세요.");
        }
    };

    return (
        <VSearchLicenseContractModal
            {...props}
            control={control}
            register={register}
            setValue={setValue}
            columns={columns.map(col => ({
                ...col,
                headerAlign: "center",
                align: "center",
                sortable: true,
            }))}
            rows={rows}
            dataGridApiRef={dataGridApiRef}
            onClickApply={onClickApply}
        />
    );
};

export default SearchLicenseContractModal;
