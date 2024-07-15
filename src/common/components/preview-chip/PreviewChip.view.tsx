import { css } from "@emotion/react";
import { IPreviewChip } from "./PreviewChip.interface";
import { CgClose } from "react-icons/cg";
import { Colors } from "@configs/colors";

const VPreviewChip: React.FC<IPreviewChip.IVProps> = props => {
    const { file, preview, onDelete } = props;

    return (
        <div css={rootStyle}>
            <div id="close-btn" onClick={onDelete}>
                <CgClose id="btn-icon" color={Colors.creamyWhite} />
            </div>
            <div id="preivew">{preview}</div>
            <div id="file-info">
                <span id="file-name">{file.name}</span>
                {/* <span id="file-size">({file.size})</span> */}
            </div>
        </div>
    );
};

export default VPreviewChip;

const rootStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 180px;
    height: 220px;

    #btn-icon {
        height: 20px;
        width: 20px;
    }
    #close-btn {
        position: absolute;
        top: 0;
        right: 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 24px;
        background-color: ${Colors.black};
        cursor: pointer;
    }
    #preivew {
        width: 100%;
        height: 100%;
    }
    #file-info {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        /* justify-content: space-between; */
    }

    #file-name,
    #file-size {
        text-overflow: ellipsis;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px 0px;
        font-size: 14px;
        font-weight: 600;
        color: #636363;
    }

    #file-name {
        width: 70%;
    }
`;
