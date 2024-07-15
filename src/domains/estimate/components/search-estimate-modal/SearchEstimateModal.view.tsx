import { css } from "@emotion/react";
import { ISearchEstimateModal } from "./SearchEstimateModal.interface";
import { Button, IconButton, Paper } from "@mui/material";
import { CgClose } from "react-icons/cg";
import { Colors } from "@configs/colors";
import { useResetRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { MuiDataGrid, SearchAutoComplete } from "@common/components";
import { IoIosSearch } from "react-icons/io";

const VSearchEstimateModal: React.FC<ISearchEstimateModal.IVProps> = props => {
    const {
        register,
        control,
        setValue,
        companyNameOptions,
        projectNameOptions,
        destinationOptions,
        onClickSearch,
        columns,
        rows,
        onClickRow,
        dataGridApiRef,
        onClickApply,
    } = props;

    const resetEstimateModal = useResetRecoilState(estimateModalState);

    return (
        <Paper css={rootStyle} elevation={0}>
            <IconButton id="close-btn" onClick={resetEstimateModal}>
                <CgClose size={24} color={Colors.charcoalGray} />
            </IconButton>
            <div id="search-bar">
                <SearchAutoComplete
                    width="200px"
                    placeholder="사업명"
                    register={register}
                    setValue={setValue}
                    registerKey={"project_name"}
                    options={projectNameOptions}
                />
                <div className="space" />
                <SearchAutoComplete
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
                    placeholder="수신처"
                    register={register}
                    setValue={setValue}
                    registerKey={"destination"}
                    options={destinationOptions}
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
                </Button>
            </div>
            <div id="table-area">
                <MuiDataGrid
                    rows={rows}
                    columns={columns}
                    rowLimit={10}
                    onClickRow={onClickRow}
                    apiRef={dataGridApiRef}
                    msg="검색 결과가 없습니다."
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

export default VSearchEstimateModal;

const rootStyle = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
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
