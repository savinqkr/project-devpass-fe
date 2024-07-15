import { Dayjs } from "dayjs";
import { Dispatch, SetStateAction } from "react";

export namespace ICommentsContent {
    export interface IProps {}
    export interface IVProps extends IProps {
        contents: string;
        setContents: Dispatch<SetStateAction<string>>;
        editContents: string;
        setEditContents: Dispatch<SetStateAction<string>>;
        comments: IComments[];
        isEdit: Boolean;
        targetId: number | undefined;
        isAlertOpen: boolean;
        onClickSubmit: () => void;
        onClickUpdate: (id: number) => void;
        onClickDelete: () => void;
        onCancelUpdate: () => void;
        handleDeleteAlert: (newOpen: boolean, targetId: number) => void;
        isDes: boolean;
        handleCommentsOrder: () => void;
    }
    export interface IComments {
        id: number;
        user_name: string;
        contents: string;
        created_at: Dayjs;
        updated_at: Dayjs;
    }
}
