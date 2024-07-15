import { css } from "@emotion/react";
import { ILayout } from "./Layout.interface";
import { useRecoilState, useResetRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { Box, Modal } from "@mui/material";
import {
    SearchEstimateModal,
    SearchLicenseContractModal,
} from "@domains/estimate/components";
import repairDetailsEstimateModalState from "@recoils/repair-estimate-detail-modal-state.atom";
const VLayout: React.FC<ILayout.IVProps> = ({ children }) => {
    // 견적 불러오기 모달
    const [estiamteModal, setEstiamteModal] =
        useRecoilState(estimateModalState);
    const resetEstimateModal = useResetRecoilState(estimateModalState);

    // 유지보수 견적 > 라이선스 도입 사업 추가하기 모달
    const [repairDetailsEstimateModal, setRepairDetailsEstimateModal] =
        useRecoilState(repairDetailsEstimateModalState);

    return (
        <main css={rootStyle}>
            <div className="scrollBar">{children}</div>
            {/* 견적 불러오기 모달 */}
            <Modal
                id="modal"
                open={estiamteModal.isOpen}
                onClose={resetEstimateModal}
                disableScrollLock
                children={
                    <Box>
                        <SearchEstimateModal />
                    </Box>
                }
            />
            {/* 유지보수 견적 > 라이선스 도입 사업 추가하기 모달 */}
            <Modal
                id="modal"
                open={repairDetailsEstimateModal.isOpen}
                onClose={() =>
                    setRepairDetailsEstimateModal(prev => ({
                        ...prev,
                        isOpen: false,
                    }))
                }
                disableScrollLock
                children={
                    <Box>
                        <SearchLicenseContractModal />
                    </Box>
                }
            />
        </main>
    );
};

export default VLayout;

const rootStyle = css`
    display: flex;
    flex-direction: column;
`;
