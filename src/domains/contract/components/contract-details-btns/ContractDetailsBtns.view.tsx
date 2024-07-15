import { css } from "@emotion/react";
import { ScreenType } from "@enums";
import { IconButton, useMediaQuery } from "@mui/material";
import { IContractDetailsBtns } from "./ContractDetailsBtns.interface";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const VContractDetailsBtns: React.FC<IContractDetailsBtns.IVProps> = props => {
    const { onClickDeleted, onClickUpdated, isCanceled } = props;
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    return (
        <div css={rootStyle(isMedium)}>
            <IconButton
                color="wildStrawberry"
                onClick={onClickDeleted}
                disabled={isCanceled}
            >
                <MdOutlineDelete size={20} />
            </IconButton>
            <IconButton
                color="oceanBlue"
                onClick={onClickUpdated}
                disabled={isCanceled}
            >
                <MdOutlineEdit size={20} />
            </IconButton>
        </div>
    );
};

export default VContractDetailsBtns;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: row;

    button:last-child {
        margin-left: 8px;
    }
`;
