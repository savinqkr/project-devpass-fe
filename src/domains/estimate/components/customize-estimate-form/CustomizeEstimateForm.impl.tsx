import codeService from "@common/services/code/code.service";
import companyService from "@domains/company/services/company.service";
import estimateService from "@domains/estimate/services/estimate.service";
import productService from "@domains/product/services/product.service";
import projectService from "@domains/project/service/project.service";
import tailService from "@domains/tail/services/tail.service";
import { EstimateDetailsOptionTypeEnum } from "@enums";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import moneyToNumber from "@utils/moneyToNumber";
import numberToMoney from "@utils/numberToMoney";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CodeCategory } from "src/enums/code_category.enum";
import { CompanyType } from "src/enums/company_type.enum";
import { ICustomizeEstimateForm } from "./CustomizeEstimateForm.interface";
import VTechSupportEstimateForm from "./CustomizeEstimateForm.view";
import { useRecoilState, useResetRecoilState } from "recoil";
import estimateModalState from "@recoils/estimate-modal-state.atom";
import { EditTextareaCell, IntOnlyEditInputCell } from "@common/components";
import { CommonType } from "src/enums/common_type.enum";
import { IOrder_By } from "src/codegen/graphql";

const CustomizeEstimateForm: React.FC<
    ICustomizeEstimateForm.IProps
> = props => {
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

    // COMMON CODE ( 커스터마이징 개발 )
    const { data: customizeDevCode } = useQuery(
        ["get customizing develop type code"],
        () =>
            codeService.getCommonCode({
                where: {
                    category: { _eq: CodeCategory.COMMON_TYPE },
                    value: { _eq: CommonType.CUSTOMIZE },
                },
            })
    );

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
        ["get selected estimate by pk for customize dev estimate"],
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
                            type: row.type,
                            purpose: row.purpose,
                            class: row.class,
                            product_type: row.product_type,
                            product: row.product,
                            details: row.details,
                            unit: row.unit,
                            amount: row.amount,
                            price: moneyToNumber(row.price),
                            standard_price: moneyToNumber(
                                row.standard_price || ""
                            ),
                            supply_price: moneyToNumber(row.supply_price),
                            note: row.note,
                        }));
                    setRows(initialRows);

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
        ["get client options for customize dev estimate"],
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
            "get project options by selected client for customize dev estimate",
            watch("selected_client"),
            isAutoCompleteActivated,
        ],
        () =>
            projectService.getProjectByConditions({
                where: {
                    type: {
                        code: {
                            _eq: customizeDevCode?.common_code[0].code || 0,
                        },
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
                !!customizeDevCode?.common_code[0].code &&
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
            "get employee options by selected project for customize dev estimate",
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
    // ---------------------------------------------------------------------------------
    useEffect(() => {
        if (isAutoCompleteActivated) {
            const updatedRows = rows.map(row => ({
                ...row,
                [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]:
                    (1 - getValues("discount_rate") / 100) *
                    row[EstimateDetailsOptionTypeEnum.STANDARD_PRICE],
            }));
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
                if (!!row[EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]) {
                    total_price +=
                        row[EstimateDetailsOptionTypeEnum.SUPPLY_PRICE];
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
        ["get customize dev tail options for customize dev estimate"],
        () =>
            tailService.getAllTailByType({
                where: {
                    type_code: { _eq: customizeDevCode!.common_code[0].code },
                    deleted_at: { _is_null: true },
                },
            }),
        {
            enabled: !!customizeDevCode?.common_code[0].code,
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
    // 커스터마이징 제품 옵션
    const { data: products } = useQuery(
        ["get products by type for customize dev estimate"],
        () =>
            productService.getProducts({
                where: {
                    type_code: { _eq: customizeDevCode?.common_code[0].code! },
                    deleted_at: { _is_null: true },
                },
                order_by: [
                    {
                        created_at: IOrder_By.Asc,
                    },
                ],
            }),
        {
            enabled: !!customizeDevCode?.common_code[0].code,
            retry: true,
            cacheTime: 0,
            staleTime: 0,
            keepPreviousData: false,
        }
    );
    // 용도 & Class 옵션 조회
    const { data: productPurpose } = useQuery(
        ["get product purpose for customize dev estimate"],
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
        ["get product class for customize dev estimate"],
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
                        ?.filter(
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
                    [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                        1 * moneyToNumber(product?.price || "0"),
                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: !!getValues(
                        "discount_rate"
                    )
                        ? (1 - getValues("discount_rate") / 100) *
                          1 *
                          moneyToNumber(product?.price || "0")
                        : 1 * moneyToNumber(product?.price || "0"),
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
            valueSetter(params) {
                const { value, row } = params;

                const price = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.PRICE
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.AMOUNT]: value,
                    [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                        value * price,
                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: !!getValues(
                        "discount_rate"
                    )
                        ? (1 - getValues("discount_rate") / 100) * value * price
                        : value * price,
                };
            },
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
            valueSetter(params) {
                const { value, row } = params;

                const amount = detailsApiRef.current.getCellValue(
                    row.id,
                    EstimateDetailsOptionTypeEnum.AMOUNT
                );

                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.PRICE]: value,
                    [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]:
                        value * amount,
                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: !!getValues(
                        "discount_rate"
                    )
                        ? (1 - getValues("discount_rate") / 100) *
                          value *
                          amount
                        : value * amount,
                };
            },
        },
        {
            field: EstimateDetailsOptionTypeEnum.STANDARD_PRICE,
            headerName: "기준금액",
            width: 200,
            type: "number",
            renderEditCell: params => <IntOnlyEditInputCell {...params} />,
            valueFormatter({ id, value }) {
                return !!value ? numberToMoney(value) : value;
            },
            valueSetter(params) {
                const { value, row } = params;
                return {
                    ...row,
                    [EstimateDetailsOptionTypeEnum.STANDARD_PRICE]: value,
                    [EstimateDetailsOptionTypeEnum.SUPPLY_PRICE]: !!getValues(
                        "discount_rate"
                    )
                        ? (1 - getValues("discount_rate") / 100) * value
                        : value,
                };
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
        },
        {
            field: EstimateDetailsOptionTypeEnum.NOTE,
            headerName: "비고",
            width: 280,
            type: "string",
            renderEditCell: params => <EditTextareaCell {...params} />,
        },
    ];

    const handleClickAddRow = () => {
        setIsAutoCompleteActivated(true); // 자동 입력 활성화
        const newRow: ICustomizeEstimateForm.IDetailForm = {
            id: rows.length + 1,
            type: "JOB-PaSS 커스터마이징 개발",
            purpose: "선택해주세요",
            class: "선택해주세요",
            product: "선택해주세요",
            amount: 1,
            price: 0,
            standard_price: 0,
            supply_price: 0,
        };
        // setRows(prev => [...prev, newRow]);
        setRows(prev => {
            const updatedRows = [...prev, newRow];
            return updatedRows.sort((a, b) => a.id - b.id);
        });
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
    };

    return (
        <VTechSupportEstimateForm
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
        />
    );
};

export default CustomizeEstimateForm;
