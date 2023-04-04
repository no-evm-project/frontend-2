import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "./styles.css";

import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

import { ChakraProvider, extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { DataProvider } from "@/contexts/DataProvider";
import { AppDataProvider } from "@/contexts/AppData";

import Header from "@/components/Header";
import theme from '../styles/chakra';
import { useRouter } from "next/router";


export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	return (
		<WalletSelectorContextProvider>
			<ChakraProvider theme={theme}>
				<DataProvider>
					<AppDataProvider>
						{router.pathname !== '/' && <Header/>}
						<Component {...pageProps} />
					</AppDataProvider>
				</DataProvider>
			</ChakraProvider>
		</WalletSelectorContextProvider>
	);
}
