export type ApartmentBreadcrumbItem = {
  label: string;
  href?: string;
};

export interface ApartmentBreadcrumbConfig {
  homeHref: string;
  homeLabel: string;
  items: ApartmentBreadcrumbItem[];
}
