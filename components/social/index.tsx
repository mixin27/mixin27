import { siteMetadada } from "@/lib/siteMetadata";
import Link from "next/link";
import { FunctionComponent } from "react";
import {
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGooglePlay,
} from "react-icons/fa";

export interface SocialType {
  icon: JSX.Element;
  path: string;
}

const socials: SocialType[] = [
  {
    icon: <FaGithub />,
    path: siteMetadada.github,
  },
  {
    icon: <FaGooglePlay />,
    path: siteMetadada.playstore,
  },
  {
    icon: <FaTwitter />,
    path: siteMetadada.twitter,
  },
  {
    icon: <FaLinkedin />,
    path: siteMetadada.linkedin,
  },
  {
    icon: <FaFacebook />,
    path: siteMetadada.facebook,
  },
];

type Props = {
  containerStyles: string | undefined;
  iconStyles: string | undefined;
};

const Social: FunctionComponent<Props> = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((social, index) => {
        return (
          <Link key={index} href={social.path} className={iconStyles}>
            {social.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Social;
