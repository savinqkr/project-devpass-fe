import { useQuery } from "react-query";
import { IEmployeeDetail } from "./Employee.interface";
import VEmployeeDetail from "./EmployeeDetail.view";
import employeeService from "@domains/employee/services/employee.service";
import { useRouter } from "next/router";

const Component: React.FC<IEmployeeDetail.IProps> = props => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    // 담당자 상세 조회
    const { data: employeeData } = useQuery(
        ["get employee by pk"],
        () =>
            employeeService.getEmployeeByPk({
                id,
            }),
        {
            enabled: router.isReady,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    return <VEmployeeDetail {...props} employeeData={employeeData} />;
};

export default Component;
