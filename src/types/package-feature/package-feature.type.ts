import { PackageType } from "@/types/package/package.type";

export type CreatePackageFeatureRequestType = {
  package_id: number;
  name: string;
  value: string;
};

export type UpdatePackageFeatureRequestType = {
  package_id?: number;
  name?: string;
  value?: string;
};

export type PackageFeatureType = {
  id: number;
  name: string;
  value: string;
  package: PackageType;
};
