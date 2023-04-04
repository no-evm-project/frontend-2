import { Box, Button, Collapse, Flex, IconButton, Stack, Text, Tooltip, useDisclosure, Link } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import ConnectButton from "./ConnectButton";
import Image from 'next/image'
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useWalletSelector } from "@/contexts/WalletSelectorContext";

export default function Header() {
	const router = useRouter();
	const { isOpen, onToggle } = useDisclosure();
	const { selector, modal, accounts, accountId } = useWalletSelector();
	
	return (
		<>
			<Flex
				justifyContent="space-between"
				align="center"
				bgColor={"background2"}
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
					<Link href={"/"}>
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
							{
								accountId &&
								<MenuOption href={"/portfolio"} title={"Portfolio"} size={"sm"} />
							}
							<ConnectButton/>
							</Flex>
					</Flex>
				</Stack>
			</Flex>
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
				<Tooltip
					isDisabled={!disabled}
					hasArrow
					label="Coming Soon"
					bg="white"
					color={"gray.800"}
				>
					<Button
						height={"45px"}
						_hover={{ bg: "whiteAlpha.200" }}
						bgColor={isPath ? "whiteAlpha.50" : "transparent" }
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
						// textUnderlineOffset="4px"
						size={size}
						fontSize="sm"
						fontFamily={"Poppins"}
						onClick={() => {
							if (!disabled) {
								route.push(href);
							}
						}}
					>
						{title}
					</Button>
				</Tooltip>
			
		</>
	);
};

const DesktopNav = () => {
	return (
		<Flex align="center">
			{/* <Divider orientation='vertical'/> */}
			<MenuOption href={"/spot"} title={"Spot"} />
			<MenuOption href={"/swap"} title={"Swap"} disabled={true}/>
			<MenuOption href={"/perps"} title={"Perps"} disabled={true}/>

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
		<Stack bg="background1" p={4} display={{ md: "none" }}>
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
