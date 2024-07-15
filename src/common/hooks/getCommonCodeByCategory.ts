import { useQuery } from "react-query";
import { useState } from "react";
import codeService from "@common/services/code/code.service";

const getCommonCodeByCategory = (category: string) => {
    const [SelectOptionsList, setSelectOptionsList] = useState<
        { label: string; value: string }[]
    >([]);

    const {} = useQuery(
        [category],
        () =>
            codeService.getCodeByCategory({
                category: category,
                is_used: true,
            }),
        {
            onSuccess(data) {
                var codeList: { label: string; value: string }[] = [];

                data.common_code.map(code =>
                    codeList.push({ label: code.value, value: code.code })
                );

                setSelectOptionsList(codeList);
            },
        }
    );

    return SelectOptionsList;
};

export default getCommonCodeByCategory;
