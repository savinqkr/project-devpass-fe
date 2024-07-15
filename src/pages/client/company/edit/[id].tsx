import { BasicTemplate, PageTitle } from "@common/components";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import attachmentService from "@common/services/attachment/attachment.service";
import codeService from "@common/services/code/code.service";
import PATH from "@constants/path";
import { ClientCompanyForm } from "@domains/company";
import { IClientCompanyForm } from "@domains/company/components/client-company-form/ClientCompanyForm.interface";
import useEditPassbooks from "@domains/company/hooks/useEditPassbooks";
import companyService from "@domains/company/services/company.service";
import { AttachmentState } from "@enums";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import loginState from "@recoils/login-state.atom";
import editAttachments from "@utils/editAttachments";
import fetchFile from "@utils/fetchFile";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { AttachmentType } from "src/enums/attachment_types.enum";
import { CodeCategory } from "src/enums/code_category.enum";
import { CompanyType } from "src/enums/company_type.enum";

const CompanyEdit: NextPage = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const loginUser = useRecoilValue(loginState);

    const {
        watch,
        setValue,
        getValues,
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<IClientCompanyForm.IForm>();

    // -------------------------------------------------
    // 기존 거래처 정보 조회 ( QUERY )
    // -------------------------------------------------
    const {
        data: originalData,
        refetch: fetchOriginalData,
        isLoading: isFetchingOriginalData,
    } = useQuery(
        [`get original client company data of company ${id}`],
        () =>
            companyService.getCompanyByPk({
                id: parseInt(id, 10),
            }),
        {
            enabled: false,
            retry: false,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess: data => {
                const {
                    type: { code },
                    name,
                    president,
                    busi_no,
                    regist_no,
                    address,
                    busi_state,
                    event,
                    billing_address,
                    note,
                } = data;
                setValue("name", name);
                setValue("president", president);
                setValue("busi_no", busi_no);
                setValue("regist_no", regist_no);
                setValue("address", address);
                setValue("busi_state", busi_state);
                setValue("event", event);
                setValue("billing_address", billing_address);
                setValue("note", note);
            },
        }
    );

    useEffect(() => {
        if (router.pathname === `${PATH.CLIENT.COMPANY.EDIT}/[id]` && !!id) {
            fetchOriginalData();
        }
    }, []);

    // -------------------------------------------------
    // 기존 첨부파일 조회 ( QUERY , GET )
    // -------------------------------------------------
    const [license, setLicense] = useState<IAttachmentInput.IAttachment[]>();

    const passbookApiRef = useGridApiRef();
    const [passbookRows, setPassbookRows] = useState<GridRowsProp>([]);

    const {
        refetch: fetchOriginalAttachments,
        isLoading: isFetchingAttachmentData,
    } = useQuery(
        [`get original client file data of company ${id}`],
        () =>
            attachmentService.getAttachmentsByParentId({
                parent_id: parseInt(id, 10),
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
        if (!!originalData) {
            fetchOriginalAttachments();
        }
    }, [originalData]);

    useEffect(() => {
        setValue("license", license);
    }, [license]);

    useEffect(() => {
        const passbooks: IAttachmentInput.IAttachment[] = passbookRows.map(
            row => {
                return {
                    file: row.file,
                    bank_name: row.bank_name,
                    bank_account: row.bank_account,
                    tag: !!row.tag ? row.tag : AttachmentState.NEW,
                };
            }
        );
        setValue("passbooks", passbooks);
    }, [passbookRows]);

    // -------------------------------------------------
    // 거래처 수정 ( MUTATION )
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

    const { mutate: editClientCompanyMutate, isLoading: isEditLoading } =
        useMutation(
            [`edit client company data of company ${id}`],
            () =>
                companyService.editCompanyByPk({
                    id: parseInt(id, 10),
                    typeCode: originalData?.type.code,
                    name: getValues("name"),
                    president: getValues("president"),
                    busi_no: getValues("busi_no"),
                    regist_no: getValues("regist_no"),
                    address: getValues("address"),
                    busi_state: getValues("busi_state"),
                    event: getValues("event"),
                    billing_address: getValues("billing_address"),
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
                    router.push(`${PATH.CLIENT.COMPANY.MAIN}/${id}`);
                },
            }
        );

    // 중복되는 거래처 명 확인
    const { data: companiesWithSameName, refetch: checkCompanyName } = useQuery(
        ["check client company name", watch("name")],
        () =>
            companyService.getCompanies({
                where: {
                    name: { _eq: getValues("name") },
                    type: {
                        category: { _eq: CodeCategory.COMPANY_TYPE },
                        value: { _eq: CompanyType.CLIENT },
                        is_used: { _eq: true },
                    },
                },
            })
    );

    const onClickEdit = () => {
        // if (!getValues("license") || getValues("license")?.length === 0) {
        //     alert("사업자등록증을 첨부해주세요.");
        //     return;
        // }
        // if (!getValues("passbooks") || getValues("passbooks")?.length === 0) {
        //     alert("통장사본을 첨부해주세요.");
        //     return;
        // }
        // const hasEmptyValues = passbookRows.some(
        //     row => !row.bank_name || !row.bank_account || !row.file
        // );
        // if (hasEmptyValues) {
        //     alert("통장사본 정보를 모두 입력해주세요.");
        //     return;
        // }

        if (originalData?.name === getValues("name")) {
            editClientCompanyMutate();
        } else {
            if (companiesWithSameName?.length === 0) {
                editClientCompanyMutate();
            } else {
                const answer = confirm(
                    "동일한 이름의 거래처가 존재합니다. 수정하시겠습니까?"
                );
                if (answer) {
                    editClientCompanyMutate();
                }
            }
        }
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="거래처 수정"
                isVisible={false}
                path={`${PATH.CLIENT.COMPANY.MAIN}/${router.query.id}`}
            />
            <ClientCompanyForm
                isLoading={
                    isFetchingOriginalData ||
                    isFetchingAttachmentData ||
                    isEditLoading
                }
                register={register}
                onClickSubmit={handleSubmit(onClickEdit)}
                errors={errors}
                control={control}
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

export default CompanyEdit;
