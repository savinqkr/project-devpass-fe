import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import getSelectOptions from "@domains/product/hooks/getSelectOptions";
import { ITailEditForm } from "./TailEditForm.interface";
import { useMutation } from "react-query";
import tailService from "@domains/tail/services/tail.service";
import PATH from "@constants/path";
import { useEffect } from "react";
import VTailEditForm from "./TailEditForm.view";
import useParseJwt from "@hooks/useParseJwt";
import getToken from "@utils/getToken";

const TailEditForm: React.FC<ITailEditForm.IProps> = props => {
    const {
        getValues,
        handleSubmit,
        register,
        setValue,
        control,
        formState: { errors },
    } = useForm<ITailEditForm.IForm>();

    const router = useRouter();
    const id = router.query.id as string;

    var user: {
        iat: any;
        exp: any;
        id: any;
        name: any;
        permission: any;
    } = useParseJwt(getToken(), getToken() ? false : true);

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ Default Value] ----------------------------------------
    const { mutate: getTailByIdMutation } = useMutation(
        ["getTailById"],
        () => tailService.getTailById({ id: parseInt(id) }),
        {
            onSuccess(data) {
                const {
                    type: { code: type_code },
                    name,
                    contents,
                } = data.tail_by_pk;
                setValue("type", type_code);
                setValue("name", name);
                setValue("contents", contents);
            },
        }
    );

    useEffect(() => {
        if (router.isReady) {
            getTailByIdMutation();
        }
    }, [router.isReady]);

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ S E L E C T ] -----------------------------------------

    const productOptions = getSelectOptions("common_type");

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ U P D A T E ] -----------------------------------------
    const { mutate: updateTailMutation } = useMutation(
        ["updateTail"],
        () =>
            tailService.updatedTail({
                id: parseInt(id),
                type_code: getValues("type"),
                name: getValues("name"),
                contents: getValues("contents"),
                updated_by: user.id,
            }),
        {
            onSuccess(data) {
                router.push(
                    `${PATH.ADMIN.SETTINGS.TAIL.MAIN}/${data.update_tail_by_pk.id}`
                );
            },
        }
    );

    const onClickUpdate: SubmitHandler<ITailEditForm.IForm> = form => {
        updateTailMutation();
    };

    // ---------------------------------------------------------------------------------------------
    // ----------------------------------- [ C A N C E L ] -----------------------------------------
    const onClickCancel = () => {
        router.push(`${PATH.ADMIN.SETTINGS.TAIL.MAIN}/${id}`);
    };

    return (
        <VTailEditForm
            onClickUpdate={handleSubmit(onClickUpdate)}
            onClickCancel={onClickCancel}
            errors={errors}
            register={register}
            control={control}
            typeOptions={productOptions}
            {...props}
        />
    );
};

export default TailEditForm;
