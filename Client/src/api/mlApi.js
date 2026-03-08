 //import axios from "axios";

// export const mlApi = {

//   getRecommendation: async (data) => {

//     const res = await axios.post(
//       "http://localhost:8001/predict",
//       data
//     );

//     return res.data;
//   }

// };
// export async function mlApi({data}) {
//     const{
//             data:{data},
//         } = await axios({
//             method:"post",
//             url:"/api/user/recommendation",
//             data:{
//                 age,
//                 weight,
//                 systolic,
//                 diastolic,
//                 smoking,
//                 exercise
//             },
//         });
//         return data;
// }

import axios from "./axios";

async function getRecommendation(data) {

  const { data: response } = await axios({
    method: "post",
    url: "/api/user/recommendation",
    data
  });

  return response;
}

export const mlApi = {
  getRecommendation
};