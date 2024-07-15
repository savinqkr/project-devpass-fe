import { css } from "@emotion/react";
import { IEmployeeDetail } from "./Employee.interface";
import { DetailInfoRow } from "@common/components";
import { Chip, Divider, useMediaQuery } from "@mui/material";
import { Colors } from "@configs/colors";
import { ScreenType } from "@enums";

const VEmployeeDetail: React.FC<IEmployeeDetail.IVProps> = props => {
    const { employeeData } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return (
        <div css={rootStyle(isMedium)}>
            <div className="form-section">
                <DetailInfoRow
                    label="회사"
                    value={employeeData?.employee_by_pk.company?.name}
                />
                <DetailInfoRow
                    label="이름"
                    value={employeeData?.employee_by_pk.name}
                    tag={
                        employeeData?.employee_by_pk.deleted_at && (
                            <Chip
                                label="Deleted"
                                sx={{
                                    padding: "0px 10px",
                                    color: Colors.wildStrawberry,
                                    fontSize: "16px",
                                    backgroundColor: "rgba(255, 51, 99, 0.12)",
                                    border: "none",
                                }}
                            />
                        )
                    }
                />
                <div className="row-section">
                    <DetailInfoRow
                        label="부서"
                        value={employeeData?.employee_by_pk.department}
                    />
                    <DetailInfoRow
                        label="직함"
                        value={employeeData?.employee_by_pk.position}
                    />
                </div>
                <DetailInfoRow
                    label="역할"
                    children={
                        <>
                            {employeeData?.employee_by_pk.roles.length !== 0 ? (
                                employeeData?.employee_by_pk.roles
                                    .filter(
                                        role => role.role.deleted_at === null
                                    )
                                    .map((role, idx) => (
                                        <Chip
                                            className="role-chip"
                                            key={`role-${idx}`}
                                            label={role.role?.value ?? ""}
                                            sx={{
                                                padding: "0px 4px",
                                                fontSize: 14,
                                                height: 28,
                                                color: Colors.deepPurple,
                                                backgroundColor:
                                                    Colors.lavenderPurple,
                                            }}
                                        />
                                    ))
                            ) : (
                                <span>-</span>
                            )}
                        </>
                    }
                />
                <DetailInfoRow
                    label="이메일"
                    value={employeeData?.employee_by_pk.email}
                />
                <div className="row-section">
                    <DetailInfoRow
                        label="연락처"
                        value={employeeData?.employee_by_pk.contact}
                    />
                    <DetailInfoRow
                        label="휴대폰 번호"
                        value={employeeData?.employee_by_pk.phone}
                    />
                </div>
                <DetailInfoRow
                    label="비고"
                    isNote={true}
                    value={employeeData?.employee_by_pk.note}
                />
                <Divider />
            </div>
        </div>
    );
};

export default VEmployeeDetail;

const rootStyle = (isMedium: boolean) => css`
    .row-section {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
    }
    .role-chip {
        margin-right: 12px;
    }
`;
