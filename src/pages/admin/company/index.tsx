import { css } from "@emotion/react";
import PageTitle from "@common/components/page-title";
import type { NextPage } from "next";
import { Colors } from "@configs/colors";
import BasicTemplate from "@common/components/templates/basic-template";
import { useRouter } from "next/router";
import PATH from "@constants/path";
import { useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import CompanyDetail from "@domains/company/components/company-detail/CompanyDetail.impl";
import attachmentService from "@common/services/attachment/attachment.service";
import { useState } from "react";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { ICompanyDetail } from "@domains/company/components/company-detail/CompanyDetail.interface";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { MdOutlineEdit } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";

const Company: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    // -------------------------------------------------
    // 본사 정보 조회 ( QUERY )
    // -------------------------------------------------
    const { data: headOfficeData } = useQuery(
        ["get head office data"],
        () =>
            companyService.getCompanies({
                where: { type: { value: { _eq: "본사" } } },
            }),
        {
            enabled: !!loginUser.id,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // -------------------------------------------------
    // 첨부파일 조회 ( QUERY )
    // -------------------------------------------------

    // 조회한 첨부파일 SET
    const [license, setLicense] = useState<ICompanyDetail.IAttachment>();
    const [passbooks, setPassbooks] = useState<
        Array<ICompanyDetail.IAttachment>
    >([]);

    const { refetch: attachmentRefetch, isLoading: fetchingAttachments } =
        useQuery(
            ["get attachment by parent id"],
            () =>
                attachmentService.getAttachmentsByParentId({
                    parent_id: headOfficeData![0]!.id,
                }),
            {
                enabled: !!headOfficeData && headOfficeData.length > 0,
                retry: true,
                cacheTime: 0,
                staleTime: 0,
                keepPreviousData: false,
                onSuccess(data) {
                    let passbookTemp: Array<ICompanyDetail.IAttachment> = [];
                    data?.attachment.forEach(file => {
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
                },
            }
        );

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle title="본사 정보" isVisible={false} />
                <div className="group">
                    <p className="menu-info">
                        {"관리자 > "}
                        <span css={{ color: Colors.oceanBlue }}>본사</span>
                    </p>
                    {headOfficeData && headOfficeData.length === 0 ? (
                        <IconButton
                            color="oceanBlue"
                            onClick={() =>
                                router.push(PATH.ADMIN.COMPANY.REGISTER)
                            }
                        >
                            <IoAddOutline />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="oceanBlue"
                            onClick={() => router.push(PATH.ADMIN.COMPANY.EDIT)}
                        >
                            <MdOutlineEdit size={20} />
                        </IconButton>
                    )}
                </div>
                {!!headOfficeData && headOfficeData.length === 0 ? (
                    <div className="msg">본사 정보를 등록해주세요.</div>
                ) : fetchingAttachments ? (
                    <Box
                        sx={{
                            marginTop: "180px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <CompanyDetail
                        companyData={
                            headOfficeData ? headOfficeData[0] : undefined
                        }
                        licenseData={license}
                        passbookData={passbooks}
                    />
                )}
            </div>
        </BasicTemplate>
    );
};

export default Company;

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
`;
