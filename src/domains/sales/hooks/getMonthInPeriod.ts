import dayjs from "dayjs";

function getMonthsInPeriod(startDate: Date, endDate: Date) {
    let months = [];
    let currentDate = dayjs(startDate);

    while (
        currentDate.isBefore(dayjs(endDate)) ||
        currentDate.isSame(dayjs(endDate), "month")
    ) {
        months.push({
            year: currentDate.year(),
            month: currentDate.month() + 1,
        }); // month()는 0부터 시작하므로 +1
        currentDate = currentDate.add(1, "month");
    }

    return months;
}
export default getMonthsInPeriod;
