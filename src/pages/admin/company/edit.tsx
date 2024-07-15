import type { NextPage } from "next";
import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import { HeadOfficeForm } from "@domains/company";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useForm } from "react-hook-form";
import { IHeadOfficeForm } from "@domains/company/components/head-office-form/HeadOfficeForm.interface";
import { useMutation, useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { CompanyType } from "src/enums/company_type.enum";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { useEffect, useState } from "react";
import attachmentService from "@common/services/attachment/attachment.service";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { AttachmentState } from "@enums";
import editAttachments from "@utils/editAttachments";
import fetchFile from "@utils/fetchFile";
import { CodeCategory } from "src/enums/code_category.enum";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import useEditPassbooks from "@domains/company/hooks/useEditPassbooks";
import codeService from "@common/services/code/code.service";

const ClientCompanyEdit: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const {
        control,
        getValues,
        setValue,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<IHeadOfficeForm.IForm>();

    // -------------------------------------------------
    // 기존 본사 정보 조회 ( QUERY )
    // -------------------------------------------------
    const {
        data: originalData,
        refetch: fetchOriginalData,
        isLoading: isFetchingOriginalData,
    } = useQuery(
        ["get original head office data"],
        () =>
            companyService.getCompanies({
                where: { type: { value: { _eq: CompanyType.HEAD } } },
            }),
        {
            enabled: false,
            retry: false,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess: data => {
                const {
                    name,
                    president,
                    busi_no,
                    regist_no,
                    address,
                    busi_state,
                    event,
                    billing_address,
                    contact,
                    fax,
                    note,
                } = data[0]!;
                setValue("name", name);
                setValue("president", president);
                setValue("busi_no", busi_no);
                setValue("regist_no", regist_no);
                setValue("address", address);
                setValue("busi_state", busi_state);
                setValue("event", event);
                setValue("billing_address", billing_address);
                setValue("contact", contact);
                setValue("fax", fax);
                setValue("note", note);
            },
        }
    );

    useEffect(() => {
        fetchOriginalData();
    }, []);

    // -------------------------------------------------
    // 기존 첨부파일 조회 ( GET )
    // -------------------------------------------------
    const [license, setLicense] = useState<IAttachmentInput.IAttachment[]>();

    const passbookApiRef = useGridApiRef();
    const [passbookRows, setPassbookRows] = useState<GridRowsProp>([]);

    const {
        refetch: fetchOriginalAttachments,
        isLoading: isFetchingAttachmentData,
    } = useQuery(
        ["get original seal data (main)"],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: originalData![0]!.id,
            }),
        {
            enabled: false,
            retry: false,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            async onSuccess(data) {
                // 사업자등록증
                const license = data!.attachment.filter(
                    item => item.type.value === AttachmentType.LICENSE
                );
                const resolvedLicense = await Promise.all(
                    license.map(async file => {
                        const fileBlob = await fetchFile(
                            file.id,
                            file.file_name
                        );
                        return {
                            id: file.id,
                            file: new File([fileBlob], file.file_name),
                            tag: AttachmentState.ORIGINAL,
                        };
                    })
                );
                setLicense(resolvedLicense);
                setValue("originalLicense", resolvedLicense);
                // 통장사본
                const passbooks = data!.attachment.filter(
                    item => item.type.value === AttachmentType.PASSBOOK
                );
                const resolvedPassbooks = await Promise.all(
                    passbooks.map(async (file, idx) => {
                        const fileBlob = await fetchFile(
                            file.id,
                            file.file_name
                        );
                        return {
                            id: idx + 1,
                            pk: file.id,
                            file: new File([fileBlob], file.file_name),
                            bank_name: file.bank_name,
                            bank_account: file.bank_account,
                            tag: AttachmentState.ORIGINAL,
                        };
                    })
                );
                setPassbookRows(resolvedPassbooks);
                setValue(
                    "originalPassbooks",
                    resolvedPassbooks.map(row => ({
                        id: row.pk,
                        file: row.file,
                        bank_name: row.bank_name,
                        bank_account: row.bank_account,
                        tag: row.tag,
                    }))
                );
            },
        }
    );

    useEffect(() => {
        if (!!originalData && originalData?.length > 0) {
            fetchOriginalAttachments();
        }
    }, [originalData]);

    useEffect(() => {
        setValue("license", license);
    }, [license]);

    useEffect(() => {
        const passbooks: IAttachmentInput.IAttachment[] = passbookRows.map(
            row => ({
                file: row.file,
                bank_name: row.bank_name,
                bank_account: row.bank_account,
                tag: !!row.tag ? row.tag : AttachmentState.NEW,
            })
        );
        setValue("passbooks", passbooks);
    }, [passbookRows]);

    // -------------------------------------------------
    // 첨부파일
    // -------------------------------------------------
    //  COMMON CODE ( 첨부파일 - 사업자등록증 )
    const { data: licenseCode } = useQuery(
        ["get license attachment type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                    value: { _eq: AttachmentType.LICENSE },
                },
            })
    );
    //  COMMON CODE ( 첨부파일 - 통장사본 )
    const { data: passbookCode } = useQuery(
        ["get passbook attachment type common code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.ATTACHMENT_TYPE },
                    value: { _eq: AttachmentType.PASSBOOK },
                },
            })
    );

    // -------------------------------------------------
    // 본사 수정 ( MUTATION )
    // -------------------------------------------------
    const { mutate: editHeadOfficeMutate, isLoading: isEditLoading } =
        useMutation(
            ["edit head office info"],
            () =>
                companyService.editCompanyByPk({
                    id: originalData![0]!.id,
                    typeCode: originalData![0]!.type.code,
                    name: getValues("name"),
                    president: getValues("president"),
                    busi_no: getValues("busi_no"),
                    regist_no: getValues("regist_no"),
                    address: getValues("address"),
                    busi_state: getValues("busi_state"),
                    event: getValues("event"),
                    billing_address: getValues("billing_address"),
                    contact: getValues("contact"),
                    fax: getValues("fax"),
                    note: getValues("note"),
                }),
            {
                async onSuccess(data) {
                    // 사업자등록증 수정
                    await editAttachments(
                        getValues("originalLicense"),
                        getValues("license"),
                        loginUser!.id!,
                        data.update_company_by_pk.id,
                        licenseCode!.common_code[0].code
                    );
                    // 통장사본 수정
                    await useEditPassbooks(
                        getValues("originalPassbooks"),
                        getValues("passbooks"),
                        loginUser!.id!,
                        data.update_company_by_pk.id,
                        passbookCode!.common_code[0].code
                    );
                    router.push(PATH.ADMIN.COMPANY.MAIN);
                },
            }
        );

    const onClickEdit = () => {
        if (!getValues("license") || getValues("license")?.length === 0) {
            alert("사업자등록증을 첨부해주세요.");
            return;
        }
        if (!getValues("passbooks") || getValues("passbooks")?.length === 0) {
            alert("통장사본을 첨부해주세요.");
            return;
        }
        const hasEmptyValues = passbookRows.some(
            row => !row.bank_name || !row.bank_account || !row.file
        );
        if (hasEmptyValues) {
            alert("통장사본 정보를 모두 입력해주세요.");
            return;
        }
        editHeadOfficeMutate();
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="본사 정보 수정"
                isVisible={false}
                path={PATH.ADMIN.COMPANY.MAIN}
            />
            <HeadOfficeForm
                isLoading={
                    isFetchingOriginalData ||
                    isFetchingAttachmentData ||
                    isEditLoading
                }
                control={control}
                register={register}
                onClickSubmit={handleSubmit(onClickEdit)}
                errors={errors}
                // 사업자등록증
                license={license}
                setLicense={setLicense}
                // 통장사본
                passbookApiRef={passbookApiRef}
                passbookRows={passbookRows}
                setPassbookRows={setPassbookRows}
            />
        </BasicTemplate>
    );
};

export default ClientCompanyEdit;
