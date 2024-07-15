import { css } from "@emotion/react";
import { ISearchLicenseContractModal } from "./SearchLicenseContractModal.interface";
import { Button, IconButton, Paper } from "@mui/material";
import { useRecoilState, useResetRecoilState } from "recoil";
import repairDetailsEstimateModalState from "@recoils/repair-estimate-detail-modal-state.atom";
import { Colors } from "@configs/colors";
import { IoIosSearch } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { MuiDataGrid, SearchAutoComplete } from "@common/components";

const VSearchLicenseContractModal: React.FC<
    ISearchLicenseContractModal.IVProps
> = props => {
    const {
        register,
        control,
        setValue,
        columns,
        rows,
        dataGridApiRef,
        onClickApply,
    } = props;

    const resetEstimateModal = useResetRecoilState(
        repairDetailsEstimateModalState
    );

    const [repairDetailsEstimateModal, setRepairDetailsEstimateModal] =
        useRecoilState(repairDetailsEstimateModalState);

    return (
        <Paper css={rootStyle} elevation={0}>
            <IconButton
                id="close-btn"
                // onClick={resetEstimateModal}
                onClick={() =>
                    setRepairDetailsEstimateModal(prev => ({
                        ...prev,
                        isOpen: false,
                    }))
                }
            >
                <CgClose size={24} color={Colors.charcoalGray} />
            </IconButton>
            <div id="search-bar">
                {/* <SearchAutoComplete
                    width="200px"
                    placeholder="고객사명"
                    register={register}
                    setValue={setValue}
                    registerKey={"client_name"}
                    options={companyNameOptions}
                />
                <div className="space" />
                <SearchAutoComplete
                    width="200px"
                    placeholder="사업명"
                    register={register}
                    setValue={setValue}
                    registerKey={"project_name"}
                    options={projectNameOptions}
                /> */}
                {/* <SearchAutoComplete
                    width="200px"
                    placeholder="사업명"
                    register={register}
                    setValue={setValue}
                    registerKey={"license_project_name"}
                    options={[]}
                />
                <div className="space" />
                <Button
                    color="charcoalGray"
                    variant="contained"
                    disableElevation
                    id="search-btn"
                    sx={{
                        borderRadius: "32px",
                    }}
                    onClick={onClickSearch}
                >
                    <IoIosSearch id="search-icon" size={18} />
                </Button> */}
            </div>
            <div id="table-area">
                <MuiDataGrid
                    rows={rows}
                    columns={columns}
                    rowLimit={10}
                    apiRef={dataGridApiRef}
                    msg="검색 결과가 없습니다."
                    checkboxSelection
                />
            </div>
            <div id="footer">
                <Button
                    disableElevation
                    variant="contained"
                    color="wildStrawberry"
                    sx={{
                        width: 120,
                        height: 32,
                        fontSize: 13,
                        color: Colors.creamyWhite,
                    }}
                    onClick={onClickApply}
                >
                    적용하기
                </Button>
            </div>
        </Paper>
    );
};

export default VSearchLicenseContractModal;

const rootStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40vw;
    height: 80vh;
    border-radius: 10px;
    background-color: #fff;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;

    #close-btn {
        position: absolute;
        top: 16px;
        right: 12px;
    }

    #search-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        margin-bottom: 20px;
        .space {
            width: 10px;
        }
    }

    #table-area {
        margin-top: 20px;
        display: flex;
        flex: 1;
        width: 100%;
    }

    #footer {
        display: flex;
        flex-direction: row;
        justify-content: end;
        padding: 40px 0px 10px;
        width: 100%;
    }
`;
