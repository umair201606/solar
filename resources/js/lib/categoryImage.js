// Default card image for a category from the settings map — mirrors
// StoreController::categoryImage() on the backend.
export function categoryImageFrom(settings, category) {
  if (!settings) return null;
  const fallback = settings.default_product_image || null;
  if (!category) return fallback;
  if (category.includes("Batter")) return settings.category_image_batteries || fallback;
  if (category.includes("Inverter")) return settings.category_image_inverters || fallback;
  if (category.includes("Panel")) return settings.category_image_panels || fallback;
  return fallback;
}
