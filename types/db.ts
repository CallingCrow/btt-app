import type { Tables } from "./supabase";

export type MenuItem = Tables<"menu">;

export type CustomizationGroup = Tables<"customization_groups">;

export type CustomizationOption = Tables<"customization_options">;

export type CustomizationDefault = Tables<"customization_defaults">;

export type CategoryCustomizationGroup =
  Tables<"category_customization_groups">;

export type Order = Tables<"orders">;

export type InfoRecord = Tables<"info">;

export type { Json } from "./supabase";
