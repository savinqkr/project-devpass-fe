import { useQuery } from "react-query";
import { useState } from "react";
import codeService from "@common/services/code/code.service";

const getCommonOptions = (category: string) => {
    const [SelectOptionsList, setSelectOptionsList] = useState<
        { label: string; value: number }[]
    >([]);

    const {} = useQuery(
        [category],
        () =>
            codeService.getCommonCode({
                where: {
                    category: {
                        _eq: category,
                    },
                    is_used: {
                        _eq: true,
                    },
                },
            }),
        {
            onSuccess(data) {
                var codeList: { label: string; value: number }[] = [];

                data.common_code.map(
                    code =>
                        code.is_used &&
                        codeList.push({
                            label: code.value,
                            value: code.code,
                        })
                );

                setSelectOptionsList(codeList);
            },
        }
    );

    return SelectOptionsList;
};

export default getCommonOptions;
