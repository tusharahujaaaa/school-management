export interface StatData {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  colorClass: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  type: string;
}

export interface NotificationData {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'danger' | 'success';
  time: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  colorClass: string;
}
