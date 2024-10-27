export const toKst = (time: Date) => {
  time.setHours(time.getHours() + 9);
  return time;
};

export const formatDateUTC = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

export const stringToUTC = (timeString: string) => {
  const localDate = new Date(timeString);
  return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
};

export const getIsOngoing = (
  isInServerSide: boolean,
  endTime: string | null
) => {
  const now = new Date();
  if (!endTime) {
    return true;
  }
  if (isInServerSide) {
    if (now < new Date(endTime)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (now < stringToUTC(endTime)) {
      return true;
    } else {
      return false;
    }
  }
};

export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
};
