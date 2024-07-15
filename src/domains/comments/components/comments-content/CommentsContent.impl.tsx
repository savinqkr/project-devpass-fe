import { useEffect, useState } from "react";
import { ICommentsContent } from "./CommentsContent.interface";
import VCommentsContent from "./CommentsContent.view";
import { useMutation, useQuery } from "react-query";
import commentsService from "@domains/comments/service/comments.service";
import loginState from "@recoils/login-state.atom";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { IOrder_By } from "src/codegen/graphql";

const CommentsContent: React.FC<ICommentsContent.IProps> = props => {
    const {} = props;

    const [contents, setContents] = useState<string>("");
    const [editContents, setEditContents] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [comments, setComments] = useState<ICommentsContent.IComments[]>([]);
    const [targetId, setTargetId] = useState<number>();
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [isDes, setIsDes] = useState<boolean>(false);

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
            onSuccess() {
                if (router.isReady) {
                    getAllCommentsRefetch();
                    setContents("");
                }
            },
        }
    );
    // [ Update - 수정 ]
    const { mutate: updateCommentsMutation } = useMutation(
        ["updateCommentsById"],
        () =>
            commentsService.updateCommentsById({
                id: targetId!,
                contents: editContents,
            }),
        {
            onSuccess() {
                if (router.isReady) {
                    getAllCommentsRefetch();
                    setIsEdit(false);
                    setContents("");
                    setTargetId(undefined);
                }
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
            onSuccess() {
                if (router.isReady) {
                    getAllCommentsRefetch();
                    setTargetId(undefined);
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    // [ 전체 댓글 조회 ]
    const { refetch: getAllCommentsRefetch, data: allCommentsData } = useQuery(
        ["getAllCommentsByProjectId"],
        () =>
            commentsService.getAllCommentsByProjectId({
                project_id: parseInt(id),
                order_by: [
                    {
                        created_at: isDes ? IOrder_By.Desc : IOrder_By.Asc,
                    },
                ],
            }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                let commentsList: ICommentsContent.IComments[] = [];

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

    useEffect(() => {
        if (router.isReady) {
            getAllCommentsRefetch();
        }
    }, [isDes]);

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ S E T T I N G S ] ---------------------------------------
    // [ 댓글 등록 및 수정 ]
    const onClickSubmit = () => {
        if (isEdit) {
            updateCommentsMutation();
        } else {
            registerCommentsMutation();
        }
    };

    // [ 댓글 수정 활성화 ]
    const onClickUpdate = (id: number) => {
        setIsEdit(true);
        setTargetId(id);

        if (allCommentsData) {
            const editTarget = allCommentsData.comments.find(item => {
                return item.id === id;
            });

            editTarget && setEditContents(editTarget.contents);
        }
    };

    // [ 댓글 수정 취소 ]
    const onCancelUpdate = () => {
        setTargetId(undefined);
        setIsEdit(false);
        setContents("");
    };

    // [ 삭제 확인 Alert 핸들 ]
    const handleDeleteAlert = (newOpen: boolean, targetId: number) => {
        setIsAlertOpen(newOpen);
        setTargetId(targetId);
    };

    // [ 댓글 삭제 ]
    const onClickDelete = () => {
        if (targetId) {
            deleteCommentsMutation();
        }
    };

    // [ 댓글 정렬 핸들 ]
    const handleCommentsOrder = () => {
        setIsDes(!isDes);
    };

    return (
        <VCommentsContent
            {...props}
            contents={contents}
            setContents={setContents}
            editContents={editContents}
            setEditContents={setEditContents}
            comments={comments}
            isEdit={isEdit}
            isAlertOpen={isAlertOpen}
            targetId={targetId}
            onClickSubmit={onClickSubmit}
            onClickUpdate={onClickUpdate}
            onCancelUpdate={onCancelUpdate}
            onClickDelete={onClickDelete}
            handleDeleteAlert={handleDeleteAlert}
            isDes={isDes}
            handleCommentsOrder={handleCommentsOrder}
        />
    );
};

export default CommentsContent;
