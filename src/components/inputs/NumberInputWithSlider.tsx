import React from "react";
import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	InputGroup,
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

const SLIDER_COLOR = '#4F4860';

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

	const labelStyles = (limit: number) => {
		let __value = (value * 100) / max;
		if (max == 0) {
			__value = 0;
		}

		return {
			mt: "-5px",
			ml: "-1.5",
			zIndex: '1',
			opacity: '1',
			borderRadius: 100,
			bgColor: __value > limit ? color : SLIDER_COLOR,
			// border: "1px solid",
			// borderColor: __value > limit ? color : "background.800",
		}
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
			h: 2.5,
			w: 2.5,
			// borderRadius: 100,
			// bgColor: __value > limit ? color : "background.600",
			// border: "1px solid",
			// borderColor: __value > limit ? color : "background.800",
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
				>
					<NumberInputField bg={'background.500'} rounded={0} placeholder={placeholder} />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</InputGroup>

			<Slider
				defaultValue={30}
				onChange={(e) => handleChange(Big(e).mul(max).div(100).toFixed(tickToPrecision(tick)))}
				value={max ? Big(isValidAndPositiveNS(value) ? value : 0).mul(100).div(max).toNumber() : 0}
				focusThumbOnChange={false}
				mt={2}
				step={0.1}
				width="97%"
				ml={1.5}
				
			>
				<SliderMark value={0} {...labelStyles(0)}>
					<Box {...boxStyle(0)}></Box>
				</SliderMark>
				<SliderMark value={25} {...labelStyles(25)}>
					<Box {...boxStyle(25)}></Box>
				</SliderMark>
				<SliderMark value={50} {...labelStyles(50)}>
					<Box {...boxStyle(50)}></Box>
				</SliderMark>
				<SliderMark value={75} {...labelStyles(75)}>
					<Box {...boxStyle(75)}></Box>
				</SliderMark>
				<SliderMark value={100} {...labelStyles(100)} opacity="1">
					<Box {...boxStyle(100)}></Box>
				</SliderMark>

				<SliderTrack bg={SLIDER_COLOR}>
					<SliderFilledTrack bgColor={color} />
				</SliderTrack>
				<Tooltip
					bg={'background.400'}
					color='white'
					fontSize={"sm"}
					closeDelay={1000}
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
