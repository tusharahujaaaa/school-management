export interface BrandingConfig {
  schoolName: string;
  logo: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
  };
  layout: {
    sidebarStyle: 'light' | 'dark' | 'transparent';
  };
}

export const ERP_BRANDING_CONFIG: BrandingConfig = {
  schoolName: 'Enterprise School ERP',
  logo: 'assets/erp/images/logo.png', // placeholder
  favicon: 'assets/erp/images/favicon.ico',
  colors: {
    primary: '#0f62fe', // Enterprise Blue
    secondary: '#393939',
  },
  layout: {
    sidebarStyle: 'light',
  }
};
