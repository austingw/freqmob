import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(tz);

const formatDate = (date: string) => {
  return dayjs(dayjs().utc().format()).to(
    dayjs(date).utc().local().tz().format("YYYY-MM-DDTHH:mm:ss") + "Z",
  );
};

export default formatDate;
