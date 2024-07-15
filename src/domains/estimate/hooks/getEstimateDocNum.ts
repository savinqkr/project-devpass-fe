import dayjs from "dayjs";

const generateEstimateDocNum = (countData: number) => {
    const formattedNow = dayjs().format("YYYYMMDD");

    let count = countData ? countData : 0;
    const docNum = `D2T${formattedNow}-${(count + 1)
        .toString()
        .padStart(3, "0")}`;

    return docNum;
};

export default generateEstimateDocNum;
