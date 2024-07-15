import { useForm } from "react-hook-form";
import { IProductEditForm } from "./ProductEditForm.interface";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import productService from "../../services/product.service";
import getSelectOptions from "@domains/product/hooks/getSelectOptions";
import PATH from "@constants/path";
import VProductEditForm from "./ProductEditForm.view";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import { useRecoilValue } from "recoil";
import loginState from "@recoils/login-state.atom";

const ProductEditForm: React.FC<IProductEditForm.IProps> = props => {
    const {
        getValues,
        handleSubmit,
        register,
        setValue,
        control,
        formState: { errors },
    } = useForm<IProductEditForm.IForm>();

    const router = useRouter();
    const id = router.query.id as string;
    const loginUser = useRecoilValue(loginState);

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- [ Select Option ] ----------------------------------------
    let typeOptions = getSelectOptions("common_type");
    typeOptions = typeOptions.filter(item => {
        return item.label !== "유지보수";
    });
    const purposeOptions = getSelectOptions("product_purpose");
    const classOptions = getSelectOptions("product_class");
    const unitOptions = getSelectOptions("product_unit");

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ Default Value ] -----------------------------------------
    const { refetch: fetchProduct } = useQuery(
        ["getProductOneByIdQuery"],
        () => productService.getProductOneById({ id: parseInt(id) }),
        {
            enabled: !!id,
            onSuccess(data) {
                const {
                    type: { code: type_code },
                    class: { code: class_code },
                    purpose: { code: purpose_code },
                    name,
                    unit: { code: unit_code },
                    price,
                    note,
                } = data.product_by_pk;

                setValue("name", name);
                setValue("note", note);
                setValue("price", numberToMoney(moneyToNumber(price)));
                setValue("type", type_code);
                setValue("purpose", purpose_code);
                setValue("unit", unit_code);
                setValue("class", class_code);
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ U P D A T E ] -----------------------------------------
    const { mutate: updateProductMutation } = useMutation(
        ["updateProduct"],
        () =>
            productService.updateProductById({
                id: parseInt(id),
                type: getValues("type"),
                purpose: getValues("purpose"),
                class: getValues("class"),
                name: getValues("name"),
                unit: getValues("unit"),
                price: moneyToNumber(getValues("price")),
                note: getValues("note"),
                updated_by: loginUser.id!,
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.PRODUCT.MAIN}/${data.update_product_by_pk.id}`
                );
            },
        }
    );

    const onClickUpdate = () => {
        updateProductMutation();
    };

    return (
        <VProductEditForm
            onClickUpdate={handleSubmit(onClickUpdate)}
            errors={errors}
            register={register}
            control={control}
            typeOptions={typeOptions}
            purposeOptions={purposeOptions}
            classOptions={classOptions}
            unitOptions={unitOptions}
            {...props}
        />
    );
};

export default ProductEditForm;
