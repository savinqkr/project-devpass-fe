import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import "../styles/globals.css";
import Layout from "@common/components/layout";
import { ThemeProvider } from "@emotion/react";
import theme from "@configs/theme";
import { RecoilEnv } from "recoil";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

// const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// dayjs.tz.setDefault(userTimezone);

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>DEV-PaSS</title>
                <meta name="descripttion" content="사내업무관리 시스템"></meta>
            </Head>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <RecoilRoot>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </RecoilRoot>
                </QueryClientProvider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
