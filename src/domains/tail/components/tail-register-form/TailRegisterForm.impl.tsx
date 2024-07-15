import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import getSelectOptions from "@domains/product/hooks/getSelectOptions";
import { ITailRegisterForm } from "./TailRegisterForm.interface";
import VTailRegisterForm from "./TailRegisterForm.view";
import { useMutation } from "react-query";
import tailService from "@domains/tail/services/tail.service";
import PATH from "@constants/path";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";

const TailRegisterForm: React.FC<ITailRegisterForm.IProps> = props => {
    const {
        getValues,
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<ITailRegisterForm.IForm>();

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
    const productOptions = getSelectOptions("common_type");

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S U B M I T ] -----------------------------------------
    const { mutate: createTailMutation } = useMutation(
        ["createTail"],
        () =>
            tailService.registerTailOne({
                type_code: getValues("type"),
                name: getValues("name"),
                contents: getValues("contents"),
                created_by: user.id,
                updated_by: user.id,
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.ADMIN.SETTINGS.TAIL.MAIN}/${data.insert_tail_one.id}`
                );
            },
        }
    );

    const onSubmit: SubmitHandler<ITailRegisterForm.IForm> = form => {
        createTailMutation();
        // console.log(getValues("contents"));
    };

    return (
        <VTailRegisterForm
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            register={register}
            control={control}
            typeOptions={productOptions}
            {...props}
        />
    );
};

export default TailRegisterForm;
