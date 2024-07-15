import { atom, RecoilEnv } from "recoil";

// RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const repairDetailsEstimateModalState = atom<{
    isOpen: boolean;
    selectedClientId?: number;
    selectedRepairProjectId?: number;
    registeredLicenseContractId?: number[]; // 유지보수 사업 단계에서 이미 등록된 라이선스 도입 사업
    selectedLicenseContractId?: number[]; // 모달에서 선택한 라이선스 계약 ID
    appliedLicenseContractId?: number[]; // 품목 테이블이 이미 추가된 라이선스 계약 ID
}>({
    key: `repairDetailsEstimateModalState`,
    default: {
        isOpen: false,
        selectedClientId: undefined,
        selectedRepairProjectId: undefined,
        registeredLicenseContractId: undefined,
        selectedLicenseContractId: undefined,
        appliedLicenseContractId: undefined,
    },
});

export default repairDetailsEstimateModalState;
