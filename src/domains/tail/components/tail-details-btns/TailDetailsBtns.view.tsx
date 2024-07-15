import { css } from "@emotion/react";
import { ITailDetailsBtns } from "./TailDetailsBtns.interface";
import BasicButton from "@common/components/basic-button/BasicButton.impl";
import { ButtonType } from "@enums";

const VTailDetailsBtns: React.FC<ITailDetailsBtns.IVProps> = props => {
    const { onClickDeleted, onClickUpdated } = props;

    return (
        <div css={rootStyle}>
            {/* 삭제 버튼 */}
            <BasicButton
                width="120px"
                type={ButtonType.OUTLINED}
                title="삭제"
                color={"wildStrawberry"}
                onClick={onClickDeleted}
            />
            {/* 수정 버튼 */}
            <BasicButton
                width="120px"
                type={ButtonType.OUTLINED}
                title="수정"
                color={"oceanBlue"}
                onClick={onClickUpdated}
            />
        </div>
    );
};

export default VTailDetailsBtns;

const rootStyle = css`
    display: flex;

    button:last-child {
        margin-left: 20px;
    }
`;
