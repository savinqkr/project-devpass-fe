import { css } from "@emotion/react";
import { BasicTemplate, PageTitle } from "@common/components";
import PATH from "@constants/path";
import employeeService from "@domains/employee/services/employee.service";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Colors } from "@configs/colors";
import { EmployeeDetail } from "@domains/employee/components";
import { IconButton } from "@mui/material";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

const EmployeeDetailPage: NextPage = () => {
    const router = useRouter();
    const id = parseInt(router.query.id as string, 10);

    // 담당자 삭제
    const { mutate: deleteEmployeeMutate } = useMutation(
        ["delete employee by pk"],
        () =>
            employeeService.deleteEmployeeByPk({
                id,
            }),
        {
            onSuccess: result => {
                router.push(PATH.CLIENT.EMPLOYEE.MAIN);
            },
        }
    );
    const onClickDeleteEmployee = () => {
        if (confirm("담당자를 삭제하시겠습니까?")) {
            deleteEmployeeMutate();
        }
    };

    return (
        <BasicTemplate>
            <div css={rootStyle}>
                <PageTitle
                    title="담당자 상세"
                    isVisible={true}
                    path={PATH.CLIENT.EMPLOYEE.MAIN}
                />
                <div className="group">
                    <p className="menu-info">
                        {"거래처 > 담당자 > 전체 담당자 > "}
                        <span css={{ color: Colors.oceanBlue }}>
                            담당자 상세
                        </span>
                    </p>
                    <div className="btn-group">
                        <IconButton
                            color="wildStrawberry"
                            onClick={onClickDeleteEmployee}
                        >
                            <MdOutlineDelete size={20} />
                        </IconButton>
                        <div className="space" />
                        <IconButton
                            color="oceanBlue"
                            onClick={() =>
                                router.push(
                                    `${PATH.CLIENT.EMPLOYEE.EDIT}/${id}`
                                )
                            }
                        >
                            <MdOutlineEdit size={20} />
                        </IconButton>
                    </div>
                </div>
                <EmployeeDetail />
            </div>
        </BasicTemplate>
    );
};

export default EmployeeDetailPage;

const rootStyle = css`
    .group {
        margin: 24px 0px 30px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
    }

    .menu-info {
        color: ${Colors.gray};
    }

    .regi-btn {
        width: 80px;
        height: 42px;
        color: #1976d2;
    }

    .msg {
        color: ${Colors.softGray};
        font-size: 17px;
        text-align: center;
        margin-top: 120px;
    }
    .btn-group {
        width: 80px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        .space {
            width: 16px;
        }
    }
`;
