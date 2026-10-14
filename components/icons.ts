// One icon family (Phosphor, regular weight). The SSR build has no React context, so it works
// in Server and Client Components alike. Sizes are tokens: 16, 20, 24.
export {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  HourglassMedium,
  LinkedinLogo,
  List,
  Moon,
  Plus,
  Sun,
  WarningCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";

export const ICON = { sm: 16, md: 20, lg: 24 } as const;
