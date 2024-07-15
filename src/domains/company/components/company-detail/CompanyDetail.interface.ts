export namespace ICompanyDetail {
    export interface IProps {
        companyData:
            | {
                  type: {
                      category: string;
                      code: number;
                      is_used: boolean;
                      value: string;
                  };
                  id: number;
                  name: string;
                  president: string;
                  busi_no: string;
                  regist_no: string;
                  address: string;
                  busi_state: string;
                  event: string;
                  billing_address: string;
                  contact?: string;
                  fax?: string;
                  note: string;
                  created_at: string;
                  updated_at: string;
                  deleted_at: string;
              }
            | undefined;

        licenseData?: ICompanyDetail.IAttachment;
        passbookData: Array<ICompanyDetail.IAttachment>;
    }
    export interface IVProps extends IProps {
        isOpen: boolean;
        handleOpen: (attachment: ICompanyDetail.IAttachment) => void;
        handleClose: () => void;
        attachment: ICompanyDetail.IAttachment | undefined;
    }
    export interface IAttachment {
        id: number;
        name: string;
        path: string;
        bank_name?: string | null;
        bank_account?: string | null;
    }
}
