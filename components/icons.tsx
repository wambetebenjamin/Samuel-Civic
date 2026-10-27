import {
  BookOpen,
  Droplets,
  GraduationCap,
  HeartPulse,
  House,
  Leaf,
  Route,
  Store,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
const icons: Record<string, LucideIcon> = {
  droplets: Droplets,
  route: Route,
  store: Store,
  house: House,
  heart: HeartPulse,
  book: GraduationCap,
  leaf: Leaf,
  users: Users,
  guide: BookOpen,
};
export function CategoryIcon({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name] || BookOpen;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
