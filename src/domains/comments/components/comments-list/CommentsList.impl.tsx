import commentsService from "@domains/comments/service/comments.service";
import { ICommentsList } from "./CommentsList.interface";
import VCommentsList from "./CommentsList.view";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { useMutation, useQuery } from "react-query";
import dayjs from "dayjs";
import chatScreenState from "@recoils/chat-screen-state.atom";
import { IOrder_By } from "src/codegen/graphql";

const CommentsList: React.FC<ICommentsList.IProps> = props => {
    const [contents, setContents] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [comments, setComments] = useState<ICommentsList.IComments[]>([]);
    const [targetId, setTargetId] = useState<number>();
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

    const router = useRouter();
    const id = router.query.id as string;

    const loginUser = useRecoilValue(loginState);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ M U T A T I O N ] ---------------------------------------
    // [ Register - 등록 ]
    const { mutate: registerCommentsMutation } = useMutation(
        ["registerComments"],
        () =>
            commentsService.registerComments({
                project_id: parseInt(id),
                writer_id: loginUser.id!,
                writer_name: loginUser.name!,
                contents: contents,
            }),
        {
            onSuccess(data, variables, context) {
                getAllCommentsRefetch();
                setContents("");
            },
        }
    );

    // [ Update - 수정 ]
    const { mutate: updateCommentsMutation } = useMutation(
        ["updateCommentsById"],
        () =>
            commentsService.updateCommentsById({
                id: targetId!,
                contents,
            }),
        {
            onSuccess() {
                getAllCommentsRefetch();
                setIsEdit(false);
                setContents("");
                setTargetId(undefined);
            },
        }
    );

    // [ Delete - 삭제 ]
    const { mutate: deleteCommentsMutation } = useMutation(
        ["deleteCommentsById"],
        () =>
            commentsService.deleteCommentsById({
                id: targetId!,
            }),
        {
            onSuccess(data, variables, context) {
                getAllCommentsRefetch();
                setTargetId(undefined);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    const { refetch: getAllCommentsRefetch, data: allCommentsData } = useQuery(
        ["getAllCommentsByProjectId"],
        () =>
            commentsService.getAllCommentsByProjectId({
                project_id: parseInt(id),
                order_by: [
                    {
                        created_at: IOrder_By.Desc,
                    },
                ],
            }),
        {
            enabled: router.isReady && !!id,
            onSuccess(data) {
                let commentsList: ICommentsList.IComments[] = [];

                data.comments.forEach(item => {
                    commentsList.push({
                        id: item.id,
                        user_name: item.writer_name,
                        contents: item.contents,
                        created_at: dayjs(item.created_at),
                        updated_at: dayjs(item.updated_at),
                    });
                });

                setComments(commentsList);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ S E T T I N G S ] ---------------------------------------
    const onClickSubmit = () => {
        if (contents !== "" && !isEdit) {
            registerCommentsMutation();
        } else if (contents !== "" && isEdit && targetId) {
            updateCommentsMutation();
        }
    };

    const onClickUpdate = (id: number) => {
        setIsEdit(true);
        setTargetId(id);

        if (allCommentsData) {
            const editTarget = allCommentsData.comments.find(item => {
                return item.id === id;
            });

            editTarget && setContents(editTarget.contents);
        }
    };

    const onCancelUpdate = () => {
        setTargetId(undefined);
        setIsEdit(false);
        setContents("");
    };

    const onOpenDeleteAlert = (id: number) => {
        setTargetId(id);
        setIsAlertOpen(true);
    };

    const onClickDelete = () => {
        if (targetId) {
            deleteCommentsMutation();
            setIsAlertOpen(false);
        }
    };

    return (
        <VCommentsList
            {...props}
            contents={contents}
            setContents={setContents}
            isEdit={isEdit}
            onClickSubmit={onClickSubmit}
            onClickUpdate={onClickUpdate}
            onClickDelete={onClickDelete}
            onOpenDeleteAlert={onOpenDeleteAlert}
            onCancelUpdate={onCancelUpdate}
            comments={comments}
            isAlertOpen={isAlertOpen}
            setIsAlertOpen={setIsAlertOpen}
        />
    );
};

export default CommentsList;
