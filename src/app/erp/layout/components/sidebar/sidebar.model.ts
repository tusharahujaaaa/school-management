import type { ErpRole } from '../../../shared/types/erp.types';

export interface SidebarNavChild {
  label: string;
  route: string;
  icon?: string;
  permissionKey?: string;
}

export interface SidebarNavItem {
  type: 'link' | 'group' | 'divider';
  label?: string;
  route?: string;
  icon?: string;
  /** Comma-separated or regex-based routerLinkActive match */
  exactMatch?: boolean;
  /** Module key for future dynamic activation */
  moduleKey?: string;
  /** Permission key for RBAC */
  permissionKey?: string;
  /** Roles allowed to see this item — empty means all roles */
  roles?: ErpRole[];
  /** Badge text, e.g. "Soon", "New" */
  badge?: string;
  /** Whether the item is disabled (greyed out) */
  disabled?: boolean;
  children?: SidebarNavChild[];
}

export interface SidebarGroup {
  groupLabel?: string;
  items: SidebarNavItem[];
}
