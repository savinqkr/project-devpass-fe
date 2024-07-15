import { SubmitHandler, useForm } from "react-hook-form";
import VProductForm from "./ProductRegisterForm.view";
import { useMutation } from "react-query";
import productService from "../../services/product.service";
import { IProductRegisterForm } from "./ProductRegisterForm.interface";
import { useRouter } from "next/router";
import getSelectOptions from "@domains/product/hooks/getSelectOptions";
import removeCommaOfMoney from "@hooks/removeCommaOfMoney";
import PATH from "@constants/path";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";

const ProductRegisterForm: React.FC<IProductRegisterForm.IProps> = props => {
    const {
        getValues,
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<IProductRegisterForm.IForm>();

    const router = useRouter();

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S E L E C T ] -----------------------------------------
    let productOptions = getSelectOptions("common_type");
    productOptions = productOptions.filter(item => {
        return item.label !== "유지보수";
    });

    const purposeOptions = getSelectOptions("product_purpose");
    const classOptions = getSelectOptions("product_class");
    const unitOptions = getSelectOptions("product_unit");

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S U B M I T ] -----------------------------------------
    const { mutate: createProduct } = useMutation(
        ["createProduct"],
        () =>
            productService.createProduct({
                type: getValues("type"),
                purpose: getValues("purpose"),
                class: getValues("class"),
                name: getValues("name"),
                unit: getValues("unit"),
                price: removeCommaOfMoney(getValues("price")),
                note: getValues("note"),
                created_by: user.id,
                updated_by: user.id,
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.PRODUCT.MAIN}/${data.insert_product_one.id}`
                );
            },
        }
    );

    const onSubmit: SubmitHandler<IProductRegisterForm.IForm> = form => {
        createProduct();
    };

    return (
        <VProductForm
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            register={register}
            control={control}
            typeOptions={productOptions}
            purposeOptions={purposeOptions}
            classOptions={classOptions}
            unitOptions={unitOptions}
            {...props}
        />
    );
};

export default ProductRegisterForm;
