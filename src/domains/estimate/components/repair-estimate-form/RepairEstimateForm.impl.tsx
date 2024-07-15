import { IRepairEstimateForm } from "./RepairEstimateForm.interface";
import { CodeCategory } from "src/enums/code_category.enum";
import companyService from "@domains/company/services/company.service";
import { useQuery } from "react-query";
import { CompanyType } from "src/enums/company_type.enum";
import projectService from "@domains/project/service/project.service";
import { useEffect, useState } from "react";
import estimateService from "@domains/estimate/services/estimate.service";
import numberToMoney from "@utils/numberToMoney";
import moneyToNumber from "@utils/moneyToNumber";
import dayjs from "dayjs";
import tailService from "@domains/tail/services/tail.service";
import productService from "@domains/product/services/product.service";
import codeService from "@common/services/code/code.service";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { EstimateDetailsOptionTypeEnum } from "@enums";
import VRepairEstimateForm from "./RepairEstimateForm.view";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { IOrder_By } from "src/codegen/graphql";
import repairDetailsEstimateModalState from "@recoils/repair-estimate-detail-modal-state.atom";
import { EditTextareaCell, IntOnlyEditInputCell } from "@common/components";
import { CommonType } from "src/enums/common_type.enum";

const RepairEstimateForm: React.FC<IRepairEstimateForm.IProps> = props => {
    const {
        originalEstimateData,
        rows,
        setRows,
        watch,
        getValues,
        setValue,
        detailsApiRef,
        isAutoCompleteActivated,
        setIsAutoCompleteActivated,
        removeOriginalEstimateDataCache,
    } = props;

    /* 수정페이지에 해당 */
    useEffect(() => {
        if (!!originalEstimateData?.estimate_by_pk) {
            setVatChecked(originalEstimateData?.estimate_by_pk.vat_include);
            setSpecialDiscountChecked(
                originalEstimateData?.estimate_by_pk.add_special_discount
            );
        }
    }, [originalEstimateData]);

    // COMMON CODE ( 유지보수 )
    const { data: repairCode } = useQuery(["get repair type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.REPAIR },
            },
        })
    );

    // 라이선스 도입 사업  RECOIL
    const [repairDetailsEstimateModal, setRepairDetailsEstimateModal] =
        useRecoilState(repairDetailsEstimateModalState);

    // ---------------------------------------------------------------------------
    // 다른 견적 불러오기
    // ---------------------------------------------------------------------------
    const [estimateModal, setEstimateModal] =
        useRecoilState(estimateModalState);

    const resetEstiamteModal = useResetRecoilState(estimateModalState);

    // const [isAutoCompleteActivated, setIsAutoCompleteActivated] =
    //     useState<boolean>(true);

    const {
        data: otherEstimateData,
        refetch: fetchSelectedEstiamte,
        remove: removeOtherEstiamteCache,
    } = useQuery(
        ["get selected estimate by pk for repair estimate"],
        () =>
            estimateService.getEstimateByPk({
                id: estimateModal.selectedEstimateId!,
            }),
        {
            enabled: false,
            retry: false,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                if (data.estimate_by_pk) {
                    const {
                        project,
                        employee_name,
                        employee_email,
                        employee_contact,
                        employee_phone,
                        destination,
                        doc_num,
                        case_name,
                        estimate_date,
                        validity,
                        estimate_price,
                        vat_include,
                        discount_rate,
                        total_price,
                        add_special_discount,
                        special_discount_price,
                        total_price_vat,
                        tail,
                        details,
                    } = data.estimate_by_pk;

                    // /***** 다른 필드 값에 영향을 받아 채워지는 필드들은 아래에서 SET *****/
                    // 고객사
                    if (!!project) {
                        setValue("selected_client", {
                            label: project.client.name,
                            value: project.client.id,
                        });
                    }

                    // setValue("destination", destination);
                    // setValue("case_name", case_name);
                    setValue("estimate_date", dayjs(estimate_date).utc(true));
                    // setValue("validity", dayjs(validity).utc(true));
                    // setValue(
                    //     "estimate_price",
                    //     numberToMoney(moneyToNumber(estimate_price))
                    // );
                    // 세부내역
                    const initialRows = details
                        .sort((a, b) => a.row_index - b.row_index)
                        .map((row, idx) => ({
                            id: idx + 1,
                            license_project_name: row.license_project_name,
                            year: row.year,
                            type: row.type,
                            purpose: row.purpose,
                            class: row.class,
                            product_type: row.product_type,
                            product: row.product,
                            details: row.details,
                            unit: row.unit,
                            amount: row.amount,
                            price: moneyToNumber(row.price),
                            supply_price: moneyToNumber(row.supply_price),
                            monthly_repair_price: moneyToNumber(
                                row.monthly_repair_price || "0"
                            ),
                            total_repair_price: moneyToNumber(
                                row.total_repair_price || "0"
                            ),
                            start_date: row.start_date,
                            end_date: row.end_date,
                            license_contract_id: row.license_contract_id,

                            // note: row.note,
                        }));
                    setRows(initialRows);
                    const licenseContractIds: number[] = initialRows
                        .map(ele => ele.license_contract_id)
                        .filter((id): id is number => !!id);

                    setRepairDetailsEstimateModal(prev => ({
                        ...prev,
                        selectedClientId:
                            data?.estimate_by_pk.project.client.id,
                        selectedRepairProjectId:
                            data?.estimate_by_pk.project.id,
                        appliedLicenseContractId: licenseContractIds,
                        registeredLicenseContractId: licenseContractIds,
                        selectedLicenseContractId: licenseContractIds,
                    }));

                    setValue("discount_rate", discount_rate);
                    setValue(
                        "special_discount_price",
                        numberToMoney(moneyToNumber(special_discount_price))
                    );
                    // setValue(
                    //     "total_price",
                    //     numberToMoney(moneyToNumber(total_price))
                    // );
                    // setValue(
                    //     "total_price_vat",
                    //     numberToMoney(moneyToNumber(total_price_vat))
                    // );
                    // setValue("add_special_discount", add_special_discount);
                    setSpecialDiscountChecked(add_special_discount);
                    // setValue("vat_include", vat_include);
                    setVatChecked(vat_include);
                    setValue("tail", tail);
                    // 견적 불러온 직후 > 자동 입력 비활성화
                    setIsAutoCompleteActivated(false);
                } else {
                    alert("검색된 견적이 없습니다.");
                }
            },
        }
    );

    // 첫 렌더링시 RECOIL & CACHE DATA 초기화
    useEffect(() => {
        resetEstiamteModal();
        removeOtherEstiamteCache();
        if (!!removeOriginalEstimateDataCache) {
            removeOriginalEstimateDataCache();
        }
    }, []);

    useEffect(() => {
        // 적용하기
        if (estimateModal.selectedEstimateId) {
            fetchSelectedEstiamte();
        }
        // 모달이 다시 열리면 CACHE DATA 삭제 & 자동 입력 활성화
        if (estimateModal.isOpen) {
            removeOtherEstiamteCache(); // CACHE DATA 삭제
            setIsAutoCompleteActivated(true); // 자동 입력 활성화
        }
    }, [estimateModal]);

    // 견적 불러오기 후, 수정했을 경우 ( REACT HOOK FORM )
    useEffect(() => {
        const formWatch = watch((value, { name, type }) => {
            if (type === "change" && !isAutoCompleteActivated) {
                resetEstiamteModal();
                removeOtherEstiamteCache();
                setIsAutoCompleteActivated(true); // 자동 입력 활성화
            }
            return () => formWatch.unsubscribe();
        });
    }, [otherEstimateData, estimateModal, originalEstimateData]);

    // 견적 불러오기 후, 수정했을 경우 ( MUI DATAGRID )
    const onCellEditStart = () => {
        if (!isAutoCompleteActivated) {
            setIsAutoCompleteActivated(true);
        }
    };

    // useEffect(() => {
    //     console.log(isAutoCompleteActivated);
    // }, [isAutoCompleteActivated]);

    // ---------------------------------------------------------------------------------
    // 고객사 옵션
    // ---------------------------------------------------------------------------------
    const { data: clientData } = useQuery(
        ["get client options for repair estimate"],
        () =>
            companyService.getCompanies({
                where: {
                    type: {
                        value: {
                            _eq: CompanyType.CLIENT,
                        },
                    },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: true,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // ---------------------------------------------------------------------------------
    // 사업 옵션
    // ---------------------------------------------------------------------------------
    const { data: projectOptions } = useQuery(
        [
            "get project options by selected client for repair estimate",
            watch("selected_client"),
            isAutoCompleteActivated,
        ],
        () =>
            projectService.getProjectByConditions({
                where: {
                    type: {
                        code: { _eq: repairCode?.common_code[0].code || 0 },
                    },
                    client_id: {
                        _eq: parseInt(
                            getValues("selected_client.value") as string,
                            10
                        ),
                    },
                    is_canceled: { _eq: false },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled:
                !!repairCode?.common_code[0].code &&
                !!getValues("selected_client.value") &&
                getValues("selected_client.value") !== "default",
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
            onSuccess(data) {
                if (!isAutoCompleteActivated) {
                    originalEstimateData
                        ? // 견적 수정
                          setValue("project_id", {
                              label:
                                  originalEstimateData?.estimate_by_pk.project
                                      .name || "",
                              value:
                                  originalEstimateData?.estimate_by_pk.project
                                      .id || "",
                          })
                        : // 견적 불러오기
                          setValue("project_id", {
                              label:
                                  otherEstimateData?.estimate_by_pk.project
                                      .name || "",
                              value:
                                  otherEstimateData?.estimate_by_pk.project
                                      .id || "",
                          });
                }
            },
        }
    );

    // ---------------------------------------------------------------------------------
    // 고객사 OR 사업 필드 재선택할 경우, 연관된 필드 초기화
    // ---------------------------------------------------------------------------------
    // 고객사
    useEffect(() => {
        if (isAutoCompleteActivated) {
            setValue("project_id", {
                label: "선택해주세요",
                value: "default",
            });
            setValue("selected_employee", {
                label: "선택해주세요",
                value: "default",
            });
            setValue("employee_name", "");
            setValue("employee_email", "");
            setValue("employee_contact", "");
            setValue("employee_phone", "");
            setValue("doc_num", "");
            setValue("case_name", "");
            setValue("selected_head_employee", {
                label: "선택해주세요",
                value: "default",
            });
            setValue("head_employee_name", "");
            setValue("head_employee_email", "");
            setValue("head_employee_contact", "");
        }
    }, [watch("selected_client")]);

    // 사업
    useEffect(() => {
        if (isAutoCompleteActivated) {
            setValue("selected_employee", {
                label: "선택해주세요",
                value: "default",
            });
            setValue("employee_name", "");
            setValue("employee_email", "");
            setValue("employee_contact", "");
            setValue("employee_phone", "");

            setValue("selected_head_employee", {
                label: "선택해주세요",
                value: "default",
            });
            setValue("head_employee_name", "");
            setValue("head_employee_email", "");
            setValue("head_employee_contact", "");
        }
    }, [watch("project_id")]);

    // ---------------------------------------------------------------------------------
    // 건명 자동 입력
    // ( 기본 ) 고객사 사업명
    // ---------------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            if (
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default" &&
                !!getValues("selected_client.value") &&
                getValues("selected_client.value") !== "default"
            ) {
                setValue(
                    "case_name",
                    `${getValues("selected_client.label")} ${getValues(
                        "project_id.label"
                    )}`
                );
            }
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "case_name",
                    originalEstimateData?.estimate_by_pk.case_name || ""
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "case_name",
                    otherEstimateData?.estimate_by_pk.case_name || ""
                );
            }
        }
    }, [watch("project_id"), watch("selected_client")]);

    // ---------------------------------------------------------------------------------
    // 담당자 옵션
    // ---------------------------------------------------------------------------------
    const { data: employeeOpions } = useQuery(
        [
            "get employee options by selected project for repair estimate",
            watch("project_id"),
            isAutoCompleteActivated,
        ],
        () =>
            projectService.getProjectMembers({
                where: {
                    project_id: {
                        _eq:
                            parseInt(
                                getValues("project_id.value") as string,
                                10
                            ) || 0,
                    },
                    employee: {
                        company: { type: { value: { _neq: "본사" } } },
                    },
                },
            }),
        {
            enabled:
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default",
            onSuccess(data) {
                if (!isAutoCompleteActivated) {
                    const employeeRole = data?.project_employee.find(ele => {
                        // 견적 수정
                        if (originalEstimateData) {
                            return (
                                originalEstimateData?.estimate_by_pk
                                    .employee_name === ele.employee.name
                            );
                        }
                        // 견적 불러오기
                        if (otherEstimateData) {
                            return (
                                otherEstimateData?.estimate_by_pk
                                    .employee_name === ele.employee.name
                            );
                        }
                    });

                    if (!!employeeRole) {
                        setValue("selected_employee", {
                            label: `${employeeRole.employee.name} ( ${
                                employeeRole!.employee.company.name
                            }, ${employeeRole.role.value} ) `,
                            value: employeeRole.employee.id,
                        });
                    }
                }
            },
        }
    );

    // 담당자 선택 > 이메일 & 연락처 & 핸드폰번호 자동 입력
    useEffect(() => {
        if (isAutoCompleteActivated) {
            const selectedEmployee = employeeOpions?.project_employee.find(
                ele => getValues("selected_employee").value === ele.employee.id
            )?.employee;

            if (!!selectedEmployee) {
                setValue("employee_name", selectedEmployee.name);
                setValue("employee_email", selectedEmployee.email);
                setValue("employee_contact", selectedEmployee.contact);
                setValue("employee_phone", selectedEmployee.phone);
            }
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "employee_name",
                    originalEstimateData?.estimate_by_pk.employee_name || ""
                );
                setValue(
                    "employee_email",
                    originalEstimateData?.estimate_by_pk.employee_email || ""
                );
                setValue(
                    "employee_contact",
                    originalEstimateData?.estimate_by_pk.employee_contact || ""
                );
                setValue(
                    "employee_phone",
                    originalEstimateData?.estimate_by_pk.employee_phone || ""
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "employee_name",
                    otherEstimateData?.estimate_by_pk.employee_name || ""
                );
                setValue(
                    "employee_email",
                    otherEstimateData?.estimate_by_pk.employee_email || ""
                );
                setValue(
                    "employee_contact",
                    otherEstimateData?.estimate_by_pk.employee_contact || ""
                );
                setValue(
                    "employee_phone",
                    otherEstimateData?.estimate_by_pk.employee_phone || ""
                );
            }
        }
    }, [watch("selected_employee")]);

    // ---------------------------------------------------------------------------------
    // 본사 견적 담당자 옵션
    // ---------------------------------------------------------------------------------
    const { data: headEmployeeOpions } = useQuery(
        [
            "get head office employee options by selected project for license estimate",
            watch("project_id"),
            isAutoCompleteActivated,
        ],
        () =>
            projectService.getProjectMembers({
                where: {
                    project_id: {
                        _eq:
                            parseInt(
                                getValues("project_id.value") as string,
                                10
                            ) || 0,
                    },
                    employee: {
                        company: { type: { value: { _eq: "본사" } } },
                    },
                },
            }),
        {
            enabled:
                !!getValues("project_id.value") &&
                getValues("project_id.value") !== "default",
            onSuccess(data) {
                if (!isAutoCompleteActivated) {
                    const employeeRole = data?.project_employee.find(ele => {
                        // 견적 수정
                        if (originalEstimateData) {
                            return (
                                originalEstimateData?.estimate_by_pk
                                    .head_employee_name ===
                                `${ele.employee.name} ${ele.employee.position}`
                            );
                        }
                        // 견적 불러오기
                        if (otherEstimateData) {
                            return (
                                otherEstimateData?.estimate_by_pk
                                    .head_employee_name ===
                                `${ele.employee.name} ${ele.employee.position}`
                            );
                        }
                    });
                    if (!!employeeRole) {
                        setValue("selected_head_employee", {
                            label: employeeRole.employee.name,
                            value: employeeRole.employee.id,
                        });
                    }
                }
            },
        }
    );

    // 담당자 선택 > 이메일 & 연락처 & 핸드폰번호 자동 입력
    useEffect(() => {
        if (isAutoCompleteActivated) {
            const selectedHeadEmployee =
                headEmployeeOpions?.project_employee.find(
                    ele =>
                        getValues("selected_head_employee").value ===
                        ele.employee.id
                )?.employee;
            if (!!selectedHeadEmployee) {
                setValue(
                    "head_employee_name",
                    `${selectedHeadEmployee.name} ${
                        selectedHeadEmployee.position ?? ""
                    }`
                );
                setValue("head_employee_email", selectedHeadEmployee.email);
                setValue("head_employee_contact", selectedHeadEmployee.phone);
            }
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "head_employee_name",
                    originalEstimateData?.estimate_by_pk.head_employee_name ||
                        ""
                );
                setValue(
                    "head_employee_email",
                    originalEstimateData?.estimate_by_pk.head_employee_email ||
                        ""
                );
                setValue(
                    "head_employee_contact",
                    originalEstimateData?.estimate_by_pk
                        .head_employee_contact || ""
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "head_employee_name",
                    otherEstimateData?.estimate_by_pk.head_employee_name || ""
                );
                setValue(
                    "head_employee_email",
                    otherEstimateData?.estimate_by_pk.head_employee_email || ""
                );
                setValue(
                    "head_employee_contact",
                    otherEstimateData?.estimate_by_pk.head_employee_contact ||
                        ""
                );
            }
        }
    }, [watch("selected_head_employee")]);

    // ---------------------------------------------------------------------------------
    // 수신처 자동 입력
    // ---------------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            // ( 기본 ) 담당자 선택 X : 고객사
            if (
                getValues("selected_client.value") !== "default" &&
                getValues("selected_employee.value") === "default"
            ) {
                setValue("destination", getValues("selected_client.label"));
            }

            // ( 기본 ) 담당자 선택 O : 담당자의 회사
            const selectedEmployee = employeeOpions?.project_employee.find(
                ele => getValues("selected_employee").value === ele.employee.id
            )?.employee;
            if (
                getValues("selected_employee.value") !== "default" &&
                !!selectedEmployee
            ) {
                setValue("destination", selectedEmployee.company.name);
            }
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "destination",
                    originalEstimateData?.estimate_by_pk.destination || ""
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "destination",
                    otherEstimateData?.estimate_by_pk.destination || ""
                );
            }
        }
    }, [watch("selected_client"), watch("selected_employee")]);

    // ---------------------------------------------------------------------------------
    // 유효기간
    // ( 기본 ) : 견적일자 + 30 일
    // ---------------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            setValue(
                "validity",
                dayjs(getValues("estimate_date")).add(30, "day")
            );
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "validity",
                    dayjs(originalEstimateData?.estimate_by_pk.validity)
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "validity",
                    dayjs(otherEstimateData?.estimate_by_pk.validity)
                );
            }
        }
    }, [watch("estimate_date")]);

    // ---------------------------------------------------------------------------------
    // 할인율 적용
    // ------e---------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            const updatedRows = rows.map(row => {
                // 유지보수 요율 ( null 일 경우, 기본 15% 적용)
                const repair_rate =
                    projectOptions?.project.find(
                        ele => ele.id === getValues("project_id.value")
                    )?.repair_rate || 15;
                // 기간 ( 개월 )
                const period = dayjs(
                    row[EstimateDetailsOptionTypeEnum.END_DATE]
                ).diff(
                    dayjs(row[EstimateDetailsOptionTypeEnum.START_DATE]),
                    "month"
                );
                // 공급금액
                const supply_price =
                    row[EstimateDetailsOptionTypeEnum.SUPPLY_PRICE];

                // 월유지보수 금액 ( 요율 적용 & 할인율 적용 )
                const monthly_repair_price = Math.floor(
                    ((supply_price * (repair_rate / 100)) / 12) *
                        (1 - getValues("discount_rate") / 100)
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE]:
                        monthly_repair_price,
                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                        monthly_repair_price * period,
                };
            });
            setRows(updatedRows);
        }
    }, [watch("discount_rate")]);

    // ---------------------------------------------------------------------------------
    // 공급금액 합계 ( 부가세포함 X ) & 특별 할인 금액
    // ---------------------------------------------------------------------------------
    const [specialDiscountChecked, setSpecialDiscountChecked] =
        useState<boolean>(false);
    const handleSpecialDiscount = (event: any) => {
        setIsAutoCompleteActivated(true); // 자동 입력 활성화
        setSpecialDiscountChecked(event.target.checked);
    };

    useEffect(() => {
        setValue("add_special_discount", specialDiscountChecked);
    }, [specialDiscountChecked]);

    useEffect(() => {
        if (isAutoCompleteActivated) {
            let total_price = 0;
            rows.forEach(row => {
                if (!!row[EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]) {
                    total_price +=
                        row[EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE];
                }
            });
            setValue(
                "total_price",
                numberToMoney(
                    specialDiscountChecked
                        ? total_price -
                              moneyToNumber(
                                  `${
                                      !!getValues("special_discount_price")
                                          ? getValues("special_discount_price")
                                          : "0"
                                  }`
                              )
                        : total_price
                )
            );
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "total_price",
                    numberToMoney(
                        moneyToNumber(
                            originalEstimateData?.estimate_by_pk.total_price ||
                                "0"
                        )
                    )
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "total_price",
                    numberToMoney(
                        moneyToNumber(
                            otherEstimateData?.estimate_by_pk.total_price || "0"
                        )
                    )
                );
            }
        }
    }, [rows, watch("special_discount_price"), specialDiscountChecked]);

    // ---------------------------------------------------------------------------------
    // 공급금액 합계 ( 부가세포함 O )
    // ---------------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            setValue(
                "total_price_vat",
                numberToMoney(
                    Math.round(
                        moneyToNumber(getValues("total_price") || "0") * 1.1
                    )
                )
            );
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "total_price_vat",
                    numberToMoney(
                        moneyToNumber(
                            originalEstimateData?.estimate_by_pk
                                .total_price_vat || "0"
                        )
                    )
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "total_price_vat",
                    numberToMoney(
                        moneyToNumber(
                            otherEstimateData?.estimate_by_pk.total_price_vat ||
                                "0"
                        )
                    )
                );
            }
        }
    }, [watch("total_price")]);

    // ---------------------------------------------------------------------------------
    // 부가세포함 여부
    // - 부가세포함 OFF : 견적금액 = 공급금액 ( 부가세포함 X )
    // - 부가세포함 ON : 견적금액 = 공급금액 ( 부가세포함 O )
    // ---------------------------------------------------------------------------------
    const [vatChecked, setVatChecked] = useState<boolean>(false);
    const handleVat = (event: any) => {
        setIsAutoCompleteActivated(true); // 자동 입력 활성화
        setVatChecked(event.target.checked);
    };

    useEffect(() => {
        setValue("vat_include", vatChecked);
    }, [vatChecked]);

    useEffect(() => {
        if (isAutoCompleteActivated) {
            vatChecked
                ? setValue("estimate_price", getValues("total_price_vat"))
                : setValue("estimate_price", getValues("total_price"));
        } else {
            // 견적 수정
            if (originalEstimateData) {
                setValue(
                    "estimate_price",
                    numberToMoney(
                        moneyToNumber(
                            originalEstimateData?.estimate_by_pk
                                .estimate_price || "0"
                        )
                    )
                );
            }
            // 견적 불러오기
            if (otherEstimateData) {
                setValue(
                    "estimate_price",
                    numberToMoney(
                        moneyToNumber(
                            otherEstimateData?.estimate_by_pk.estimate_price ||
                                "0"
                        )
                    )
                );
            }
        }
    }, [vatChecked, watch("total_price"), watch("total_price_vat")]);

    // ---------------------------------------------------------------------------------
    // TAIL 옵션
    // ---------------------------------------------------------------------------------
    const { data: tailData } = useQuery(
        ["get repair tail options for repair estimate"],
        () =>
            tailService.getAllTailByType({
                where: {
                    type_code: { _eq: repairCode!.common_code[0].code },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: !!repairCode?.common_code[0].code,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    useEffect(() => {
        if (getValues("selected_tail.value") !== "default") {
            const contents = tailData?.tail.filter(
                tail => tail.id === getValues("selected_tail.value")
            )[0]?.contents;
            if (!!contents) {
                setValue("tail", contents);
            }
        }
    }, [watch("selected_tail")]);

    // ---------------------------------------------------------------------------------
    // 세부내역 TABLE
    // ---------------------------------------------------------------------------------
    // COMMON CODE ( 라이선스 )
    const { data: licenseCode } = useQuery(["get license type code"], () =>
        codeService.getCommonCode({
            where: {
                category: { _eq: CodeCategory.COMMON_TYPE },
                value: { _eq: CommonType.LICENSE },
            },
        })
    );

    // 유지보수 제품 옵션 ( TYPE : 라이선스 / 기술지원 )
    // > 라이선스 견적과 동일
    const { data: products } = useQuery(
        ["get license type products by type for repair estimate"],
        () =>
            productService.getProducts({
                where: {
                    type_code: {
                        _in: [licenseCode?.common_code[0].code!],
                    },
                    deleted_at: { _is_null: true },
                },
                order_by: [
                    {
                        created_at: IOrder_By.Asc,
                    },
                ],
            }),
        {
            enabled: !!licenseCode?.common_code[0].code,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );
    // 용도 & Class 옵션 조회
    const { data: productPurpose } = useQuery(
        ["get product purpose for repair estimate"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.PRODUCT_PURPOSE },
                    is_used: { _eq: true },
                },
            }),
        {
            enabled: true,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );
    const { data: productClass } = useQuery(
        ["get product class for repair estimate"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.PRODUCT_CLASS },
                    is_used: { _eq: true },
                },
            }),
        {
            enabled: true,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );

    // CUSTOM COLUMNS
    const columns: GridColDef[] = [
        {
            field: EstimateDetailsOptionTypeEnum.LICENSE_PROJECT_NAME,
            headerName: "사업명",
            width: 200,
            editable: true,
        },
        {
            field: EstimateDetailsOptionTypeEnum.YEAR,
            headerName: "도입년도",
            width: 100,
            type: "date",
            valueFormatter({ id, value }) {
                return !!value ? dayjs(value).format("YYYY년") : value;
            },
            valueSetter(params) {
                const { value, row } = params;
                const formattedDate = dayjs(value).format(
                    "YYYY-MM-DDTHH:mm:ss.SSSZ"
                );
                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.YEAR]: formattedDate,
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.TYPE,
            headerName: "구분",
            width: 180,
            editable: false,
        },
        {
            field: EstimateDetailsOptionTypeEnum.PURPOSE,
            headerName: "용도",
            width: 160,
            type: "singleSelect",
            valueOptions: [
                "선택해주세요",
                ...(productPurpose?.common_code?.map(item => item.value) ?? []),
            ],
            valueSetter(params) {
                const { value, row } = params;

                const productClass = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.CLASS
                );
                const product = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.PRODUCT
                );
                const productOptions =
                    products?.product
                        .filter(
                            ele =>
                                ele?.purpose.value === value &&
                                ele?.class.value === productClass
                        )
                        .map(product => product?.name) || [];

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.PURPOSE]: value,
                    [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                        productOptions.includes(product)
                            ? product.type.value
                            : "",
                    [EstimateDetailsOptionTypeEnum.PRODUCT]:
                        productOptions.includes(product)
                            ? product
                            : "선택해주세요",
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.CLASS,
            headerName: "Class",
            width: 160,
            type: "singleSelect",
            valueOptions: [
                "선택해주세요",
                ...(productClass?.common_code?.map(item => item.value) ?? []),
            ],
            valueSetter(params) {
                const { value, row } = params;

                const purpose = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.PURPOSE
                );
                const product = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.PRODUCT
                );
                const productOptions =
                    products?.product
                        .filter(
                            ele =>
                                ele?.purpose.value === purpose &&
                                ele?.class.value === value
                        )
                        .map(product => product?.name) || [];

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.CLASS]: value,
                    [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                        productOptions.includes(product)
                            ? product.type.value
                            : "",
                    [EstimateDetailsOptionTypeEnum.PRODUCT]:
                        productOptions.includes(product)
                            ? product
                            : "선택해주세요",
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.PRODUCT,
            headerName: "품목",
            width: 240,
            type: "singleSelect",
            valueOptions: params => {
                const { id } = params.row;
                const purpose = detailsApiRef.current.getCellValue(
                    id,
                    EstimateDetailsOptionTypeEnum.PURPOSE
                );
                const productClass = detailsApiRef.current.getCellValue(
                    id,
                    EstimateDetailsOptionTypeEnum.CLASS
                );
                return [
                    "선택해주세요",
                    ...(products?.product
                        .filter(
                            ele =>
                                ele?.purpose.value === purpose &&
                                ele?.class.value === productClass
                        )
                        .map(product => product!.name) || []),
                ];
            },
            valueSetter(params) {
                const { value, row } = params;

                const product = products?.product.find(
                    item => item?.name === value
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.PRODUCT]: value,
                    [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                        product?.type.value,
                    [EstimateDetailsOptionTypeEnum.UNIT]: product?.unit.value,
                    [EstimateDetailsOptionTypeEnum.PRICE]: moneyToNumber(
                        product?.price || "0"
                    ),
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.DETAILS,
            headerName: "세부내역",
            width: 280,
            type: "string",
            renderEditCell: params => <EditTextareaCell {...params} />,
        },
        {
            field: EstimateDetailsOptionTypeEnum.UNIT,
            headerName: "단위",
            width: 160,
        },
        {
            field: EstimateDetailsOptionTypeEnum.AMOUNT,
            headerName: "수량",
            width: 120,
            type: "number",
        },
        {
            field: EstimateDetailsOptionTypeEnum.PRICE,
            headerName: "단가",
            width: 200,
            type: "number",
            renderEditCell: params => <IntOnlyEditInputCell {...params} />,
            valueFormatter({ id, value }) {
                return !!value ? numberToMoney(value) : value;
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.SUPPLY_PRICE,
            headerName: "공급금액",
            width: 200,
            type: "number",
            renderEditCell: params => <IntOnlyEditInputCell {...params} />,
            valueFormatter({ id, value }) {
                return !!value ? numberToMoney(value) : value;
            },
            valueSetter(params) {
                const { value, row } = params;

                // 유지보수 요율 ( null 일 경우, 기본 15% 적용)
                const repair_rate =
                    projectOptions?.project.find(
                        ele => ele.id === getValues("project_id.value")
                    )?.repair_rate || 15;
                // 기간 ( 개월 )
                const period = dayjs(
                    row[EstimateDetailsOptionTypeEnum.END_DATE]
                ).diff(
                    dayjs(row[EstimateDetailsOptionTypeEnum.START_DATE]),
                    "month"
                );

                // 월유지보수 금액 ( 요율 적용 & 할인율 적용 )
                const monthly_repair_price = !!getValues("discount_rate")
                    ? Math.floor(
                          ((value * (repair_rate / 100)) / 12) *
                              (1 - getValues("discount_rate") / 100)
                      )
                    : Math.floor((value * (repair_rate / 100)) / 12);

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: value,
                    [EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE]:
                        monthly_repair_price,
                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                        monthly_repair_price * period,
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE,
            headerName: "월유지보수금액",
            width: 200,
            type: "number",
            renderEditCell: params => <IntOnlyEditInputCell {...params} />,
            valueFormatter({ id, value }) {
                return !!value ? numberToMoney(value) : value;
            },
            valueSetter(params) {
                const { value, row } = params;

                // 기간 ( 개월 )
                const period = dayjs(
                    row[EstimateDetailsOptionTypeEnum.END_DATE]
                ).diff(
                    dayjs(row[EstimateDetailsOptionTypeEnum.START_DATE]),
                    "month"
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE]: value,
                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                        value * period,
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE,
            headerName: "총유지보수금액",
            width: 200,
            type: "number",
            renderEditCell: params => <IntOnlyEditInputCell {...params} />,
            valueFormatter({ id, value }) {
                return !!value ? numberToMoney(value) : value;
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.START_DATE,
            headerName: "시작일",
            width: 160,
            type: "date",
            valueFormatter({ id, value }) {
                return !!value
                    ? dayjs(value).format("YYYY년 MM월 DD일")
                    : value;
            },
            valueSetter(params) {
                const { value, row } = params;

                const formattedDate = dayjs(value).format(
                    "YYYY-MM-DDTHH:mm:ss.SSSZ"
                );

                const period = dayjs(
                    row[EstimateDetailsOptionTypeEnum.END_DATE]
                ).diff(dayjs(formattedDate), "month");

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.START_DATE]: formattedDate,
                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                        (1 - getValues("discount_rate") / 100) *
                        row[
                            EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE
                        ] *
                        period,
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.END_DATE,
            headerName: "종료일",
            width: 160,
            type: "date",
            valueFormatter({ id, value }) {
                return !!value
                    ? dayjs(value).format("YYYY년 MM월 DD일")
                    : value;
            },
            valueSetter(params) {
                const { value, row } = params;

                const formattedDate = dayjs(value).format(
                    "YYYY-MM-DDTHH:mm:ss.SSSZ"
                );

                const period = dayjs(formattedDate).diff(
                    dayjs(row[EstimateDetailsOptionTypeEnum.START_DATE]),
                    "month"
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.END_DATE]: formattedDate,
                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                        (1 - getValues("discount_rate") / 100) *
                        row[
                            EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE
                        ] *
                        period,
                };
            },
        },
    ];

    const handleClickAddRow = () => {
        setIsAutoCompleteActivated(true); // 자동 입력 활성화

        const selectedRepairProject = projectOptions?.project.find(
            ele => ele.id === getValues("project_id.value")
        );

        if (selectedRepairProject) {
            const newRow: IRepairEstimateForm.IDetailForm = {
                id: rows.length + 1,
                type: "JOB-PaSS 유지보수",
                purpose: "선택해주세요",
                class: "선택해주세요",
                product: "선택해주세요",
                amount: 1,
                price: 0,
                supply_price: 0,
                monthly_repair_price: 0,
                total_repair_price: 0,
                start_date: selectedRepairProject?.start_date,
                end_date: selectedRepairProject?.end_date,
            };

            // setRows(prev => [...prev, newRow]);

            setRows(prev => {
                const updatedRows = [...prev, newRow];
                return updatedRows.sort((a, b) => a.id - b.id);
            });
        } else {
            alert("유지보수 사업을 선택해주세요.");
        }
    };

    const handleClickDeleteRow = () => {
        setIsAutoCompleteActivated(true); // 자동 입력 활성화
        const allRowIds = detailsApiRef.current.getAllRowIds();
        const selectedRowIds: GridRowId[] = Array.from(
            detailsApiRef.current.getSelectedRows().keys()
        );
        detailsApiRef.current.setRowSelectionModel([]);
        const newRows = allRowIds
            .filter(id => !selectedRowIds.includes(id))
            .map((id, idx) => {
                const row = detailsApiRef.current.getRow(id);
                return {
                    ...row,
                    id: idx + 1,
                };
            });
        setRows(newRows);

        // 추가된 라이선스 도입 사업 RECOIL 업데이트
        const contractIds = newRows.map(ele => ele.license_contract_id);
        // console.log(contractIds);
        // setRepairDetailsEstimateModal(prev => ({
        //     ...prev,
        //     appliedLicenseContractId: contractIds,
        // }));

        setRepairDetailsEstimateModal(prev => ({
            ...prev,
            appliedLicenseContractId: contractIds,
        }));
    };

    // -------------------------------------------------------------------------------
    // 유지보수 사업 선택시, 이미 등록된 라이선스 계약 품목 불러오기
    // & 모달에서 선택한 라이선스 도입 사업의 제품 목록 불러오기
    // -------------------------------------------------------------------------------
    const { refetch: fetchFinalEstimateDetailsBySelectedLicenseContracts } =
        useQuery(
            [
                "get products of final estimates by selected license contracts",
                repairDetailsEstimateModal.selectedRepairProjectId,
                repairDetailsEstimateModal.selectedLicenseContractId,
            ],
            () =>
                estimateService.getFinalEstimateDetailsBySelectedLicenseContracts(
                    {
                        project_contract_where: {
                            project: {
                                id: {
                                    _eq: repairDetailsEstimateModal.selectedRepairProjectId,
                                },
                            },
                        },
                        project_where: {
                            id: {
                                _eq: repairDetailsEstimateModal.selectedRepairProjectId,
                            },
                        },
                        esitmate_where: {
                            is_final: { _eq: true },
                            project:
                                repairDetailsEstimateModal.selectedLicenseContractId
                                    ? {
                                          contracts: {
                                              id: {
                                                  _in: repairDetailsEstimateModal.selectedLicenseContractId,
                                              },
                                          },
                                      }
                                    : {},
                        },
                        contract_where: {
                            deleted_at: { _is_null: true },
                        },
                        contract_order_by: [
                            {
                                contract_period_start: IOrder_By.Asc,
                            },
                        ],
                    }
                ),
            {
                enabled: false,
                retry: false,
                cacheTime: 0,
                staleTime: 0,
                keepPreviousData: false,
                onSuccess(data) {
                    const originalRows = rows.filter(
                        ele =>
                            (repairDetailsEstimateModal.appliedLicenseContractId?.includes(
                                ele.license_contract_id
                            ) &&
                                repairDetailsEstimateModal.selectedLicenseContractId?.includes(
                                    ele.license_contract_id
                                )) ||
                            !ele.license_contract_id
                    );

                    const newRows = data.details
                        .filter(
                            ele =>
                                !repairDetailsEstimateModal.appliedLicenseContractId?.includes(
                                    ele.license_contract_id
                                )
                        )
                        .map(
                            (
                                {
                                    license_project_id,
                                    license_project_name,
                                    license_contract_id,
                                    contract_period_start,
                                    contract_period_end,
                                    type,
                                    purpose,
                                    class: productClass,
                                    product_type,
                                    product,
                                    details,
                                    unit,
                                    amount,
                                    price,
                                    standard_price,
                                    supply_price,
                                    note,
                                    repair_project_start_date,
                                    repair_project_end_date,
                                },
                                idx
                            ) => {
                                // 유지보수 요율 ( null 일 경우 , 15% 적용 )
                                const repair_rate =
                                    projectOptions?.project.find(
                                        ele =>
                                            ele.id ===
                                            getValues("project_id.value")
                                    )?.repair_rate || 15;

                                // 월유지보수금액 ( 요율 적용 & 할인율 적용 )
                                const monthly_repair_price = Math.floor(
                                    ((moneyToNumber(supply_price) *
                                        (repair_rate / 100)) /
                                        12) *
                                        (1 - getValues("discount_rate") / 100)
                                );

                                // 기간 ( 개월 )
                                const period = dayjs(
                                    repair_project_end_date
                                ).diff(
                                    dayjs(repair_project_start_date),
                                    "month"
                                );
                                return {
                                    id: rows.length + idx + 1,
                                    license_project_id,
                                    [EstimateDetailsOptionTypeEnum.LICENSE_CONTRACT_ID]:
                                        license_contract_id,
                                    [EstimateDetailsOptionTypeEnum.LICENSE_PROJECT_NAME]:
                                        license_project_name,
                                    [EstimateDetailsOptionTypeEnum.YEAR]:
                                        contract_period_start,
                                    [EstimateDetailsOptionTypeEnum.TYPE]:
                                        "JOB-PaSS 유지보수",
                                    [EstimateDetailsOptionTypeEnum.PURPOSE]:
                                        purpose,
                                    [EstimateDetailsOptionTypeEnum.CLASS]:
                                        productClass,
                                    [EstimateDetailsOptionTypeEnum.PRODUCT_TYPE]:
                                        product_type,
                                    [EstimateDetailsOptionTypeEnum.PRODUCT]:
                                        product,
                                    [EstimateDetailsOptionTypeEnum.DETAILS]:
                                        details,
                                    [EstimateDetailsOptionTypeEnum.UNIT]: unit,
                                    [EstimateDetailsOptionTypeEnum.AMOUNT]:
                                        amount,
                                    [EstimateDetailsOptionTypeEnum.PRICE]:
                                        moneyToNumber(price),
                                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                                        moneyToNumber(supply_price),
                                    [EstimateDetailsOptionTypeEnum.MONTHLY_REPAIR_PRICE]:
                                        monthly_repair_price,
                                    [EstimateDetailsOptionTypeEnum.TOTAL_REPAIR_PRICE]:
                                        monthly_repair_price * period,
                                    [EstimateDetailsOptionTypeEnum.START_DATE]:
                                        repair_project_start_date,
                                    [EstimateDetailsOptionTypeEnum.END_DATE]:
                                        repair_project_end_date,
                                    // [EstimateDetailsOptionTypeEnum.NOTE]: note,
                                };
                            }
                        );
                    // setRows(newRows);
                    setRows(prev => {
                        // const updatedRows = [...prev, ...newRows];
                        const updatedRows = [...originalRows, ...newRows];
                        return updatedRows.sort((a, b) => a.id - b.id);
                    });

                    // const appliedContracts =
                    //     repairDetailsEstimateModal.appliedLicenseContractId ||
                    //     [];

                    const newAppliedLicenseContracts = [
                        ...(repairDetailsEstimateModal.selectedLicenseContractId ||
                            []),
                        ...newRows
                            .map(ele => ele.license_contract_id)
                            .filter(
                                (value, index, self) =>
                                    self.indexOf(value) === index
                            ),
                    ];
                    // console.log(">>> originalRows");
                    // console.log(originalRows);
                    // console.log(">>> newRows");
                    // console.log(newRows);
                    // console.log(">>> newAppliedLicenseContracts");
                    // console.log(newAppliedLicenseContracts);
                    setRepairDetailsEstimateModal(prev => ({
                        ...prev,
                        appliedLicenseContractId: [
                            ...newAppliedLicenseContracts.filter(
                                (value, index, self) =>
                                    self.indexOf(value) === index
                            ),
                        ],
                    }));
                },
            }
        );

    useEffect(() => {
        if (
            isAutoCompleteActivated &&
            !!repairDetailsEstimateModal.selectedRepairProjectId
        ) {
            fetchFinalEstimateDetailsBySelectedLicenseContracts();
        }
    }, [
        repairDetailsEstimateModal.selectedRepairProjectId,
        repairDetailsEstimateModal.selectedLicenseContractId,
    ]);

    useEffect(() => {
        if (
            isAutoCompleteActivated &&
            !!getValues("selected_client.value") &&
            getValues("selected_client.value") !== "default" &&
            !!getValues("project_id.value") &&
            getValues("project_id.value") !== "default"
        ) {
            setRepairDetailsEstimateModal(prev => ({
                ...prev,
                selectedClientId: parseInt(
                    `${getValues("selected_client.value")}`
                ),
                selectedRepairProjectId: parseInt(
                    `${getValues("project_id.value")}`
                ),
                registeredLicenseContractId: undefined,
                selectedLicenseContractId: undefined,
                appliedLicenseContractId: undefined,
            }));
        }
    }, [watch("project_id")]);

    // useEffect(() => {
    //     console.log(">>>>>>>> repairDetailsEstimateModal ( PAGE )");
    //     console.log(repairDetailsEstimateModal);
    // }, [repairDetailsEstimateModal]);

    // [ 라이선스 도입 추가 ] 모달 열기
    const onClickOpenRepairEstimateDetailModal = () => {
        if (
            repairDetailsEstimateModal.selectedClientId &&
            repairDetailsEstimateModal.selectedRepairProjectId
        ) {
            setRepairDetailsEstimateModal(prev => ({
                ...prev,
                isOpen: true,
            }));
            setIsAutoCompleteActivated(true);
        } else {
            alert("고객사와 유지보수 사업을 선택해주세요.");
        }
    };

    return (
        <VRepairEstimateForm
            {...props}
            vatChecked={vatChecked}
            handleVat={handleVat}
            specialDiscountChecked={specialDiscountChecked}
            handleSpecialDiscount={handleSpecialDiscount}
            clientOptions={
                clientData
                    ?.filter(
                        company => company?.type.value === CompanyType.CLIENT
                    )
                    .map(client => ({
                        label: client!.name,
                        value: client!.id,
                    })) || []
            }
            projectOptions={
                projectOptions?.project.map(project => ({
                    label: project!.name,
                    value: project!.id,
                })) || []
            }
            employeeOptions={
                employeeOpions?.project_employee.map(
                    ele => ele!.employee.name
                ) || []
            }
            headEmployeeOptions={
                headEmployeeOpions?.project_employee
                    .map(ele => ({
                        label: ele!.employee.name,
                        value: ele!.employee.id,
                    }))
                    .filter(
                        (ele, index, self) =>
                            index === self.findIndex(t => t.value === ele.value)
                    ) || []
            }
            tailOptions={
                tailData?.tail.map(tail => ({
                    label: tail!.name,
                    value: tail!.id,
                })) || []
            }
            columns={columns.map(col => ({
                ...col,
                editable: col.editable ?? true,
                sortable: true,
                align: "center",
                headerAlign: "center",
            }))}
            detailsApiRef={detailsApiRef}
            handleClickAddRow={handleClickAddRow}
            handleClickDeleteRow={handleClickDeleteRow}
            onCellEditStart={onCellEditStart}
            onClickOpenRepairEstimateDetailModal={
                onClickOpenRepairEstimateDetailModal
            }
        />
    );
};

export default RepairEstimateForm;
