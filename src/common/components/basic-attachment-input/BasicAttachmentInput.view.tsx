import { css } from "@emotion/react";
import { IBasicAttachmentInput } from "./BasicAttachmentInput.interface";
import { Colors } from "@configs/colors";
import { Button, Chip } from "@mui/material";
import PreviewChip from "../preview-chip/PreviewChip.impl";

const VBasicAttachmentInput: React.FC<
    IBasicAttachmentInput.IVProps
> = props => {
    const {
        register,
        registerKey,
        htmlFor,
        label,
        isRequired,
        isMultiple,
        isChip,
        spaceWidth,
        file,
        setFile,
        files,
        handleFileChange,
        handleDeleteFile,
    } = props;

    return (
        <div css={rootStyle(spaceWidth)}>
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
                    // accept=".txt, .xls, .xlsx, .csv, .doc, .docx, .pptx, .pdf, image/*"
                    multiple
                    onChange={handleFileChange}
                    css={{ display: "none" }}
                />

                {isMultiple ? (
                    files!.length === 0 ? (
                        <p className="no-data-msg">
                            선택된 첨부파일이 없습니다.
                        </p>
                    ) : (
                        <div id={isChip ? "chip-area" : "preview-area"}>
                            {files!.map((file, idx) => {
                                return !!isChip ? (
                                    <Chip
                                        key={idx}
                                        className="file-clip"
                                        label={file?.name}
                                        variant="outlined"
                                        onDelete={() => handleDeleteFile(idx)}
                                    />
                                ) : (
                                    <div className="preview" key={idx}>
                                        <PreviewChip
                                            file={file}
                                            onDelete={() =>
                                                handleDeleteFile(idx)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : !!file ? (
                    <div id={isChip ? "chip-area" : "preview-area"}>
                        {!!isChip ? (
                            <Chip
                                className="file-clip"
                                label={file?.name}
                                variant="outlined"
                                onDelete={() => handleDeleteFile()}
                            />
                        ) : (
                            <div className="preview">
                                <PreviewChip
                                    file={file!}
                                    onDelete={() => handleDeleteFile()}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="no-data-msg">선택된 첨부파일이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default VBasicAttachmentInput;

const rootStyle = (spaceWidth: string) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    #head {
        width: 140px;
        display: flex;
        flex-direction: row;
        align-items: center;
        #label {
            color: ${Colors.gray};
            margin-right: 16px;
            white-space: pre-line;
        }
        #star {
            color: ${Colors.wildStrawberry};
        }
        margin-right: ${spaceWidth};
    }

    .add-msg {
        width: 100%;
        font-size: 16px;
        color: ${Colors.softGray};
        margin: 10px 0px;
    }

    .no-data-msg {
        width: 100%;
        font-size: 18px;
        text-align: start;
        color: ${Colors.gray};
        margin-bottom: 20px;
    }

    #file-area {
        flex: 1;
    }

    #btn-area {
        #add-file-btn {
            height: 44px;
            width: 140px;
            font-size: 16px;
            border-radius: 0px;
            border-style: dashed;
            cursor: pointer;
        }
    }

    #chip-area {
        margin: 30px 0px 10px;

        .file-clip {
            margin-right: 16px;
            margin-bottom: 1p;
            &:last-child {
                margin-right: 0px;
            }
        }
    }

    #preview-area {
        width: 100%;
        display: grid;
        grid-gap: 20px;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 200px));
        grid-auto-rows: minmax(200px, auto);
    }
`;
