export type CreatePackageCategoryRequestType = {
  name: string;
  description: string;
  is_actived: boolean;
};

export type UpdatePackageCategoryRequestType = {
  name?: string;
  description?: string;
  is_actived?: boolean;
};

export type PackageCategoryType = {
  id: number;
  name: string;
  description: string;
  is_actived: boolean;
};
