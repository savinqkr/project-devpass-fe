import PageTitle from "@common/components/page-title/PageTitle.impl";
import { css } from "@emotion/react";
import type { NextPage } from "next";
import ProductEditForm from "@domains/product/components/product-edit-form/ProductEditForm.impl";
import BasicTemplate from "@common/components/templates/basic-template/BasicTemplate.impl";
import PATH from "@constants/path";
import { useRouter } from "next/router";

const ProductEdit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <BasicTemplate>
            <PageTitle
                title="제품 수정"
                isVisible={false}
                path={`${PATH.PRODUCT.MAIN}/${id}`}
            />
            <ProductEditForm />
        </BasicTemplate>
    );
};

export default ProductEdit;
