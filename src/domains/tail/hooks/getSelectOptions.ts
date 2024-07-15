import { useQuery } from "react-query";
import { useState } from "react";
import codeService from "@common/services/code/code.service";

const getSelectOptions = (category: string) => {
    const [SelectOptionsList, setSelectOptionsList] = useState<
        { label: string; value: string }[]
    >([]);

    const {} = useQuery(
        [category],
        () =>
            codeService.getCommonCode({
                where: {
                    category: {
                        _eq: category,
                    },
                    is_used: { _eq: true },
                },
            }),
        {
            onSuccess(data) {
                var codeList: { label: string; value: string }[] = [];

                data.common_code.map(code =>
                    codeList.push({ label: code.value, value: `${code.code}` })
                );

                setSelectOptionsList(codeList);
            },
        }
    );

    return SelectOptionsList;
};

export default getSelectOptions;
