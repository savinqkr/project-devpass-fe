import { ReactNode } from "react";

export namespace IDetailInfoRow {
    export interface IProps {
        label: string;
        value?: any;
        children?: ReactNode;
        isMarkdown?: boolean; // markdown 입력 시 htmlParser를 사용해서 value가 아닌 children에 값을 넣어주시고, 해당 값을 true로 주세요.
        col?: number; // 해당 row가 차지하는 단 수 ex) 2로 작성 시 2단 높이로 생성 ( 기본 : 1 )
        isNote?: boolean; // 비고 여부 ( 기본 : false )
        tag?: ReactNode;
        adornment?: any; // value 우측에 표시되는 장식 ex) 123,456 원
    }
    export interface IVProps extends IProps {}
}
