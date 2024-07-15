import { css } from "@emotion/react";
import { IAttachmentInput } from "./AttachmentInput.interface";
import { Colors } from "@configs/colors";
import { Button, Chip } from "@mui/material";
import PreviewChip from "../preview-chip/PreviewChip.impl";

const VAttachmentInput: React.FC<IAttachmentInput.IVProps> = props => {
    const {
        register,
        registerKey,
        files,
        errors,
        validate,
        msg,
        accept,
        htmlFor,
        label,
        isRequired,
        isMultiple,
        isChip,
        spaceWidth,
        handleFileChange,
        handleDelete,
    } = props;

    return (
        <div css={rootStyle(spaceWidth, isChip)}>
            <div id="head">
                {label && <span id="label">{label}</span>}
                {isRequired && <span id="star">*</span>}
            </div>
            <div id="file-area">
                <div id="btn-area">
                    <Button variant="outlined" id="add-file-btn">
                        <label htmlFor={htmlFor}>첨부파일 추가</label>
                    </Button>
                    <p className="add-msg">첨부파일을 추가해주세요.</p>
                </div>
                <input
                    {...register(registerKey)}
                    type="file"
                    id={htmlFor}
                    accept={accept || ""}
                    multiple={isMultiple}
                    onChange={handleFileChange}
                    css={{ display: "none" }}
                />
                {!!files && files?.length !== 0 ? (
                    <div id={isChip ? "chip-area" : "preview-area"}>
                        {files?.map((attachment: any, idx: number) =>
                            isChip ? (
                                <Chip
                                    key={`chip-${idx}`}
                                    className="chip"
                                    variant="outlined"
                                    label={attachment.file.name}
                                    onDelete={() => handleDelete(idx)}
                                />
                            ) : (
                                <PreviewChip
                                    key={`preview-${idx}`}
                                    file={attachment.file}
                                    onDelete={() => handleDelete(idx)}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <p className="no-data-msg">선택된 첨부파일이 없습니다.</p>
                )}
                {/* {!!errors && errors![registerKey] && (
                    <p id="err-msg">
                        {errors![registerKey]?.message as string}
                    </p>
                )} */}
            </div>
        </div>
    );
};

export default VAttachmentInput;

const rootStyle = (spaceWidth: string, isChip?: boolean) => css`
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: start;
    width: 100%;
    #head {
        width: 110px;
        display: flex;
        flex-direction: row;
        align-items: center;
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
    .add-msg {
        width: 100%;
        font-size: 14px;
        color: ${Colors.softGray};
        margin: 10px 0px;
    }
    .no-data-msg {
        width: 100%;
        font-size: 16px;
        text-align: start;
        color: ${Colors.gray};
        margin-bottom: 10px;
    }
    #file-area {
        flex: 1;
    }
    #btn-area {
        #add-file-btn {
            height: 32px;
            width: 120px;
            font-size: 13px;
            border-radius: 5px;
            border-style: dashed;
            cursor: pointer;
        }
    }
    #err-msg {
        color: ${Colors.wildStrawberry};
        margin: 32px 0px 10px;
        font-size: 14px;
    }
    #chip-area {
        .chip {
            margin: 0px 10px 10px 0px;
        }
    }
    #preview-area {
        width: 100%;
        display: grid;
        grid-gap: 20px;
        gap: 20px;
        grid-template-columns: repeat(
            auto-fit,
            minmax(${isChip ? "10px" : "200px"}, ${isChip ? "200px" : "200px"})
        );
        grid-auto-rows: minmax(${isChip ? "36px" : "200px"}, auto);
    }
`;
