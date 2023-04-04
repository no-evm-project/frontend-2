import React from 'react'
import { useRouter } from 'next/router'
import { Box, Text, Flex } from '@chakra-ui/react'
import { useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataProvider';

export default function Trade() {
    
    const router = useRouter();
    const {pairs} = useContext(DataContext);

    useEffect(() => {
        if(pairs.length > 0){
            router.push('/spot/' + pairs[0].symbol.split('_')[1] + '_' + pairs[0].symbol.split('_')[2]);
        }
    })
    
    return (
        <></>
    )
}
