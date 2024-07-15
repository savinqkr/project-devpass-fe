import { IAttachmentInput } from "@common/components/attachment-imput/AttachmentInput.interface";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IHeadOfficeForm {
    export interface IProps {
        isLoading: boolean;
        control: Control<IHeadOfficeForm.IForm, any>;
        register: UseFormRegister<IHeadOfficeForm.IForm>;
        onClickSubmit: () => void;
        errors: FieldErrors<IHeadOfficeForm.IForm>;
        // 사업자등록증
        license: IAttachmentInput.IAttachment[] | undefined;
        setLicense: Dispatch<
            SetStateAction<IAttachmentInput.IAttachment[] | undefined>
        >;
        // 통장사본
        passbookApiRef: MutableRefObject<GridApiCommunity>;
        passbookRows: readonly GridValidRowModel[];
        setPassbookRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
    }
    export interface IVProps extends IProps {
        columns: GridColDef[];
        handleClickAddRow: () => void;
        handleClickDeleteRow: () => void;
    }
    export interface IForm {
        name: string; // 법인명
        president: string; // 대표자
        busi_no: string; // 사업자번호
        regist_no: string; // 법인등록번호
        address: string; // 주소
        busi_state: string; // 업태
        event: string; // 종목
        license?: IAttachmentInput.IAttachment[]; // 사업자등록증
        originalLicense?: IAttachmentInput.IAttachment[]; // 기존 사업자등록증
        passbooks?: IAttachmentInput.IAttachment[]; // 통장사본
        originalPassbooks?: IAttachmentInput.IAttachment[]; // 기존 통장사본
        billing_address: string; // 전자세금계산서 발행 주소
        contact: string; // 연락처
        fax: string; // 팩스
        note: string; // 비고
    }
}
