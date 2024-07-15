import { css } from "@emotion/react";
import { IPreviewChip } from "./PreviewChip.interface";
import VPreviewChip from "./PreviewChip.view";
import { AiFillFilePdf } from "react-icons/ai";
import { AiFillFileExcel } from "react-icons/ai";
import { AiFillFileWord } from "react-icons/ai";
import { AiFillFilePpt } from "react-icons/ai";
import { BiSolidFileTxt } from "react-icons/bi";

const PreviewChip: React.FC<IPreviewChip.IProps> = props => {
    const { file } = props;

    const getIconPreview = (file: File) => {
        const extension = file?.name.split(".").at(-1);
        switch (extension) {
            case "csv":
            case "xls":
            case "xlsx":
                return (
                    <div css={iconPreviewStyle}>
                        <AiFillFileExcel className="icon" color="#00680A" />
                    </div>
                );
            case "pdf":
                return (
                    <div css={iconPreviewStyle}>
                        <AiFillFilePdf className="icon" color="#E12929" />
                    </div>
                );
            case "doc":
            case "docx":
                return (
                    <div css={iconPreviewStyle}>
                        <AiFillFileWord className="icon" color="#295293" />
                    </div>
                );
            case "pptx":
                return (
                    <div css={iconPreviewStyle}>
                        <AiFillFilePpt className="icon" color="#CB4424" />
                    </div>
                );
            case "txt":
                return (
                    <div css={iconPreviewStyle}>
                        <BiSolidFileTxt className="icon" />
                    </div>
                );
            default:
                return (
                    <div css={imgPreviewStyle}>
                        <img
                            id="img"
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                        />
                    </div>
                );
        }
    };

    return <VPreviewChip {...props} preview={getIconPreview(file)} />;
};

export default PreviewChip;

const iconPreviewStyle = css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #dddddda4;

    .icon {
        width: 140px;
        height: 140px;
    }
`;
const imgPreviewStyle = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #dddddda4;
    #img {
        width: 180px;
        height: 180px;
        object-fit: contain;
    }
`;
