import { ModalMode } from "@enums";
import { Dispatch, SetStateAction } from "react";

export namespace IRoleDetail {
    export interface IProps {
        isExecuted: boolean;
        setIsExecuted: Dispatch<SetStateAction<boolean>>;
        setModalMode: Dispatch<SetStateAction<ModalMode>>;
        code: number;
        title: string;
        onClickClose: () => void;
    }
    export interface IVProps extends IProps {
        onClickDeleteRole: (code: number, value: string) => void;
        onClicEditRole: () => void;
        data:
            | {
                  code: number;
                  value: string;
                  special_role: {
                      code: number;
                      value: string;
                      category: string;
                      is_used: boolean;
                  };
                  is_used: boolean;
                  created_at: string;
                  updated_at: string;
                  deleted_at: string;
              }
            | undefined;
    }
    export interface IForm {}
}
