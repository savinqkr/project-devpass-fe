const PATH = {
    MAIN: "/",
    LOGIN: "/login",
    ADMIN: {
        MAIN: "/admin",
        COMPANY: {
            MAIN: "/admin/company",
            REGISTER: "/admin/company/register",
            EDIT: "/admin/company/edit",
        },
        USER: {
            MAIN: "/admin/user",
            REGISTER: "/admin/user/register",
            EDIT: "/admin/user/edit",
        },
        SETTINGS: {
            MAIN: "/admin/settings",
            ROLE: {
                MAIN: "/admin/settings/role",
                REGISTER: "/admin/settings/role/register",
                EDIT: "/admin/settings/role/edit",
            },
            TAIL: {
                MAIN: "/admin/settings/tail",
                REGISTER: "/admin/settings/tail/register",
                EDIT: "/admin/settings/tail/edit",
            },
            SEAL: {
                MAIN: "/admin/settings/seal",
                REGISTER: "/admin/settings/seal/register",
                EDIT: "/admin/settings/seal/edit",
            },
        },
    },
    CLIENT: {
        MAIN: "/client",
        COMPANY: {
            MAIN: "/client/company",
            REGISTER: "/client/company/register",
            EDIT: "/client/company/edit",
        },
        EMPLOYEE: {
            MAIN: "/client/employee",
            REGISTER: "/client/employee/register",
            EDIT: "/client/employee/edit",
        },
    },
    PRODUCT: {
        MAIN: "/product",
        REGISTER: "/product/register",
        EDIT: "/product/edit",
    },
    LICENSE: {
        MAIN: "/license",
        PROJECT: {
            MAIN: "/license/project",
            REGISTER: "/license/project/register",
            EDIT: "/license/project/edit",
        },
        ESTIMATE: {
            MAIN: "/license/estimate",
            REGISTER: "/license/estimate/register",
            EDIT: "/license/estimate/edit",
        },
        CONTRACT: {
            MAIN: "/license/contract",
            REGISTER: "/license/contract/register",
            EDIT: "/license/contract/edit",
        },
        SALES: {
            MAIN: "/license/sales",
            REGISTER: "/license/sales/register",
            EDIT: "/license/sales/edit",
            STATS: "/license/sales/stats",
        },
    },
    TECHSUPPORT: {
        MAIN: "/tech-support",
        PROJECT: {
            MAIN: "/tech-support/project",
            REGISTER: "/tech-support/project/register",
            EDIT: "/tech-support/project/edit",
        },
        ESTIMATE: {
            MAIN: "/tech-support/estimate",
            REGISTER: "/tech-support/estimate/register",
            EDIT: "/tech-support/estimate/edit",
        },
        CONTRACT: {
            MAIN: "/tech-support/contract",
            REGISTER: "/tech-support/contract/register",

            EDIT: "/tech-support/contract/edit",
        },
        SALES: {
            MAIN: "/tech-support/sales",
            REGISTER: "/tech-support/sales/register",
            EDIT: "/tech-support/sales/edit",
            STATS: "/tech-support/sales/stats",
        },
    },
    CUSTOMIZE: {
        MAIN: "/customize",
        PROJECT: {
            MAIN: "/customize/project",
            REGISTER: "/customize/project/register",
            EDIT: "/customize/project/edit",
        },
        ESTIMATE: {
            MAIN: "/customize/estimate",
            REGISTER: "/customize/estimate/register",
            EDIT: "/customize/estimate/edit",
        },
        CONTRACT: {
            MAIN: "/customize/contract",
            REGISTER: "/customize/contract/register",
            EDIT: "/customize/contract/edit",
        },
        SALES: {
            MAIN: "/customize/sales",
            REGISTER: "/customize/sales/register",
            EDIT: "/customize/sales/edit",
            STATS: "/customize/sales/stats",
        },
    },
    REPAIR: {
        MAIN: "/repair",
        PROJECT: {
            MAIN: "/repair/project",
            REGISTER: "/repair/project/register",
            EDIT: "/repair/project/edit",
        },
        ESTIMATE: {
            MAIN: "/repair/estimate",
            REGISTER: "/repair/estimate/register",
            EDIT: "/repair/estimate/edit",
        },
        CONTRACT: {
            MAIN: "/repair/contract",
            REGISTER: "/repair/contract/register",
            EDIT: "/repair/contract/edit",
            RENEWAL: "/repair/contract/renewal",
        },
        SALES: {
            MAIN: "/repair/sales",
            REGISTER: "/repair/sales/register",
            EDIT: "/repair/sales/edit",
            STATS: "/repair/sales/stats",
        },
        INSPECTION: {
            MAIN: "/repair/inspection",
            REGISTER: "/repair/inspection/register",
            EDIT: "/repair/inspection/edit",
        },
    },
};

export default PATH;
