import axios from "./axios";
import auth from "../lib/auth";

async function updateBP({ userId, systolic, diastolic }) {
  const { data } = await axios({
    method: "post",
    url: "/api/update/bp",
    // headers: {
    //   Authorization: `Bearer ${auth.token || ""}`,
    // },
    data: {
      userId,
      systolic,
      diastolic,
    },
  });

  return data;
}


export const bpApi = {
  updateBP,
  //recommendation,
};