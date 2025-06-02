import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  Timer,
  AlarmClockOff,
} from "lucide-react";

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Circle,
  },
  {
    value: "in-progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
  },
  {
    value: "expired",
    label: "Expired",
    icon: AlarmClockOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Normal",
    value: "normal",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
