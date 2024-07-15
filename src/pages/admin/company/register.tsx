import type { NextPage } from "next";
import BasicTemplate from "@common/components/templates/basic-template";
import PageTitle from "@common/components/page-title";
import PATH from "@constants/path";
import { HeadOfficeForm } from "@domains/company";
import { IHeadOfficeForm } from "@domains/company/components/head-office-form/HeadOfficeForm.interface";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import companyService from "@domains/company/services/company.service";
import { useEffect, useState } from "react";
import codeService from "@common/services/code/code.service";
import { CodeCategory } from "src/enums/code_category.enum";
import { CompanyType } from "src/enums/company_type.enum";
import { useRouter } from "next/router";
import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import editAttachments from "@utils/editAttachments";
import { GridRowsProp, useGridApiRef } from "@mui/x-data-grid";
import { AttachmentState } from "@enums";
import useEditPassbooks from "@domains/company/hooks/useEditPassbooks";
import { AttachmentType } from "src/enums/attachment_types.enum";

const CompanyRegister: NextPage = () => {
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
    // TYPE CODE 조회 ( QUERY ) |  본사
    // -------------------------------------------------
    const { data: headTypeCode } = useQuery(["get company type"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMPANY_TYPE },
                value: { _eq: CompanyType.HEAD },
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
    // 본사 등록 ( MUTATION )
    // -------------------------------------------------
    const { mutate: registerHeadOfficeMutate, isLoading } = useMutation(
        ["register head office info"],
        () =>
            companyService.registerCompany({
                typeCode: Number(headTypeCode?.common_code[0].code),
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
                router.push(PATH.ADMIN.COMPANY.MAIN);
            },
        }
    );

    const onClickRegister = () => {
        if (!getValues("license") || getValues("license")?.length === 0) {
            alert("사업자등록증을 첨부해주세요.");
            return;
        }
        if (!!getValues("passbooks") && getValues("passbooks")?.length === 0) {
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
        registerHeadOfficeMutate();
    };

    return (
        <BasicTemplate>
            <PageTitle
                title="본사 정보 등록"
                isVisible={false}
                path={PATH.ADMIN.COMPANY.MAIN}
            />
            <HeadOfficeForm
                isLoading={isLoading}
                control={control}
                register={register}
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

export default CompanyRegister;
