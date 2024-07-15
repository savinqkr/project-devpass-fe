import { gql } from "graphql-request";

export namespace EditProjectMutation {
    export interface IVariable {
        [key: string]: any;
        id: number; // 사업 ID
        updated_by: number; // 수정한 유저 ID
        type_code: number; // 사업 구분
        name: string; // 사업명
        client_id: number; // 고객사 ID
        contractor_id?: number; // 계약사 ID
        start_date?: Date; // 사업 기간 ( 시작일 )
        end_date?: Date; // 사업 기간 ( 종료일 )
        optrans_date?: Date; // 운영 전환일
        inspect_date?: Date; // 검수일
        free_start_date?: Date; // 무상 기간 ( 시작일 )
        free_end_date?: Date; // 무상 기간 ( 종료일 )
        note?: string; // 비고
        participate_type?: string; // 사업 참여 형태
        partners?: Array<number>; // 파트너사
        employees: Array<{ employee_id: number; role_code: number }>; // 담당자
        // ( 아래는 유지보수 사업만 해당 )
        license_contracts?: Array<number>; // 라이선스 도입 사업 ID
        consultant_name?: string; // 엔지니어(컨설턴트)
        consultant_email?: string;
        consultant_contact?: string;
        consultant_phone?: string;
        inspect_cycle?: string; // 정기점검 주기
        inspect_method?: string; // 점검 방법
        inspect_option?: string; // 점검 옵션
        inspect_note?: string; // 점검 비고
        repair_rate?: number; // 요율
        repair_last_year_rate?: number; // 전년 요율
    }

    export interface IResponse {
        editProject: {
            project: {
                id: number;
                name: string;
                type: {
                    code: number;
                    value: string;
                    category: string;
                    is_used: boolean;
                };
                client: {
                    id: number;
                    name: string;
                    busi_no: string;
                };
                contractor?: {
                    id: number;
                    name: string;
                    busi_no: string;
                };
                start_date: string;
                end_date: string;
                optrans_date: string;
                inspect_date: string;
                free_start_date: string;
                free_end_date: string;
                participate_type: string;
                note?: string;
                consultant_name?: string;
                consultant_email?: string;
                consultant_contact?: string;
                consultant_phone?: string;
                inspect_cycle?: string;
                inspect_method?: string;
                inspect_option?: string;
                inspect_note?: string;
                repair_rate?: number;
                repair_last_year_rate?: number;
                sequence: number;
                created_at: string;
                created_by: number;
                updated_at: string;
                updated_by?: number;
                deleted_at?: string;
                deleted_by?: number;
            };
        };
    }

    export const Document = gql`
        mutation EditProjectMutation(
            $id: Int!
            $updated_by: Int!
            $type_code: Int!
            $name: String!
            $client_id: Int!
            $contractor_id: Int
            $start_date: DateTime
            $end_date: DateTime
            $optrans_date: DateTime
            $inspect_date: DateTime
            $free_start_date: DateTime
            $free_end_date: DateTime
            $participate_type: String
            $note: String
            $partners: [Int!]
            $employees: [EmployeeInput!]!
            $license_contracts: [Int!]
            $consultant_name: String
            $consultant_email: String
            $consultant_contact: String
            $consultant_phone: String
            $inspect_cycle: String
            $inspect_method: String
            $inspect_option: String
            $inspect_note: String
            $repair_rate: Float
            $repair_last_year_rate: Float
        ) {
            editProject(
                args: {
                    project_id: $id
                    updated_by: $updated_by
                    type_code: $type_code
                    name: $name
                    client_id: $client_id
                    contractor_id: $contractor_id
                    start_date: $start_date
                    end_date: $end_date
                    optrans_date: $optrans_date
                    inspect_date: $inspect_date
                    free_start_date: $free_start_date
                    free_end_date: $free_end_date
                    participate_type: $participate_type
                    note: $note
                    partners: $partners
                    employees: $employees
                    license_contracts: $license_contracts
                    consultant_name: $consultant_name
                    consultant_email: $consultant_email
                    consultant_contact: $consultant_contact
                    consultant_phone: $consultant_phone
                    inspect_cycle: $inspect_cycle
                    inspect_method: $inspect_method
                    inspect_option: $inspect_option
                    inspect_note: $inspect_note
                    repair_rate: $repair_rate
                    repair_last_year_rate: $repair_last_year_rate
                }
            ) {
                project {
                    id
                    name
                    type {
                        code
                        value
                        category
                        is_used
                    }
                    client {
                        id
                        name
                        busi_no
                    }
                    contractor {
                        id
                        name
                        busi_no
                    }
                    start_date
                    end_date
                    optrans_date
                    inspect_date
                    free_start_date
                    free_end_date
                    participate_type
                    note
                    consultant_name
                    consultant_email
                    consultant_contact
                    consultant_phone
                    inspect_cycle
                    inspect_method
                    inspect_option
                    inspect_note
                    repair_rate
                    repair_last_year_rate
                    sequence
                    created_at
                    created_by
                    updated_at
                    updated_by
                    deleted_at
                    deleted_by
                }
            }
        }
    `;
}
