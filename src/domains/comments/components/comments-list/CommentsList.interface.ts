import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

export namespace ICommentsList {
    export interface IProps {}
    export interface IVProps extends IProps {
        contents: string;
        setContents: Dispatch<SetStateAction<string>>;
        isEdit: boolean;
        onClickSubmit: () => void;
        onClickUpdate: (id: number) => void;
        onClickDelete: () => void;
        onOpenDeleteAlert: (id: number) => void;
        onCancelUpdate: () => void;
        comments: IComments[];
        isAlertOpen: boolean;
        setIsAlertOpen: Dispatch<SetStateAction<boolean>>;
    }
    export interface IComments {
        id: number;
        user_name: string;
        contents: string;
        created_at: Dayjs;
        updated_at: Dayjs;
    }
}
