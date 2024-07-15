import type { NextPage } from "next";
import PageTitle from "@common/components/page-title";
import BasicTemplate from "@common/components/templates/basic-template/BasicTemplate.impl";
import ProductRegisterForm from "@domains/product/components/product-register-form";
import PATH from "@constants/path";

const ProductRegister: NextPage = () => {
    return (
        <BasicTemplate>
            <PageTitle
                title="제품 등록"
                isVisible={false}
                path={PATH.PRODUCT.MAIN}
            />
            <ProductRegisterForm />
        </BasicTemplate>
    );
};

export default ProductRegister;
