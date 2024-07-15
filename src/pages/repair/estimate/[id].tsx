import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { css } from "@emotion/react";
import PATH from "@constants/path";
import { Colors } from "@configs/colors";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useMutation, useQuery } from "react-query";
import estimateService from "@domains/estimate/services/estimate.service";
import { IconButton } from "@mui/material";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { RepairEstiamteDetail } from "@domains/estimate/components";

const RepairEstimateDetailPage: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    const loginUser = useRecoilValue(loginState);

    // ---------------------------------------------
    // 견적 상세조회 ( QUERY )
    // ---------------------------------------------
    const { data: estimateData } = useQuery(
        [`get estimate data of ${id}`],
        () => estimateService.getEstimateByPk({ id }),
        {
            enabled: router.isReady,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // ---------------------------------------------
    // 해당 사업에 최종 견적 확정된 견적이 있는지 조회 ( QUERY )
    // ---------------------------------------------
    const { data: finalEstimateData } = useQuery(
        ["check final estimates"],
        () =>
            estimateService.getFinalEstimateByProject({
                project_id: estimateData!.estimate_by_pk.project.id,
                type_code: estimateData!.estimate_by_pk.type.code,
            }),
        { enabled: !!estimateData }
    );

    // ---------------------------------------------
    // 최종 견적 확정  ( MUTATION )
    // ---------------------------------------------
    const { mutate: setFinalEstimateMutate } = useMutation(
        [`set final estimate of ${id}`],
        () => estimateService.setFinalEstimateByPkMutation({ id }),
        {
            onSuccess(data, variables, context) {
                alert("최종 견적 확정이 정상적으로 처리되었습니다.");
            },
        }
    );
    const onClickSetFinalEstimateById = () => {
        if (finalEstimateData?.estimate.length !== 0) {
            alert("해당 사업에 최종 견적이 이미 존재합니다.");
        } else {
            setFinalEstimateMutate();
        }
    };
    // ---------------------------------------------
    // 견적 삭제 ( MUTATION )
    // ---------------------------------------------
    const { data: deletedEstiamte, mutate: deleteEstimateMutate } = useMutation(
        [`delete estimate ${id}`],
        () =>
            estimateService.deleteEstimate({
                id,
                deleted_by: loginUser.id!,
            }),
        {
            onSuccess(data, variables, context) {
                router.push(PATH.REPAIR.ESTIMATE.MAIN);
            },
        }
    );

    const onClickDeleteEstimateById = () => {
        if (confirm("견적을 삭제하시겠습니까?")) {
            deleteEstimateMutate();
        }
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="유지보수 견적 상세"
                    isVisible={true}
                    path={PATH.REPAIR.ESTIMATE.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"유지보수 > 유지보수 견적 > "}
                        <span css={{ color: Colors.oceanBlue }}>견적 상세</span>
                    </p>
                    <div className="btn-group">
                        {!estimateData?.estimate_by_pk?.deleted_at &&
                            !estimateData?.estimate_by_pk.is_final && (
                                <>
                                    <IconButton
                                        color="wildStrawberry"
                                        onClick={onClickDeleteEstimateById}
                                        disabled={
                                            estimateData?.estimate_by_pk.project
                                                .is_canceled
                                        }
                                    >
                                        <MdOutlineDelete size={20} />
                                    </IconButton>
                                    <div className="space" />
                                    <IconButton
                                        color="oceanBlue"
                                        onClick={() =>
                                            router.push(
                                                `${PATH.REPAIR.ESTIMATE.EDIT}/${id}`
                                            )
                                        }
                                        disabled={
                                            estimateData?.estimate_by_pk.project
                                                .is_canceled
                                        }
                                    >
                                        <MdOutlineEdit size={20} />
                                    </IconButton>
                                </>
                            )}
                    </div>
                </div>
                <RepairEstiamteDetail
                    estimateData={estimateData}
                    onClickSetFinalEstimateById={onClickSetFinalEstimateById}
                    finalBtnDisabled={
                        estimateData?.estimate_by_pk.is_final ||
                        !!estimateData?.estimate_by_pk.deleted_at ||
                        (estimateData?.estimate_by_pk.project.is_canceled ??
                            false)
                        // || finalEstimateData?.estimate.length !== 0
                    }
                />
            </div>
        </BasicTemplate>
    );
};

export default RepairEstimateDetailPage;

const rootStyle = css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }
    .menu-info {
        color: ${Colors.gray};
    }
    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }
    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 120px;
    }
    .btn-group {
        width: 80px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        .space {
            width: 16px;
        }
    }
`;
