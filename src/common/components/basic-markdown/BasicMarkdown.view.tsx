import { css } from "@emotion/react";
import { IBasicMarkdown } from "./BasicMarkdown.interface";
import { Colors } from "@configs/colors";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

const VBasicMarkdown: React.FC<IBasicMarkdown.IVProps> = props => {
    const {
        registerKey,
        control,
        label,
        isRequired,
        spaceWidth,
        width,
        height,
        errMsg,
    } = props;

    return (
        <div
            css={rootStyle(
                spaceWidth,
                !!control.getFieldState(registerKey).error?.message,
                width,
                label
            )}
        >
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="input-group">
                <Controller
                    name={registerKey}
                    control={control}
                    rules={{
                        required: isRequired ? errMsg : false,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <div id="editor">
                            <Editor
                                id="tinyEditor"
                                init={{
                                    language: "ko_KR",
                                    height: height ?? "400px",
                                    skin: "naked",
                                    menubar: false,
                                    statusbar: false,
                                }}
                                // apiKey: Tiny MCE에서 발급받은 API KEY
                                apiKey={
                                    process.env.NEXT_PUBLIC_TINY_MCE_API_KEY ??
                                    ""
                                }
                                // plugins: 편집기에 사용할 Plugin ( 이외에도 다양한 Plugin 제공 )
                                plugins={["table", "link"]}
                                // toolbar: 편집기 상단 Toolbar에 생성되는 기능 버튼들
                                toolbar={[
                                    "undo redo | blocks fontsize | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify bullist numlist | table link  | outdent indent | removeformat",
                                ]}
                                value={value}
                                onEditorChange={a => {
                                    onChange(a);
                                }}
                            />
                        </div>
                    )}
                />
                <p id="err-msg">
                    {control.getFieldState(registerKey).error?.message}
                </p>
            </div>
        </div>
    );
};

export default VBasicMarkdown;

const rootStyle = (
    spaceWidth: string,
    isErrVisible: boolean,
    width?: string,
    label?: string
) => css`
    display: flex;
    align-items: start;
    width: ${width ? width : "100%"};
    color: ${Colors.softGray};
    font-weight: 500;

    #head {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 12px;
        width: ${label ? "110px" : "0px"};

        #label {
            color: ${Colors.gray};
            margin-right: 16px;
            white-space: pre-line;
            line-height: 1.6;
            font-size: 14px;
        }
        #star {
            color: ${Colors.wildStrawberry};
        }
        margin-right: ${spaceWidth};
    }

    #input-group {
        display: flex;
        flex: 1;
        flex-direction: column;

        #editor {
            border: 1px solid ${Colors.softGray};
            border-radius: 5px;
            padding: 5px;
        }

        #err-msg {
            color: ${Colors.wildStrawberry};
            margin-top: ${isErrVisible && "10px"};
            font-size: 14px;
        }
    }
`;
