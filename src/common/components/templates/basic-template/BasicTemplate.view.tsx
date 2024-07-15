import { css } from "@emotion/react";
import { IBasicTemplate } from "./BasicTemplate.interface";
import { ScreenType } from "@enums";
import { useMediaQuery } from "@mui/material";
import Header from "@common/components/header";
import Menu from "@common/components/menu";
import { useRecoilState } from "recoil";
import chatScreenState from "@recoils/chat-screen-state.atom";
import CommentsList from "@domains/comments/components/comments-list/CommentsList.impl";
import { useRouter } from "next/router";
import { useEffect } from "react";

const VBasicTemplate: React.FC<IBasicTemplate.IVProps> = ({ children }) => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const [isChatOpen, setIsChatOpen] = useRecoilState(chatScreenState);

    const router = useRouter();
    const id = router.query.id as string;

    useEffect(() => {
        !id && setIsChatOpen(false);
    }, [id]);

    return (
        <>
            <Header />
            <div css={rootStyle(isMedium, isChatOpen)}>
                <div id="menu-area">{!isMedium && <Menu />}</div>
                <div id="main-area">{children}</div>
                <div id="chat-area">{isChatOpen && id && <CommentsList />}</div>
            </div>
        </>
    );
};

export default VBasicTemplate;

const rootStyle = (isMedium: boolean, isChatOpen: boolean) => css`
    position: relative;
    min-height: calc(100vh - 56px);

    #menu-area {
        width: 250px;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
    }
    #main-area {
        margin-left: ${isMedium ? "0px" : "250px"};
        width: ${isChatOpen
            ? isMedium
                ? "calc(100% - 240px)"
                : "calc(100% - 700px)"
            : isMedium
              ? "100%"
              : "calc(100% - 250px)"};
        padding: ${isMedium
            ? "40px 5vw 20px"
            : `60px ${isChatOpen ? "3vw" : "10vw"} 40px`};
        height: calc(100vh - 56px);
        overflow: scroll;
    }
    #chat-area {
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        width: ${isChatOpen ? (isMedium ? "240px" : "450px") : "0px"};
        height: calc(100vh -56px);
        transition: width 0.5s ease;
        overflow-x: scroll;
    }
`;
