import PATH from "./path";

const MENUS = [
    // 관리자
    {
        parent: "관리자",
        children: [
            {
                category: "회사",
                menus: [
                    {
                        name: "본사",
                        path: PATH.ADMIN.COMPANY.MAIN,
                    },
                ],
            },
            {
                category: "사용자",
                menus: [
                    {
                        name: "사용자",
                        path: PATH.ADMIN.USER.MAIN,
                    },
                ],
            },
            {
                category: "설정",
                menus: [
                    {
                        name: "역할 설정",
                        path: PATH.ADMIN.SETTINGS.ROLE.MAIN,
                    },
                    {
                        name: "TAIL 설정",
                        path: PATH.ADMIN.SETTINGS.TAIL.MAIN,
                    },
                    {
                        name: "인감 설정",
                        path: PATH.ADMIN.SETTINGS.SEAL.MAIN,
                    },
                ],
            },
        ],
    },
    // 거래처
    {
        parent: "거래처",
        children: [
            {
                category: "거래처",
                menus: [
                    {
                        name: "거래처",
                        path: PATH.CLIENT.COMPANY.MAIN,
                    },
                ],
            },
            {
                category: "담당자",
                menus: [
                    {
                        name: "담당자",
                        path: PATH.CLIENT.EMPLOYEE.MAIN,
                    },
                ],
            },
        ],
    },
    // 제품
    {
        parent: "제품",
        children: [
            {
                category: "제품",
                menus: [
                    {
                        name: "제품",
                        path: PATH.PRODUCT.MAIN,
                    },
                ],
            },
        ],
    },
    // 라이선스
    {
        parent: "라이선스",
        children: [
            {
                category: "라이선스 사업",
                menus: [
                    {
                        name: "사업",
                        path: PATH.LICENSE.PROJECT.MAIN,
                    },
                ],
            },
            {
                category: "라이선스 견적",
                menus: [
                    {
                        name: "견적",
                        path: PATH.LICENSE.ESTIMATE.MAIN,
                    },
                ],
            },
            {
                category: "라이선스 계약",
                menus: [
                    {
                        name: "계약",
                        path: PATH.LICENSE.CONTRACT.MAIN,
                    },
                ],
            },
            {
                category: "라이선스 검수 & 매출",
                menus: [
                    {
                        name: "검수 & 매출",
                        path: PATH.LICENSE.SALES.MAIN,
                    },
                    {
                        name: "매출 현황",
                        path: PATH.LICENSE.SALES.STATS,
                    },
                ],
            },
        ],
    },
    // 기술지원
    {
        parent: "기술지원",
        children: [
            {
                category: "기술지원 사업",
                menus: [
                    {
                        name: "사업",
                        path: PATH.TECHSUPPORT.PROJECT.MAIN,
                    },
                ],
            },
            {
                category: "기술지원 견적",
                menus: [
                    {
                        name: "견적",
                        path: PATH.TECHSUPPORT.ESTIMATE.MAIN,
                    },
                ],
            },
            {
                category: "기술지원 계약",
                menus: [
                    {
                        name: "계약",
                        path: PATH.TECHSUPPORT.CONTRACT.MAIN,
                    },
                ],
            },
            {
                category: "기술지원 검수 & 매출",
                menus: [
                    {
                        name: "검수 & 매출",
                        path: PATH.TECHSUPPORT.SALES.MAIN,
                    },
                    {
                        name: "매출 현황",
                        path: PATH.TECHSUPPORT.SALES.STATS,
                    },
                ],
            },
        ],
    },
    // 커스터마이징 개발
    {
        parent: "커스터마이징 개발",
        children: [
            {
                category: "커스터마이징 개발 사업",
                menus: [
                    {
                        name: "사업",
                        path: PATH.CUSTOMIZE.PROJECT.MAIN,
                    },
                ],
            },
            {
                category: "커스터마이징 개발 견적",
                menus: [
                    {
                        name: "견적",
                        path: PATH.CUSTOMIZE.ESTIMATE.MAIN,
                    },
                ],
            },
            {
                category: "커스터마이징 개발 계약",
                menus: [
                    {
                        name: "계약",
                        path: PATH.CUSTOMIZE.CONTRACT.MAIN,
                    },
                ],
            },
            {
                category: "커스터마이징 개발 검수 & 매출",
                menus: [
                    {
                        name: "검수 & 매출",
                        path: PATH.CUSTOMIZE.SALES.MAIN,
                    },
                    {
                        name: "매출 현황",
                        path: PATH.CUSTOMIZE.SALES.STATS,
                    },
                ],
            },
        ],
    },
    // 유지보수
    {
        parent: "유지보수",
        children: [
            {
                category: "유지보수 사업",
                menus: [
                    {
                        name: "사업",
                        path: PATH.REPAIR.PROJECT.MAIN,
                        // disabled: true,
                    },
                ],
            },
            {
                category: "유지보수 견적",
                menus: [
                    {
                        name: "견적",
                        path: PATH.REPAIR.ESTIMATE.MAIN,
                        // disabled: true,
                    },
                ],
            },
            {
                category: "유지보수 계약",
                menus: [
                    {
                        name: "계약",
                        path: PATH.REPAIR.CONTRACT.MAIN,
                        // disabled: true,
                    },
                    {
                        name: "유지보수 계약 대상 고객",
                        path: PATH.REPAIR.CONTRACT.RENEWAL,
                        // disabled: true,
                    },
                ],
            },
            {
                category: "유지보수 개발 검수 & 매출",
                menus: [
                    // {
                    //     name: "검수 & 매출",
                    //     path: PATH.REPAIR.SALES.MAIN,
                    // },
                    {
                        name: "매출 현황",
                        path: PATH.REPAIR.SALES.STATS,
                        // disabled: true,
                    },
                ],
            },
            {
                category: "정기점검",
                menus: [
                    {
                        name: "전체 정기점검",
                        path: PATH.REPAIR.INSPECTION.MAIN,
                        // disabled: true,
                    },
                ],
            },
        ],
    },
];
export default MENUS;
