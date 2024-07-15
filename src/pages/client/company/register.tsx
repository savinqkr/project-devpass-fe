import type { NextPage } from "next";
import { BasicTemplate, PageTitle } from "@common/components";
import { ClientCompanyForm } from "@domains/company";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useMutation, useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { IClientCompanyForm } from "@domains/company/components/client-company-form/ClientCompanyForm.interface";
import { useForm } from "react-hook-form";
import PATH from "@constants/path";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import editAttachments from "@utils/editAttachments";
import { useEffect, useState } from "react";
import { CodeCategory } from "src/enums/code_category.enum";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import { AttachmentState } from "@enums";
import useEditPassbooks from "@domains/company/hooks/useEditPassbooks";
import codeService from "@common/services/code/code.service";
import { CompanyType } from "src/enums/company_type.enum";
import { AttachmentType } from "src/enums/attachment_types.enum";

const ClientEmployeeRegister: NextPage = () => {
    const router = useRouter();

    const loginUser = useRecoilValue(loginState);

    const {
        setValue,
        getValues,
        handleSubmit,
        register,
        control,
        watch,
        formState: { errors },
    } = useForm<IClientCompanyForm.IForm>();

    // 거래처 코드
    const { data: companyTypeCodeData } = useQuery(["get company type"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMPANY_TYPE },
                value: { _eq: CompanyType.CLIENT },
                is_used: { _eq: true },
            },
        })
    );

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

    const [license, setLicense] = useState<IAttachmentInput.IAttachment[]>();

    const passbookApiRef = useGridApiRef();
    const [passbookRows, setPassbookRows] = useState<GridRowsProp>([]);

    useEffect(() => {
        setValue("license", license);
    }, [license]);
    useEffect(() => {
        const passbooks: IAttachmentInput.IAttachment[] = passbookRows.map(
            row => ({
                file: row.file,
                bank_name: row.bank_name,
                bank_account: row.bank_account,
                tag: AttachmentState.NEW,
            })
        );
        setValue("passbooks", passbooks);
    }, [passbookRows]);

    // -------------------------------------------------
    // 거래처 등록 ( MUTATION )
    // -------------------------------------------------
    const { mutate: registerClientMutate, isLoading } = useMutation(
        ["register client info"],
        () =>
            companyService.registerCompany({
                typeCode: Number(companyTypeCodeData?.common_code[0].code),
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
                // 사업자등록증 등록
                await editAttachments(
                    getValues("originalLicense"),
                    getValues("license"),
                    loginUser!.id!,
                    data.insert_company_one.id,
                    licenseCode!.common_code[0].code
                );
                // 통장사본 등록
                await useEditPassbooks(
                    getValues("originalPassbooks"),
                    getValues("passbooks"),
                    loginUser!.id!,
                    data.insert_company_one.id,
                    passbookCode!.common_code[0].code
                );
                router.push(
                    `${PATH.CLIENT.COMPANY.MAIN}/${data.insert_company_one.id}`
                );
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

    const onClickRegister = () => {
        // if (!getValues("license") || getValues("license")?.length === 0) {
        //     alert("사업자등록증을 첨부해주세요.");
        //     return;
        // }
        // if (!!getValues("passbooks") && getValues("passbooks")?.length === 0) {
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

        if (companiesWithSameName?.length === 0) {
            registerClientMutate();
        } else {
            const answer = confirm(
                "동일한 이름의 거래처가 존재합니다. 등록하시겠습니까?"
            );
            if (answer) {
                registerClientMutate();
            }
        }
    };

    return (
        <BasicTemplate>
            <PageTitle title="거래처 등록" isVisible={false} />
            <ClientCompanyForm
                isLoading={isLoading}
                register={register}
                control={control}
                errors={errors}
                onClickSubmit={handleSubmit(onClickRegister)}
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

export default ClientEmployeeRegister;
