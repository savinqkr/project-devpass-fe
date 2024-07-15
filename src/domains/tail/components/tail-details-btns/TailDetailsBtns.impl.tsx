import { useRouter } from "next/router";
import { ITailDetailsBtns } from "./TailDetailsBtns.interface";
import VTailDetailsBtns from "./TailDetailsBtns.view";
import { useMutation } from "react-query";
import tailService from "../../services/tail.service";
import PATH from "@constants/path";

const TailDetailsBtns: React.FC<ITailDetailsBtns.IProps> = props => {
    const router = useRouter();
    const id = router.query.id as string;

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

    const onDeleted = () => {
        if (window.confirm("TAIL을 삭제하시겠습니까?")) {
            deletedTailByIdMutation();
        }
    };

    // ---------------------------------------------------------------------------------------------
    // --------------------------------- [ U P D A T E ] -------------------------------------------
    const onUpdated = () => {
        router.push(`${PATH.ADMIN.SETTINGS.TAIL.EDIT}/${id}`);
    };

    return (
        <VTailDetailsBtns
            onClickDeleted={onDeleted}
            onClickUpdated={onUpdated}
            {...props}
        />
    );
};

export default TailDetailsBtns;
