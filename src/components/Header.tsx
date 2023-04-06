import {
	Box,
	Button,
	Collapse,
	Divider,
	Flex,
	IconButton,
	Progress,
	Stack,
	Text,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ConnectButton from "./ConnectButton";
import Image from "next/image";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";
import Link from "next/link";

export default function Header() {
	const router = useRouter();
	const { isOpen, onToggle } = useDisclosure();
	const { selector, modal, accounts, accountId } = useWalletSelector();
    const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const handleStart = (url: any) => {
			setLoading(true);
			setRefresh(Math.random());
		}
        const handleComplete = (url: any) => {
			setLoading(false);
			setRefresh(Math.random());
		}

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    }, [loading, refresh])

	return (
		<>
			<Flex
				justifyContent="space-between"
				align="center"
				bgColor={"background.600"}
				pl={6}
				pr={2}
			>
				<Flex
					flex={{ base: 1, md: "auto" }}
					ml={{ base: -2 }}
					display={{ base: "flex", md: "none" }}
				>
					<IconButton
						onClick={onToggle}
						icon={
							isOpen ? (
								<CloseIcon w={3} h={3} />
							) : (
								<HamburgerIcon w={5} h={5} />
							)
						}
						variant={"ghost"}
						aria-label={"Toggle Navigation"}
					/>
				</Flex>
				<Flex
					flex={{ base: 1 }}
					justify={{ base: "center", md: "start" }}
					align="center"
				>
					<Link href={"/"} as="/">
						<Box py={2}>
							<Image
								src="/x.png"
								width={"25"}
								height={"25"}
								alt={""}
							/>
						</Box>
					</Link>

					<Flex display={{ base: "none", md: "flex" }} ml={6}>
						<DesktopNav />
					</Flex>
				</Flex>

				<Stack
					flex={{ base: 1, md: 1 }}
					justify={"flex-end"}
					align="center"
					direction={"row"}
					display={{ base: "none", md: "flex" }}
				>
					<Flex
						display={{ sm: "none", md: "flex" }}
						align="center"
						justify={"flex-end"}
						gap={0}
					>
						<Flex gap={0}>
							{accountId && (
								<>
									<MenuOption
										href={"/portfolio"}
										title={"Portfolio"}
										size={"sm"}
									/>
								</>
							)}
							<ConnectButton />
						</Flex>
					</Flex>
				</Stack>
			</Flex>
			<Box >
			</Box>

			<Divider w={'100vw'}/>
			<Box mb={'-4px'}>
			{loading ? <Progress size="xs" bg={'transparent'} h={'4px'} colorScheme='background' isIndeterminate /> : <Box h={'4px'} bg='transparent'></Box>}
			</Box>

			<Collapse in={isOpen} animateOpacity>
				<MobileNav />
			</Collapse>
		</>
	);
}

const MenuOption = ({ href, title, disabled = false, size = "sm" }: any) => {
	const route = useRouter();
	const isPath = route.pathname.includes(href);

	return (
		<>
				<Link href={href} as={href}>
					<Button
						height={"45px"}
						_hover={{ bg: "background.400" }}
						bgColor={isPath ? "background.500" : "transparent"}
						borderX={isPath ? '1px': 0}
						borderLeftColor={"whiteAlpha.100"}
						borderRightColor={"whiteAlpha.100"}
						fontFamily='Space Grotesk'
						px={4}
						py={2}
						rounded={0}
						variant={"unstyled"}
						disabled={disabled}
						color={
							route.pathname.includes(href)
								? "primary.400"
								: "gray.200"
						}
						borderBottom="2px"
						borderColor={
							route.pathname.includes(href)
								? "primary"
								: "transparent"
						}
						// textUnderlineOffset="4px"
						size={size}
						fontSize="sm"
						// fontFamily={"Poppins"}
					>
						{title}
					</Button>
				</Link>
		</>
	);
};

const DividerStyle = {
	orientation: "vertical"
}

const DesktopNav = () => {
	return (
		<Flex align="center">
			{/* <Divider orientation='vertical'/> */}
			{/* <Divider orientation="vertical" /> */}
			<MenuOption href={"/spot"} title={"Spot"} />
			{/* <Divider orientation="vertical" /> */}
			<MenuOption href={"/swap"} title={"Swap"} disabled={true} />
			{/* <Divider orientation="vertical" /> */}
			<MenuOption href={"/perps"} title={"Perps"} disabled={true} />
			{/* <Divider orientation="vertical" /> */}

			{/* <Divider orientation='vertical'/> */}
			{/* <MenuOption href={'/lend'} title={'Money Market'} /> */}
			{/* <Divider orientation='vertical'/> */}
			{/* <MenuOption href={"/perps"} title={"Perps"} disabled={true} /> */}
			{/* <MenuOption href={'/'} title={'Options'} disabled={true} /> */}
		</Flex>
	);
};

const MobileNav = ({}: any) => {
	return (
		<Stack bg="background.700" p={4} display={{ md: "none" }}>
			<MenuOption href={"/spot"} title={"Spot"} />
			{/* <MenuOption href={'/lend'} title={'Money Market'} /> */}
			{/* <MenuOption href={"/margin"} title={"Margin"} disabled={true} /> */}
			{/* <MenuOption href={'/'} title={'Options'} disabled={true} /> */}
			{/* {isConnected && <MenuOption href={'/faucet'} title={'💰 Faucet'} />} */}
			<MenuOption href={"/portfolio"} title={"Portfolio"} />
			<Box width={"100%"}>
				<ConnectButton />
			</Box>
		</Stack>
	);
};

Header.defaultProps = {
	title: "zexe",
};
