import { css } from "@emotion/react";
import {
    Alert,
    Avatar,
    Button,
    Collapse,
    Divider,
    IconButton,
    Slide,
    Snackbar,
    TextField,
    Tooltip,
    useMediaQuery,
} from "@mui/material";
import { ScreenType } from "@enums";
import { ICommentsList } from "./CommentsList.interface";
import CreateIcon from "@mui/icons-material/Create";
import { Colors } from "@configs/colors";
import { useRecoilState, useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";
import { PageTitle } from "@common/components";
import chatScreenState from "@recoils/chat-screen-state.atom";
import {
    MdOutlineEdit,
    MdDeleteOutline,
    MdArrowForwardIos,
} from "react-icons/md";
import { useState } from "react";

const VCommentsList: React.FC<ICommentsList.IVProps> = props => {
    const {
        setContents,
        contents,
        isEdit,
        onClickSubmit,
        onClickUpdate,
        onClickDelete,
        onOpenDeleteAlert,
        onCancelUpdate,
        comments,
        isAlertOpen,
        setIsAlertOpen,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const loginUser = useRecoilValue(loginState);

    const [chatScreenRecoil, setChatScreenRecoil] =
        useRecoilState(chatScreenState);

    return (
        <div css={drawerStyle(isMedium)} id="comments-drawer">
            <div id="drawer-contents">
                <div id="title">
                    <IconButton
                        color="deepPurple"
                        onClick={() => {
                            setChatScreenRecoil(false);
                        }}
                    >
                        <MdArrowForwardIos size={15} />
                    </IconButton>
                    <p>댓글</p>
                </div>
                <Divider />
                <div id="comments-group">
                    {comments.map((item, idx) => (
                        <div
                            key={item.id}
                            css={commentsStyle(
                                item.user_name === loginUser.name,
                                item.user_name === comments[idx - 1]?.user_name,
                                item.updated_at.format("YYYY/MM/DD HH:mm") ===
                                    comments[idx - 1]?.updated_at.format(
                                        "YYYY/MM/DD HH:mm"
                                    )
                            )}
                        >
                            <div className="info-group">
                                {/* --------------- 수정, 삭제 버튼 -------------- */}
                                {/* <Tooltip
                                    placement="right"
                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                backgroundColor: "#ffffff01",
                                                padding: "0px",
                                                margin: "0px",
                                            },
                                        },
                                    }}
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -8],
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                    title={
                                        item.user_name === loginUser.name && (
                                            <div className="comments-option-btns">
                                                <IconButton
                                                    color="oceanBlue"
                                                    onClick={() =>
                                                        onClickUpdate(item.id)
                                                    }
                                                >
                                                    <MdOutlineEdit
                                                        size={"15px"}
                                                    />
                                                </IconButton>
                                                <IconButton
                                                    color="wildStrawberry"
                                                    onClick={() =>
                                                        onOpenDeleteAlert(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <MdDeleteOutline
                                                        size={"15px"}
                                                    />
                                                </IconButton>
                                            </div>
                                        )
                                    }
                                >
                                    <pre className="contents">
                                        {item.contents}
                                    </pre>
                                </Tooltip> */}
                                <pre className="contents">{item.contents}</pre>
                                <p className="comments-info">
                                    {item.user_name}
                                    <span>
                                        {item.updated_at.format(
                                            "YYYY/MM/DD HH:mm"
                                        )}
                                    </span>
                                </p>
                            </div>
                            <div className="space" />
                            <div className="avatar">
                                <Avatar
                                    sx={{
                                        width: "30px",
                                        height: "30px",
                                        fontSize: "15px",
                                        backgroundColor: `${Colors.grayC}`,
                                    }}
                                >
                                    {item.user_name[0]}
                                </Avatar>
                            </div>
                        </div>
                    ))}
                </div>
                <div id="input-section">
                    {isEdit && (
                        <div id="edit-info">
                            <p id="edit-msg">댓글 수정중입니다.</p>
                            <Button
                                id="edit-cancel-btn"
                                onClick={onCancelUpdate}
                            >
                                취소
                            </Button>
                        </div>
                    )}
                    <div id="input-group">
                        <div id="text-field">
                            <TextField
                                size="small"
                                fullWidth
                                multiline
                                minRows={2}
                                maxRows={3}
                                variant="standard"
                                placeholder="댓글을 입력해주세요."
                                value={contents}
                                InputProps={{ style: { fontSize: "12px" } }}
                                onChange={e => {
                                    setContents(e.target.value);
                                }}
                            />
                        </div>
                        <div id="add-btn">
                            <IconButton
                                color="deepPurple"
                                onClick={onClickSubmit}
                            >
                                {isEdit ? <MdOutlineEdit /> : <CreateIcon />}{" "}
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={isAlertOpen}
                autoHideDuration={5000}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => {
                    setIsAlertOpen(false);
                }}
            >
                <Alert
                    sx={{ fontSize: 12 }}
                    id="delete-alert"
                    severity="info"
                    action={
                        <div>
                            <Button
                                sx={{ fontSize: 11, minWidth: 50 }}
                                onClick={onClickDelete}
                            >
                                확인
                            </Button>
                            <Button
                                sx={{ fontSize: 11, minWidth: 50 }}
                                onClick={() => {
                                    setIsAlertOpen(false);
                                }}
                            >
                                취소
                            </Button>
                        </div>
                    }
                >
                    해당 댓글을 삭제하시겠습니까?
                </Alert>
            </Snackbar>
        </div>
    );
};

export default VCommentsList;

const drawerStyle = (isMedium: boolean) => css`
    width: ${isMedium ? " 223px" : "433px"};
    height: calc(100vh - 80px);
    border-left: 1px solid ${Colors.blackOp30};

    #drawer-contents {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        padding: ${isMedium ? "40px 10px 30px 10px" : "40px 20px 30px 30px"};

        #title {
            display: flex;
            align-items: center;
            padding-bottom: 5px;

            p {
                font-size: 18px;
            }
        }

        #input-section {
            background-color: white;
            position: fixed;
            bottom: 10px;
            right: ${isMedium ? "30px" : "50px"};
            width: ${isMedium ? "170px" : "350px"};
            display: flex;
            align-items: start;
            flex-direction: column;
            margin: 0px auto;
            padding-bottom: 10px;

            #edit-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 2px 10px;
                width: 100%;
                background-color: ${Colors.blackOp30};

                #edit-msg {
                    font-size: 12px;
                    color: ${Colors.gray};
                }

                #edit-cancel-btn {
                    font-size: 12px;
                }
            }
            #input-group {
                display: flex;
                width: 100%;

                #text-field {
                    flex: 1;
                }

                #add-btn {
                    margin-left: 10px;

                    button {
                        padding: 0;
                    }
                }
            }
        }

        #comments-group {
            padding: ${isMedium ? "0 0 0 20px" : "10px"};
            height: calc(100vh - 150px);
            overflow: scroll;
            display: flex;
            flex-direction: column-reverse;
        }
    }

    #deleted-alert {
    }
`;

const commentsStyle = (
    isMatched: boolean,
    isGroup: boolean,
    isSkipInfo: boolean
) => css`
    display: flex;
    flex-direction: ${isMatched ? "row" : "row-reverse"};
    justify-content: ${isMatched ? "end" : "start"};
    margin-bottom: ${isGroup ? "5px" : "20px"};

    .avatar {
        display: flex;
        width: 30px;
        height: auto;
        align-items: end;
        margin-bottom: 13px;

        div {
            display: ${isGroup && "none"};
        }
    }

    .space {
        margin-left: 10px;
    }

    .info-group {
        display: flex;
        flex-direction: column;
        align-items: ${isMatched ? "end" : "start"};

        .contents {
            padding: 10px 15px;
            max-width: 260px;
            border-radius: 20px;
            border-bottom-left-radius: ${!isMatched && "3px"};
            border-bottom-right-radius: ${isMatched && "3px"};
            background-color: ${isMatched
                ? Colors.lightPurple
                : Colors.blackOp30};
            color: ${isMatched ? Colors.white : Colors.charcoalGray};
            font-size: 12.5px;
            word-break: break-all;
            white-space: pre-wrap;
            letter-spacing: 0.1px;
            line-height: 1.3;
        }

        .comments-info {
            display: ${isSkipInfo && "none"};
            margin-top: 2px;
            font-size: 9px;
            color: ${Colors.softGray};

            span {
                margin-left: 5px;
            }
        }
    }
`;
