import { css } from "@emotion/react";
import { ICommentsContent } from "./CommentsContent.interface";
import {
    Alert,
    Button,
    Fade,
    IconButton,
    InputAdornment,
    TextField,
    useMediaQuery,
} from "@mui/material";
import { ScreenType } from "@enums";
import {
    MdAdd,
    MdDeleteOutline,
    MdOutlineEdit,
    MdKeyboardArrowUp,
    MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { Colors } from "@configs/colors";
import loginState from "@recoils/login-state.atom";
import { useRecoilValue } from "recoil";

const VCommentsContent: React.FC<ICommentsContent.IVProps> = props => {
    const {
        contents,
        setContents,
        editContents,
        setEditContents,
        comments,
        isEdit,
        isAlertOpen,
        targetId,
        onClickSubmit,
        onClickUpdate,
        onCancelUpdate,
        onClickDelete,
        handleDeleteAlert,
        isDes,
        handleCommentsOrder,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const loginUser = useRecoilValue(loginState);

    return (
        <div css={rootStyle(isMedium)}>
            <div id="comments-section">
                {/* ----- 댓글 등록 Input ----- */}
                <div id="input-group">
                    <div id="text-field">
                        <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={3}
                            variant="outlined"
                            placeholder="댓글을 입력해주세요."
                            value={contents}
                            InputProps={{
                                style: { fontSize: "12px" },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <div id="add-btn">
                                            <IconButton
                                                color="deepPurple"
                                                onClick={onClickSubmit}
                                            >
                                                <MdAdd />
                                            </IconButton>
                                        </div>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={e => {
                                setContents(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <Button
                    id="sort-btn"
                    onClick={handleCommentsOrder}
                    color="charcoalGray"
                >
                    <div>
                        <p>{isDes ? "최신순" : "과거순"}</p>
                        {isDes ? (
                            <MdOutlineKeyboardArrowDown />
                        ) : (
                            <MdKeyboardArrowUp />
                        )}
                    </div>
                </Button>
                {/* ----- 댓글 그룹 ----- */}
                {comments.length === 0 ? (
                    <div id="no-data-msg">작성된 댓글이 없습니다.</div>
                ) : (
                    <div id="comments-group">
                        {comments.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    className="comments"
                                    style={{
                                        backgroundColor:
                                            item.user_name === loginUser.name
                                                ? Colors.blackOp30
                                                : Colors.white,
                                    }}
                                >
                                    {/* ----- 댓글 정보 & 수정, 삭제 버튼 ----- */}
                                    <div className="options">
                                        <div className="info-group">
                                            <p className="user-info">
                                                {item.user_name}
                                            </p>
                                            <p className="date">
                                                {item.updated_at.format(
                                                    "YYYY/MM/DD HH:mm"
                                                ) ??
                                                    item.created_at.format(
                                                        "YYYY/MM/DD HH:mm"
                                                    )}
                                            </p>
                                        </div>
                                        {/* {isEdit && targetId === item.id && (
                                            <Button
                                                className="update-cancel-btn"
                                                onClick={() => onCancelUpdate()}
                                            >
                                                수정 취소
                                            </Button>
                                        )}
                                        {loginUser.name === item.user_name &&
                                            !isEdit && (
                                                <div className="btn-group">
                                                    <IconButton
                                                        color="oceanBlue"
                                                        onClick={() =>
                                                            onClickUpdate(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <MdOutlineEdit
                                                            size={16}
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        color="wildStrawberry"
                                                        sx={{
                                                            color: Colors.wildStrawberry,
                                                        }}
                                                        onClick={() =>
                                                            handleDeleteAlert(
                                                                true,
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <MdDeleteOutline
                                                            size={16}
                                                        />
                                                    </IconButton>
                                                </div>
                                            )} */}
                                    </div>

                                    {/* ----- 댓글 내용 ----- */}
                                    <div className="comments-content">
                                        {isEdit && targetId === item.id ? (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                multiline
                                                minRows={3}
                                                variant="outlined"
                                                value={editContents}
                                                onChange={e => {
                                                    setEditContents(
                                                        e.target.value
                                                    );
                                                }}
                                                InputProps={{
                                                    style: { fontSize: "12px" },
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <div id="add-btn">
                                                                <IconButton
                                                                    color="deepPurple"
                                                                    onClick={() =>
                                                                        onClickSubmit()
                                                                    }
                                                                >
                                                                    <MdOutlineEdit />
                                                                </IconButton>
                                                            </div>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            ></TextField>
                                        ) : (
                                            <pre>{item.contents}</pre>
                                        )}
                                    </div>
                                    {/* ----- 삭제 확인 Alert ----- */}
                                    <Fade
                                        className="delete-alert"
                                        in={isAlertOpen && targetId === item.id}
                                    >
                                        <Alert
                                            color="info"
                                            action={
                                                <div className="delete-btn-group">
                                                    <Button
                                                        sx={{
                                                            fontSize: 12,
                                                            color: Colors.wildStrawberry,
                                                        }}
                                                        onClick={() =>
                                                            onClickDelete()
                                                        }
                                                    >
                                                        삭제
                                                    </Button>
                                                    <Button
                                                        sx={{
                                                            fontSize: 12,
                                                        }}
                                                        onClick={() =>
                                                            handleDeleteAlert(
                                                                false,
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        취소
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            해당 댓글을 삭제하시겠습니까?
                                        </Alert>
                                    </Fade>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VCommentsContent;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    width: 100%;

    #comments-section {
        width: 90%;
        min-width: 200px;

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

        #sort-btn {
            margin-top: 10px;

            div {
                display: flex;
                align-items: center;

                p {
                    font-size: 12px;
                }
            }
        }

        #no-data-msg {
            margin-top: 40px;
            text-align: center;
            font-size: 15px;
            color: ${Colors.softGray};
        }

        #comments-group {
            margin-top: 10px;
            height: 40vh;
            overflow: scroll;

            .comments {
                position: relative;
                border-bottom: 1px solid ${Colors.grayC};
                padding: 15px 15px;

                .info-group {
                    display: flex;
                    align-items: end;

                    .user-info {
                        margin-right: 5px;
                        color: ${Colors.gray};
                        font-size: 13px;
                    }

                    .date {
                        font-size: 11px;
                        color: ${Colors.softGray};
                    }
                }

                .options {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;

                    .btn-group {
                        height: 12px;
                        display: none;

                        button {
                            padding: 3px 3px 3px 5px;
                        }
                    }
                }

                .update-cancel-btn {
                    font-size: 12px;
                    padding: 2px 5px;
                }

                &:hover {
                    .btn-group {
                        display: flex;
                    }
                }

                .comments-content {
                    padding: 0px 10px;
                    margin-top: 10px;
                    font-size: 12px;
                    color: ${Colors.charcoalGray};

                    pre {
                        line-height: 1.3;
                    }
                }

                .divider {
                    margin: 15px 0px;
                }
            }
        }
    }

    .delete-alert {
        position: absolute;
        top: 10px;
        right: 0px;
        width: 330px;
        padding: 2px 15px;

        p {
            font-size: 12px;
        }

        .css-ki1hdl-MuiAlert-action {
            padding: 4px 0 0 5px;
            margin-left: 0;
        }

        button {
            min-width: 45px;
            max-height: 30px;
            padding: 6px 0;
        }
    }
`;
