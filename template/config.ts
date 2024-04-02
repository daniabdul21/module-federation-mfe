/* eslint-disable import/no-anonymous-default-export */
import { getBaseUrlByEnv } from "./utils";

export default {
  baseUrl: getBaseUrlByEnv(
    process.env.NEXT_PUBLIC_API_URL_DEV_ID as string,
    process.env.NEXT_PUBLIC_API_URL_DEV_TL as string,
    process.env.NEXT_PUBLIC_API_URL_DEV_SG as string,
    process.env.NEXT_PUBLIC_API_URL_PRESTAG as string,
    process.env.NEXT_PUBLIC_API_URL_PREPLOY as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_ID as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_TL as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_SG as string
  ),
  baseFederation: getBaseUrlByEnv(
    process.env.NEXT_PUBLIC_API_URL_DEV_ID as string,
    process.env.NEXT_PUBLIC_API_URL_DEV_TL as string,
    process.env.NEXT_PUBLIC_API_URL_DEV_SG as string,
    process.env.NEXT_PUBLIC_API_URL_PRESTAG as string,
    process.env.NEXT_PUBLIC_API_URL_PREPLOY as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_ID as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_TL as string,
    process.env.NEXT_PUBLIC_API_URL_PROD_SG as string
  )?.split("/api")[0],
};
