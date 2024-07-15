import { css } from "@emotion/react";
import { IProductDetailTable } from "./ProductDetailTable.interface";
import DetailInfoRow from "@common/components/details-info-row/DetailInfoRow.impl";
import { Chip, CircularProgress, Divider, useMediaQuery } from "@mui/material";
import { ScreenType } from "@enums";
import { Colors } from "@configs/colors";

const VProductDetailTable: React.FC<IProductDetailTable.IVProps> = props => {
    const { productData } = props;
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    return productData ? (
        <div css={rootStyle(isMedium)}>
            <DetailInfoRow
                label="구분"
                value={productData?.type ?? ""}
                col={1}
                isNote={false}
            />
            <div className="twin-row">
                <DetailInfoRow
                    label="용도"
                    value={productData?.purpose ?? ""}
                    col={1}
                    isNote={false}
                />
                <DetailInfoRow
                    label="Class"
                    value={productData?.class ?? ""}
                    col={1}
                    isNote={false}
                />
            </div>
            <DetailInfoRow
                label="품목명"
                value={productData?.name ?? ""}
                col={1}
                isNote={false}
                tag={
                    productData?.deleted_at && (
                        <Chip
                            label="Deleted"
                            sx={{
                                height: 24,
                                padding: "0px 4px",
                                color: Colors.wildStrawberry,
                                fontSize: "12px",
                                backgroundColor: "rgba(255, 51, 99, 0.08)",
                                border: "none",
                            }}
                        />
                    )
                }
            />
            <DetailInfoRow
                label="단위"
                value={productData?.unit ?? ""}
                col={1}
                isNote={false}
            />
            <DetailInfoRow
                label="단가"
                value={productData?.price ?? ""}
                col={1}
                isNote={false}
                adornment={"원"}
            />
            {/* <DetailInfoRow
                label="에디션"
                value={productData?.edition ?? ""}
                col={1}
                isNote={false}
            /> */}
            <DetailInfoRow
                label="비고"
                value={productData?.note ?? "-"}
                col={1}
                isNote={true}
            />
            <Divider />
        </div>
    ) : (
        <div css={progressStyle}>
            <CircularProgress />
        </div>
    );
};

export default VProductDetailTable;

const rootStyle = (isMedium: boolean) => css`
    .twin-row {
        display: flex;
        flex-direction: ${isMedium ? "column" : "row"};
    }

    #btns {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }
`;

const progressStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;
