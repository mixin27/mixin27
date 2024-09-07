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
    path: "https://github.com/mixin27",
  },
  {
    icon: <FaGooglePlay />,
    path: "https://play.google.com/store/search?q=pub%3AKyaw%20Zayar%20Tun&c=apps",
  },
  {
    icon: <FaTwitter />,
    path: "https://twitter.com/kyawzayartun98",
  },
  {
    icon: <FaLinkedin />,
    path: "https://www.linkedin.com/in/kyaw-zayar-tun-7574a917a",
  },
  {
    icon: <FaFacebook />,
    path: "https://www.facebook.com/zy.98727",
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
