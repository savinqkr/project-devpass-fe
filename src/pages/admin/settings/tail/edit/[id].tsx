import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import TailEditForm from "@domains/tail/components/tail-edit-form";
import { css } from "@emotion/react";
import { Divider } from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const TailEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="견적서 TAIL 수정"
                    isVisible={false}
                    path={`${PATH.ADMIN.SETTINGS.TAIL.MAIN}/${id}`}
                />
                <Divider className="divider" />

                <div className="table">
                    <TailEditForm />
                </div>
            </div>
        </BasicTemplate>
    );
};

export default TailEdit;

const rootStyle = css`
    .page-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;
