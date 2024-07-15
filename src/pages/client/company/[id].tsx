import { BasicTemplate, PageTitle } from "@common/components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import { Colors } from "@configs/colors";
import PATH from "@constants/path";
import BasicButton from "@common/components/basic-button";
import { ButtonType } from "@enums";
import CompanyDetail from "@domains/company/components/company-detail";
import { useMutation, useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import attachmentService from "@common/services/attachment/attachment.service";
import { useEffect, useState } from "react";
import { ICompanyDetail } from "@domains/company/components/company-detail/CompanyDetail.interface";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { IconButton } from "@mui/material";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const CompanyDetailPage: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    // -------------------------------------------------
    // 거래처 상세 조회 ( QUERY )
    // -------------------------------------------------
    const { data: clientData } = useQuery(
        [`get client company data of compsny ${id}`],
        () =>
            companyService.getCompanyByPk({
                id: parseInt(id, 10),
            }),
        {
            enabled: !!id,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // -------------------------------------------------
    // 첨부파일 조회 ( QUERY )
    // -------------------------------------------------
    const { data: attachmentData } = useQuery(
        [`get attachment data of company ${id}`],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id, 10),
            }),
        {
            enabled: !!id,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // 조회한 첨부파일 SET
    const [license, setLicense] = useState<ICompanyDetail.IAttachment>();
    const [passbooks, setPassbooks] = useState<
        Array<ICompanyDetail.IAttachment>
    >([]);

    useEffect(() => {
        let passbookTemp: Array<ICompanyDetail.IAttachment> = [];
        attachmentData?.attachment.forEach(file => {
            if (file.type.value === AttachmentType.LICENSE) {
                setLicense({
                    id: file.id,
                    name: file.file_name,
                    path: file.file_path,
                });
            }
            if (file.type.value === AttachmentType.PASSBOOK) {
                passbookTemp.push({
                    id: file.id,
                    name: file.file_name,
                    path: file.file_path,
                    bank_name: file.bank_name,
                    bank_account: file.bank_account,
                });
            }
        });
        setPassbooks(passbookTemp);
    }, [attachmentData]);

    // -------------------------------------------------
    // 거래처에 해당하는 모든 첨부파일 삭제
    // -------------------------------------------------
    // const deleteAttachments = async () => {
    //     attachmentData?.attachment.forEach(async item => {
    //         await attachmentService.deleteFile({ id: item.id });
    //     });
    // };

    // -------------------------------------------------
    // 거래처 삭제 ( MUTATION )
    // -------------------------------------------------
    const { mutate: deleteClientMutate } = useMutation(
        ["delete client company by id"],
        () =>
            companyService.deleteCompanyByPk({
                id: parseInt(id, 10),
            }),
        {
            async onSuccess(data) {
                // await deleteAttachments();
                router.push(PATH.CLIENT.COMPANY.MAIN);
            },
        }
    );

    const onClickDeleteClientCompany = () => {
        if (confirm("거래처를 삭제하시겠습니까?")) {
            deleteClientMutate();
        }
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="거래처 상세"
                    isVisible={true}
                    path={PATH.CLIENT.COMPANY.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"거래처 > 거래처 > 전체 거래처 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            거래처 상세
                        </span>
                    </p>
                    {clientData && clientData.deleted_at === null && (
                        <div className="btn-group">
                            <IconButton
                                color="wildStrawberry"
                                onClick={onClickDeleteClientCompany}
                            >
                                <MdOutlineDelete size={20} />
                            </IconButton>
                            <div className="space" />
                            <IconButton
                                color="oceanBlue"
                                onClick={() =>
                                    router.push(
                                        `${PATH.CLIENT.COMPANY.EDIT}/${router.query.id}`
                                    )
                                }
                            >
                                <MdOutlineEdit size={20} />
                            </IconButton>
                        </div>
                    )}
                </div>
                {clientData ? (
                    <CompanyDetail
                        companyData={clientData}
                        licenseData={license}
                        passbookData={passbooks}
                    />
                ) : (
                    <div className="msg">
                        해당 ID 의 거래처 정보가 등록되지 않았습니다.
                    </div>
                )}
            </div>
        </BasicTemplate>
    );
};

export default CompanyDetailPage;

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
