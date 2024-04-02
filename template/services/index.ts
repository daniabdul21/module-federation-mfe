import customAxios from "./custom-axios";

export const someService = async (request: string) => {
  try {
    const res = await customAxios.post(`/some-endpoint`, request);
    if (res.status !== 200) throw new Error(res.data.message || "Server Error");
    return res.data;
  } catch (err) {
    console.error("some error", err);
  }
};
