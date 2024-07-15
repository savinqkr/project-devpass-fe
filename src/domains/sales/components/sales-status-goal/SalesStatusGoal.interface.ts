import { ProductType } from "@enums";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { ChartData, ChartOptions } from "chart.js";
import { Control } from "react-hook-form";

export namespace ISalesStatusGoal {
    export interface IProps {
        type: ProductType;
        year: number;
        goalRateData: number[];
        onChangeGoal: () => void;
    }
    export interface IVProps extends IProps {
        control: Control<IGoal>;
        isRegistered: boolean;
        onClickSetGoalBtn: () => void;
    }

    export interface IGoal {
        goal: string;
    }
}
