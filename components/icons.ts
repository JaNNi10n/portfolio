// One icon family (Phosphor, regular weight). The SSR build has no React context, so it works
// in Server and Client Components alike. Each icon is imported from its own module, never the barrel,
// so client islands only ship the icons they use. Sizes are tokens: 16, 20, 24.
export { ArrowDown } from "@phosphor-icons/react/dist/ssr/ArrowDown";
export { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
export { Check } from "@phosphor-icons/react/dist/ssr/Check";
export { Copy } from "@phosphor-icons/react/dist/ssr/Copy";
export { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
export { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
export { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
export { HourglassMedium } from "@phosphor-icons/react/dist/ssr/HourglassMedium";
export { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
export { List } from "@phosphor-icons/react/dist/ssr/List";
export { Moon } from "@phosphor-icons/react/dist/ssr/Moon";
export { Plus } from "@phosphor-icons/react/dist/ssr/Plus";
export { Sun } from "@phosphor-icons/react/dist/ssr/Sun";
export { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
export { X } from "@phosphor-icons/react/dist/ssr/X";

export const ICON = { sm: 16, md: 20, lg: 24 } as const;
