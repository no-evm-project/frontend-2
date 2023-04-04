import { DataContext } from '@/contexts/DataProvider';
import { Button, Input, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { BN } from 'bn.js';
import Big from 'big.js';
import { CONTRACT_ID } from '../../constants';
import { utils } from 'near-api-js';


export default function Deposit({tokenSymbol}: any) {
    const { account, tokens } = useContext(DataContext);
    const [ amount, setAmount ] = React.useState<string>('');
    const { isOpen, onOpen, onClose } = useDisclosure()

    const deposit = () => {
        if(tokenSymbol == 'NEAR'){
            console.log(utils.format.parseNearAmount(amount));
            account?.wallet?.signAndSendTransaction({
                receiverId: CONTRACT_ID,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: "user_deposit_native_token",
                            args: {
                                "broker_id": "zexe_dex",
                            },
                            gas: "100000000000000",
                            deposit: utils.format.parseNearAmount(amount)!,
                        },
                    },
                ],
            })
            return;
        } else {
            account?.wallet?.signAndSendTransaction({
                receiverId: tokens[tokenSymbol].token_account_id,
                actions: [
                    {
                        type: "FunctionCall",
                        params: {
                            methodName: "ft_transfer_call",
                            args: {
                                "receiver_id": "asset-manager.orderly.testnet",
                                "msg": "{\"Deposit\":{\"broker_id\":\"zexe_dex\"}}",
                                "amount": Big(amount).mul(10**tokens[tokenSymbol].decimals).toString()
                            },
                            gas: "100000000000000",
                            deposit: "1",
                        },
                    },
                ],
            })
        }
    }

  return (
    <>
    
    <Button onClick={onOpen} >Deposit</Button>

<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Basic usage' />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={deposit}>
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
