import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
  faDiscord
} from "@fortawesome/fontawesome-free-brands";
import { Flex, Image } from "@chakra-ui/react";

export default function SocialFollow() {
  return (
    <Flex gap={2}>
        <a href="https://twitter.com/zexeio" target={'_blank'} className="twitter social">
        <FontAwesomeIcon icon={faTwitter as any} size="lg" />
      </a>
      <a href="https://discord.gg/wwzNMndQr6" target={'_blank'} className="discord social">
        <Image mt={1} w={6} src='https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6cc3c481a15a141738_icon_clyde_white_RGB.png'/>
      </a>
      
    </Flex>
  );
}