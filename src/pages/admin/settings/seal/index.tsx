import { css } from "@emotion/react";
import { BasicTemplate, PageTitle } from "@common/components";
import type { NextPage } from "next";
import { Colors } from "@configs/colors";
import { AttachmentState, ModalMode } from "@enums";
import { useQuery } from "react-query";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { useEffect, useState } from "react";
import { IconButton, Modal } from "@mui/material";
import { SealForm } from "@domains/seal";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import fetchFile from "@utils/fetchFile";
import { ISealForm } from "@domains/seal/components/seal-form/SealForm.interface";
import { useForm } from "react-hook-form";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { CodeCategory } from "src/enums/code_category.enum";
import editAttachments from "@utils/editAttachments";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import codeService from "@common/services/code/code.service";

const Seal: NextPage = () => {
    const loginUser = useRecoilValue(loginState);

    const {
        getValues,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ISealForm.IForm>();

    // ---------------------------------------
    // 모달
    // ---------------------------------------
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const onClickOpen = () => {
        setIsOpen(true);
    };
    const onClickClose = () => {
        setIsOpen(false);
    };

    // ---------------------------------------
    // 현재 모드
    // ---------------------------------------
    const [mode, setMode] = useState<ModalMode>(ModalMode.NONE);

    // ---------------------------------------
    // 본사 정보 조회 ( QUERY )
    // ---------------------------------------
    const { data: headOfficeData } = useQuery(["get head office data"], () =>
        companyService.getCompanies({
            where: { type: { value: { _eq: CompanyType.HEAD } } },
        })
    );

    // ---------------------------------------
    //  COMMON CODE ( 첨부파일 - 인감 )
    // ---------------------------------------
    const { data: sealCode } = useQuery(
        ["get seal attachment type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                    value: { _eq: AttachmentType.SEAL },
                },
            })
    );

    // ---------------------------------------
    // 인감 조회 ( QUERY )
    // ---------------------------------------
    // QUERY 종속 ( TRIGGER )
    const [isExicuted, setIsExicuted] = useState<boolean>(false);

    // 선택된 인감
    const [selectedSeal, setSelectedSeal] =
        useState<IAttachmentInput.IAttachment[]>();

    // 기존 인감
    const [originalSeal, setOriginalSeal] =
        useState<IAttachmentInput.IAttachment[]>();

    const { data: sealData, refetch: fetchOriginalSeal } = useQuery(
        ["get seal data"],
        () =>
            attachmentService.getAttachmentsByType({
                types: [AttachmentType.SEAL],
            }),
        {
            enabled: false,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            async onSuccess(data) {
                if (data.attachment.length > 0) {
                    const fileBlob = await fetchFile(
                        data.attachment[0]!.id,
                        data.attachment[0]!.file_name
                    );
                    const resolvedSeal = [
                        {
                            id: data.attachment[0].id,
                            file: new File(
                                [fileBlob],
                                data.attachment[0].file_name
                            ),
                            tag: AttachmentState.ORIGINAL,
                        },
                    ];
                    setOriginalSeal(resolvedSeal);
                    setValue("originalSeal", resolvedSeal);
                    setSelectedSeal(resolvedSeal);
                    setMode(ModalMode.EDIT);
                } else {
                    setSelectedSeal(undefined);
                    setMode(ModalMode.REGISTER);
                }
            },
        }
    );

    useEffect(() => {
        fetchOriginalSeal();
    }, [isOpen, isExicuted]);

    useEffect(() => {
        setValue("seal", selectedSeal);
    }, [selectedSeal]);

    // ---------------------------------------
    // 삭제
    // ---------------------------------------
    const onClickDelete = async () => {
        if (confirm("삭제하시겠습니까?")) {
            try {
                await attachmentService
                    .deleteFile({ id: originalSeal![0].id! })
                    .then(() => {
                        setOriginalSeal(undefined);
                        setIsExicuted(!isExicuted);
                    });
            } catch (error) {
                console.error("Error deleting seal:", error);
            }
            onClickClose();
        }
    };
    // ---------------------------------------
    // 등록 & 수정
    // ---------------------------------------
    const onClickSubmit = async () => {
        await editAttachments(
            getValues("originalSeal"),
            getValues("seal"),
            loginUser!.id!,
            headOfficeData![0]!.id,
            sealCode!.common_code[0].code
        ).then(() => {
            setOriginalSeal(undefined);
            setSelectedSeal(undefined);
            setIsExicuted(!isExicuted);
        });
        onClickClose();
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="인감 설정" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>인감 설정</span>
                    </p>
                    <div id="btn-area">
                        {!!originalSeal && originalSeal.length > 0 && (
                            <>
                                <IconButton
                                    color="wildStrawberry"
                                    onClick={onClickDelete}
                                >
                                    <MdOutlineDelete size={20} />
                                </IconButton>
                                <div className="space" />
                            </>
                        )}
                        <IconButton
                            color="oceanBlue"
                            onClick={() => {
                                !!headOfficeData && headOfficeData.length === 0
                                    ? alert("본사 정보를 먼저 등록해주세요.")
                                    : onClickOpen();
                            }}
                        >
                            {!!originalSeal && originalSeal.length > 0 ? (
                                <MdOutlineEdit size={20} />
                            ) : (
                                <IoAddOutline />
                            )}
                        </IconButton>
                    </div>
                </div>
                <div>
                    {!!originalSeal && originalSeal.length > 0 ? (
                        <div id="seal-area">
                            <img
                                id="seal-img"
                                src={URL.createObjectURL(originalSeal![0].file)}
                                alt={originalSeal![0].file.name || ""}
                            />
                        </div>
                    ) : (
                        <div className="msg">인감을 등록해주세요.</div>
                    )}
                </div>
            </div>
            <Modal
                id="modal"
                open={isOpen}
                onClose={onClickClose}
                disableScrollLock
                children={
                    <div id="seal-form">
                        <SealForm
                            register={register}
                            errors={errors}
                            onClickSubmit={handleSubmit(onClickSubmit)}
                            mode={mode}
                            title={
                                mode === ModalMode.EDIT
                                    ? "인감 수정"
                                    : mode === ModalMode.REGISTER
                                      ? "인감 등록"
                                      : "-"
                            }
                            isDisabled={
                                !!headOfficeData && headOfficeData.length === 0
                            }
                            onClickClose={onClickClose}
                            seal={selectedSeal}
                            setSeal={setSelectedSeal}
                        />
                    </div>
                }
            />
        </BasicTemplate>
    );
};

export default Seal;

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

    #btn-area {
        display: flex;
        flex-direction: row;
        .space {
            width: 10px;
        }
    }

    #seal-area {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 70px;
    }

    #seal-img {
        width: 42%;
        height: 42%;
        object-fit: cover;
        padding: 18px;
        border: 1px solid ${Colors.lightGray};
    }
`;
