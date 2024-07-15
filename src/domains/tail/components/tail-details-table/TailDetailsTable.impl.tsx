import { useRouter } from "next/router";
import { ITailDetailsTable } from "./TailDetailsTable.interface";
import VTailDetailsTable from "./TailDetailsTable.view";
import { useMutation, useQuery } from "react-query";
import tailService from "@domains/tail/services/tail.service";
import { useState } from "react";
import PATH from "@constants/path";

const TailDetailsTable: React.FC<ITailDetailsTable.IProps> = props => {
    const router = useRouter();
    const id = router.query.id as string;

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------ [ Q U E R Y ] ------------------------------------------
    var [tail, setTail] = useState<ITailDetailsTable.IVTail>();

    const {} = useQuery(
        ["getTailById"],
        () => tailService.getTailById({ id: parseInt(id) }),
        {
            enabled: router.isReady,
            onSuccess(data) {
                setTail({
                    type: data.tail_by_pk.type.value,
                    name: data.tail_by_pk.name,
                    contents: data.tail_by_pk.contents,
                    deleted_at: data.tail_by_pk.deleted_at,
                });
            },
        }
    );

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ D E L E T E ] -------------------------------------------
    const { mutate: deletedTailByIdMutation } = useMutation(
        ["deleteTailByIdMutation"],
        () =>
            tailService.deletedTailById({
                id: parseInt(id),
            }),
        {
            onSuccess() {
                router.push(PATH.ADMIN.SETTINGS.TAIL.MAIN);
            },
        }
    );

    const onClickDelete = () => {
        if (window.confirm("TAIL을 삭제하시겠습니까?")) {
            deletedTailByIdMutation();
        }
    };

    return (
        <VTailDetailsTable
            tail={tail}
            onClickDelete={onClickDelete}
            {...props}
        />
    );
};

export default TailDetailsTable;
