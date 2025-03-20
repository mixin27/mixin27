export interface NavigationType {
  name: string;
  path: string;
}

export const navigationLinks: NavigationType[] = [
  {
    name: "home",
    path: "/",
  },
  {
    name: "services",
    path: "/services",
  },
  {
    name: "resume",
    path: "/resume",
  },
  {
    name: "works",
    path: "/works",
  },
  {
    name: "blogs",
    path: "/blogs",
  },
  {
    name: "contact",
    path: "/contact",
  },
];
