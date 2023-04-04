import React from "react";
import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	InputRightAddon,
	Text,
	InputGroup,
	Input,
	InputLeftAddon,
	Box,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
	Button,
	Tooltip,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { isValidAndPositiveNS } from "@/utils";
import { tickToPrecision } from '../../utils';
import Big from "big.js";

export default function NumberInputWithSlider({
	onUpdate,
	max,
	value: _value,
	tick,
	color = "#3EE6C4",
	placeholder = "Enter Amount",
}: any) {
	const [value, setValue] = React.useState(0);
	const handleChange = (__value: any) => {
		setValue(__value);
		onUpdate(__value);
	};

	const labelStyles = {
		mt: "-4px",
		ml: "-1.5",
	};

	useEffect(() => {
		if (isValidAndPositiveNS(_value)) {
			setValue(_value);
		}
	});

	const boxStyle = (limit: number) => {
		let __value = (value * 100) / max;
		if (max == 0) {
			__value = 0;
		}

		return {
			h: 2,
			w: 2,
			borderRadius: 100,
			bgColor: __value > limit ? color : "background1",
			border: "1px solid",
			borderColor: __value > limit ? color : "gray.800",
		};
	};

	return (
		<Box>
			<InputGroup>
				<NumberInput
					width={"100%"}
					value={value}
					onChange={handleChange}
					precision={4}
					placeholder={placeholder}
					variant="filled"
					border={"1px"}
					borderColor={"gray.700"}
				>
					<NumberInputField rounded={0} placeholder={placeholder} />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</InputGroup>

			<Slider
				defaultValue={30}
				onChange={(e) => handleChange(Big(e).mul(max).div(100).toFixed(tickToPrecision(tick)))}
				value={max ? Big(value).mul(100).div(max).toNumber() : 0}
				focusThumbOnChange={false}
				mt={2}
				step={0.1}
				width="97%"
				ml={1.5}
			>
				<SliderMark value={0} {...labelStyles}>
					<Box {...boxStyle(0)}></Box>
				</SliderMark>
				<SliderMark value={25} {...labelStyles}>
					<Box {...boxStyle(25)}></Box>
				</SliderMark>
				<SliderMark value={50} {...labelStyles}>
					<Box {...boxStyle(50)}></Box>
				</SliderMark>
				<SliderMark value={75} {...labelStyles}>
					<Box {...boxStyle(75)}></Box>
				</SliderMark>
				<SliderMark value={100} {...labelStyles} opacity="1">
					<Box {...boxStyle(100)}></Box>
				</SliderMark>

				<SliderTrack>
					<SliderFilledTrack bgColor={color} />
				</SliderTrack>
				<Tooltip
					fontSize={"xs"}
					label={
						(isNaN((value * 100) / max)
							? 0
							: (value * 100) / max
						).toFixed(1) + "%"
					}
				>
					<SliderThumb bgColor={color} />
				</Tooltip>
			</Slider>
		</Box>
	);
}