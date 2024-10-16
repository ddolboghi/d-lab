"use server";

import schedule from "node-schedule";

export const connectData = async (
  endTime: Date,
  url: string,
  apikey: string
) => {
  const job = schedule.scheduleJob("*/3 * * * * *", async function () {
    if (new Date() >= endTime) {
      job.cancel();
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: apikey,
        },
      });

      //db에 저장하는 server action 실행하기
      console.log("Fetch successful:", response.status);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  });

  schedule.scheduleJob(endTime, function () {
    job.cancel();
    console.log("Scheduler ended at endTime");
  });
};
