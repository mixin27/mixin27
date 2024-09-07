import { MarkdownItem } from "@/interfaces/markdown";

/**
 * {
    num: "03",
    category: "flutter package",
    title: "flutter_mmcalendar",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe, voluptatum dolore non ipsam minus quidem est.",
    stacks: [{ name: "Flutter" }, { name: "Dart" }],
    image: "/assets/work/dart.png",
    live: "https://pub.dev/packages/flutter_mmcalendar",
    github: "https://github.com/mixin27/flutter-mmcalendar",
  },
 */

interface Stack {
  name: string;
}

export interface Project extends MarkdownItem {
  num: string;
  category: string;
  title: string;
  description: string;
  stacks: Stack[];
  image: string;
  github: string;
  playstore: string;
  appstore: string;
  live: string;
  developers: string[];
  highlights: string[];
}
