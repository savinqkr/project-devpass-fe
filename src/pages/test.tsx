import attachmentService from "@common/services/attachment/attachment.service";
import { Colors } from "@configs/colors";
import { css } from "@emotion/react";
import { Button, Chip, Divider } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const TestPage: NextPage = () => {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };
    const handleDeleteFile = (index: number) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const onClickUpload = () => {
        attachmentService.uploadFile({
            file: files[0],
            created_by: 123,
            parent_id: 123,
            type_code: 123,
        });
    };

    return (
        <div css={rootStyle}>
            <h2>TEST FILE UPLOAD</h2>
            <Button variant="outlined" id="add-file-btn">
                <label htmlFor="test">첨부파일 추가</label>
            </Button>
            <input
                type="file"
                id="test"
                accept=".txt, .xls, .xlsx, .csv, .doc, .docx, .pptx, .pdf, image/*"
                multiple
                onChange={handleFileChange}
                css={{ display: "none" }}
            />
            <div id="files">
                {files.length === 0 ? (
                    <p css={{ color: Colors.grayC }}>
                        첨부파일을 추가해주세요.
                    </p>
                ) : (
                    files.map((file, idx) => {
                        return (
                            <Chip
                                key={idx}
                                className="file-clip"
                                label={file?.name}
                                variant="outlined"
                                onDelete={() => handleDeleteFile(idx)}
                            />
                        );
                    })
                )}
            </div>
            <Button
                variant="contained"
                color="black"
                id="upload-btn"
                onClick={onClickUpload}
            >
                UPLOAD
            </Button>
            <Divider sx={{ width: "100%", margin: "100px" }} />
            <h2>TEST FILE DOWNLOAD</h2>
            <Button variant="contained" color="black" id="upload-btn">
                <a href="http://localhost:9090/file/download/123">DOWNLOAD</a>
            </Button>
            <Divider sx={{ width: "100%", margin: "100px" }} />
            <h2>TEST GET FILE </h2>
            <Button variant="contained" color="black" id="upload-btn">
                GET FILE
            </Button>
        </div>
    );
};

export default TestPage;

const rootStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        margin: 40px 0px;
    }

    #inputs {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid red;
    }

    #add-file-btn {
        margin-bottom: 20px;
    }

    #files {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .file-clip {
        margin-top: 20px;
    }

    #upload-btn {
        margin-top: 50px;
        width: 140px;
    }
`;
