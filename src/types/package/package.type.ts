import { PackageCategoryType } from "@/types/package-category/package-category.type";
import { PackageFeatureType } from "@/types/package-feature/package-feature.type";

export type CreatePackageRequestType = {
  name: string;
  package_category_id: number;
  price: number;
  discount: number;
  data_amount: number;
  description: string;
  is_actived: boolean;
};

export type UpdatePackageRequestType = {
  name?: string;
  package_category_id?: number;
  discount?: number;
  price?: number;
  data_amount?: number;
  description?: string;
  is_actived?: boolean;
};

export type GetAllPackagesResponseType = {
  package_category_id?: number;
};

export type PackageType = {
  id: number;
  name: string;
  package_category: PackageCategoryType;
  price: number;
  discount: number;
  data_amount: number;
  description: string;
  is_actived: boolean;
  package_feature: PackageFeatureType[];
};
