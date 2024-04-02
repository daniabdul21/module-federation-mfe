// export const someUtils = (value: string) => {};

export const getBaseUrlByEnv = (
    dev_id: string,
    dev_tl: string,
    dev_sg: string,
    prestage: string,
    preploy: string,
    prod_id: string,
    prod_tl: string,
    prod_sg: string
  ) => {
    let url;
  
    // SET URL
    if (typeof window !== "undefined") {
      const isDev =
        window.location.hostname.includes("gym-master") &&
        !(
          window.location.hostname.includes("tl") ||
          window.location.hostname.includes("sg")
        );
      const isDev_tl =
        window.location.hostname.includes("gym-master") &&
        window.location.hostname.includes("tl");
      const isDev_sg =
        window.location.hostname.includes("gym-master") &&
        window.location.hostname.includes("sg");
      const isLocal = window.location.hostname.includes("localhost");
      const isPrestag = window.location.hostname.includes("addons.cms");
      const isPreploy = window.location.hostname.includes("addons.apps");
      const isProd_tl =
        window.location.hostname.includes("bricams") &&
        window.location.hostname.includes("tl");
      const isProd_sg =
        window.location.hostname.includes("bricams") &&
        window.location.hostname.includes("sg");
  
      if (isDev || isLocal) {
        url = dev_id;
      } else if (isDev_tl) {
        url = dev_tl;
      } else if (isDev_sg) {
        url = dev_sg;
      } else if (isPrestag) {
        url = prestage;
      } else if (isPreploy) {
        url = preploy;
      } else if (isProd_tl) {
        url = prod_tl;
      } else if (isProd_sg) {
        url = prod_sg;
      } else {
        url = prod_id;
      }
    }
  
    return url;
  };
  