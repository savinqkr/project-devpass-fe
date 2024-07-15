import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import type { NextPage } from "next";
import { UserDetail } from "@domains/auth";

const UserDetailPage: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle
                title="사용자 프로필"
                isVisible={true}
                path={`${PATH.ADMIN.USER.MAIN}`}
            />
            <UserDetail />
        </BasicTemplate>
    );
};

export default UserDetailPage;
