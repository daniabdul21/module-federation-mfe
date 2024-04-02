import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";
import { NextPage } from "next";
import Head from "next/head";
import { AuthProvider, GlobalStoreProvider } from "@ordentco/addons-auth-provider";
import Script from "next/script";
import { appWithI18Next, useSyncLanguage } from "ni18n";
import { ni18nConfig } from "../ni18n.config";
import config from "tmp1/config";
import { init, loadRemote } from "@module-federation/runtime";
// import {APMInit} from "@addons/hooks"

init({
  name: "@qcash/global-component",
  remotes: [
    {
      name: "@qcash-global-component",
      entry: `${config.baseFederation}/global-component/_next/static/chunks/remoteEntry.js`,
      alias: "global-component",
    },
  ],
});

loadRemote("global-components/globals.css");

export type AnyObject = Record<string, unknown>;

export type NextPageWithLayout<P = AnyObject, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const locale = typeof window !== "undefined" && localStorage.getItem("locale");
  useSyncLanguage(locale as string);

  // useEffect(() => {
  //   APMInit
  // },[])

  return (
    <>
      <Head>
        <title>Qlola Cash Management</title>
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z8W4LEC390" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z8W4LEC390');
        `}
      </Script>
      <AuthProvider apiUrl={config.baseUrl as string}>
        <GlobalStoreProvider>{getLayout(<Component {...pageProps} />)}</GlobalStoreProvider>
      </AuthProvider>
    </>
  );
}

export default appWithI18Next(MyApp, ni18nConfig);
