import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import TailRegisterForm from "@domains/tail/components/tail-register-form";
import { Divider, css } from "@mui/material";
import type { NextPage } from "next";

const TailRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="견적서 TAIL 등록"
                    isVisible={false}
                    path={PATH.ADMIN.SETTINGS.TAIL.MAIN}
                />
                <Divider className="divider" />
                <div className="table">
                    <TailRegisterForm />
                </div>
            </div>
        </BasicTemplate>
    );
};

export default TailRegister;

const rootStyle = css`
    .table {
        max-height: 70%;
    }
`;
