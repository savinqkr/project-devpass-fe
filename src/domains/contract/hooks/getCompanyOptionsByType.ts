import companyService from "@domains/company/services/company.service";
import { useState } from "react";
import { useQuery } from "react-query";
import { CompanyType } from "src/enums/company_type.enum";

const getCompanyOptionsByType = (company_types: [CompanyType]) => {
    var [companyOptions, setCompanyOptions] = useState<
        { label: string; value: number }[]
    >([]);

    const {} = useQuery(
        ["getAllClient"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _in: company_types,
                        },
                    },
                },
            }),
        {
            onSuccess(data) {
                var company = data.map(client => {
                    return { label: client!.name, value: client!.id };
                });

                setCompanyOptions(company);
            },
        }
    );

    return companyOptions;
};

export default getCompanyOptionsByType;
