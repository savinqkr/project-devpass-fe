import { css } from "@emotion/react";
import { IRepairReportEditForm } from "./RepairReportEditForm.interface";
import { Button, Divider, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import BasicAutoCompleteSelector from "@common/components/basic-autocomplete-selector";
import BasicDatePicker from "@common/components/basic-datepicker";
import { AttachmentInput, BasicSelector } from "@common/components";
import PATH from "@constants/path";
import { useRouter } from "next/router";
import { Colors } from "@configs/colors";

const VRepairReportEditForm: React.FC<
    IRepairReportEditForm.IVProps
> = props => {
    const {
        inspectors,
        projects,
        control,
        register,
        errors,
        repairReports,
        setRepairReports,
        onClickSubmit,
    } = props;

    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);
    const router = useRouter();
    const id = router.query.id as string;

    return (
        <div css={rootStyle(isMedium)}>
            <form id="form-section">
                <div className="group">
                    <BasicAutoCompleteSelector
                        control={control}
                        registerKey="project"
                        options={projects}
                        spaceWidth="1vw"
                        width={isMedium ? "100%" : "48%"}
                        isRequired={true}
                        label="유지보수 사업"
                        errMsg="유지보수 사업을 선택해주세요."
                    />
                </div>
                <Divider className="divider" />
                <div className="twin-group">
                    <div className="twin-group-item">
                        <BasicDatePicker
                            control={control}
                            registerKey="repair_date"
                            spaceWidth="1vw"
                            width="100%"
                            isRequired={true}
                            label="점검일자"
                            errMsg="점검일자를 선택해주세요."
                        />
                    </div>
                    <Divider className="divider" />
                    <div className="twin-group-item">
                        <BasicSelector
                            control={control}
                            registerKey="inspector_id"
                            spaceWidth="1vw"
                            options={inspectors}
                            width="100%"
                            isRequired={true}
                            label="점검자"
                            msg="점검자를 선택해주세요."
                        />
                    </div>
                </div>
                <Divider className="divider" />
                <div>
                    <div className="group">
                        <AttachmentInput
                            register={register}
                            registerKey="repair_reports"
                            spaceWidth="1vw"
                            isRequired={false}
                            isMultiple={true}
                            isChip={false}
                            accept="image/*"
                            label="첨부문서"
                            htmlFor="attachments-attach"
                            errors={errors}
                            files={repairReports}
                            setFiles={setRepairReports}
                            msg="첨부문서를 추가해주세요."
                        />
                    </div>
                </div>
                <Divider className="divider" />
                <div id="btn-section">
                    <Button
                        variant="outlined"
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                            marginRight: "10px",
                        }}
                        color={"black"}
                        onClick={() =>
                            router.push(`${PATH.REPAIR.INSPECTION.MAIN}/${id}`)
                        }
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            width: 180,
                            height: 36,
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        color={"black"}
                        type="submit"
                        onClick={onClickSubmit}
                    >
                        수정
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default VRepairReportEditForm;

const rootStyle = (isMedium: boolean) => css`
    display: flex;
    flex-direction: column;
    width: 100%;

    .divider {
        margin: 10px 0px;
    }

    #form-section {
        margin-top: 10px;

        .twin-group {
            display: flex;
            flex-direction: ${isMedium ? "column" : "row"};
            justify-content: space-between;
            margin: ${!isMedium && "0px 20px"};

            .twin-group-item {
                padding: ${isMedium && "0px 20px"};
                width: ${isMedium ? "100%" : "48%"};
            }
        }

        .group {
            margin: 0px 20px;
        }
    }

    #btn-section {
        display: flex;
        justify-content: end;
        margin-top: 60px;
    }

    #no-data {
        width: 100%;
        height: 20vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${Colors.softGray};
    }
`;
