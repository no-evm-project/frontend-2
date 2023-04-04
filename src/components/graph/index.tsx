import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import dynamic from "next/dynamic";
import { useContext } from 'react';
import { DataContext } from '../../contexts/DataProvider';

const Graph = dynamic(
	() =>
		import('./Graph.jsx').then(mod => mod.Graph),
	{ ssr: false },
);

export default function GraphPanel({pair}: any) {
  const { account } = useContext(DataContext);

  return (
    <>
    <Flex flexDir={"column"} justify="center" zIndex={-1}>
       {pair && <Graph pair={pair} account={account}/>}
    </Flex>
    </>
  )
}
