// Local size charts for each product (2024 standard)
// You can fill in actual measurement ranges per product and size.

export interface SizeChartEntry {
  // Optional gender for pants entries
  gender?: 'male' | 'female';
  // Common fields for shirts/spa
  form?: 'slim' | 'regular';
  size: string;
  weightMinKg?: number;
  weightMaxKg?: number;
  shoulderWidthCm?: number;
  chestHalfWidthCm?: number;
  garmentLengthCm?: number;
  // Pants-specific measurements (cm)
  pantsLengthCm?: number;
  waistCm?: number;
  hipCm?: number;
  thighCm?: number;
  legOpeningCm?: number;
  bottomCircumferenceCm?: number;
}

export type ProductKey = 'polo' | 'round' | 'shirt' | 'spa' | 'pants';

export const sizeCharts: Record<ProductKey, SizeChartEntry[]> = {
  polo: [], // TODO
  // Round neck T-Shirt (Regular form, 2024 standards)
  round: [
    { size: 'S', weightMinKg: 53, weightMaxKg: 56, shoulderWidthCm: 43.5, chestHalfWidthCm: 50, garmentLengthCm: 70 },
    { size: 'M', weightMinKg: 60, weightMaxKg: 68, shoulderWidthCm: 45.0, chestHalfWidthCm: 52, garmentLengthCm: 72 },
    { size: 'L', weightMinKg: 68, weightMaxKg: 78, shoulderWidthCm: 46.5, chestHalfWidthCm: 54, garmentLengthCm: 74 },
    { size: 'XL', weightMinKg: 78, weightMaxKg: 85, shoulderWidthCm: 48.0, chestHalfWidthCm: 56, garmentLengthCm: 76 },
  ],
  // Shirt (Form Slim-Fit and Regular)
  shirt: [
    // Slim-Fit
    { form: 'slim', size: 'S', weightMinKg: 53, weightMaxKg: 60, shoulderWidthCm: 43.2, chestHalfWidthCm: 48, garmentLengthCm: 72 },
    { form: 'slim', size: 'M', weightMinKg: 60, weightMaxKg: 68, shoulderWidthCm: 44.7, chestHalfWidthCm: 50, garmentLengthCm: 74 },
    { form: 'slim', size: 'L', weightMinKg: 68, weightMaxKg: 78, shoulderWidthCm: 46.2, chestHalfWidthCm: 52, garmentLengthCm: 74 },
    { form: 'slim', size: 'XL', weightMinKg: 78, weightMaxKg: 85, shoulderWidthCm: 47.7, chestHalfWidthCm: 54, garmentLengthCm: 75.5 },
    // Regular
    { form: 'regular', size: 'S', weightMinKg: 53, weightMaxKg: 60, shoulderWidthCm: 43.2, chestHalfWidthCm: 50, garmentLengthCm: 72 },
    { form: 'regular', size: 'M', weightMinKg: 60, weightMaxKg: 68, shoulderWidthCm: 43.8, chestHalfWidthCm: 51.5, garmentLengthCm: 74 },
    { form: 'regular', size: 'L', weightMinKg: 68, weightMaxKg: 78, shoulderWidthCm: 45.7, chestHalfWidthCm: 53.5, garmentLengthCm: 74 },
    { form: 'regular', size: 'XL', weightMinKg: 78, weightMaxKg: 85, shoulderWidthCm: 47.6, chestHalfWidthCm: 56, garmentLengthCm: 75.5 },
  ],
  // Spa wear size chart (Adult sizes based on height/weight)
  spa: [
    // height 1.45-1.55m, weight 40-46kg
    { size: 'S', weightMinKg: 40, weightMaxKg: 46, shoulderWidthCm: 0, chestHalfWidthCm: 0, garmentLengthCm: 0 },
    // height 1.56-1.6m, weight 47-56kg
    { size: 'M', weightMinKg: 47, weightMaxKg: 56, shoulderWidthCm: 0, chestHalfWidthCm: 0, garmentLengthCm: 0 },
    // height 1.61-1.65m, weight 57-63kg
    { size: 'L', weightMinKg: 57, weightMaxKg: 63, shoulderWidthCm: 0, chestHalfWidthCm: 0, garmentLengthCm: 0 },
    // height 1.66-1.7m, weight 64-69kg
    { size: 'XL', weightMinKg: 64, weightMaxKg: 69, shoulderWidthCm: 0, chestHalfWidthCm: 0, garmentLengthCm: 0 },
    // height >1.75m, weight 70-76kg
    { size: 'XXL', weightMinKg: 70, weightMaxKg: 76, shoulderWidthCm: 0, chestHalfWidthCm: 0, garmentLengthCm: 0 },
  ],
  pants: [
    // Female pants (quần tây nữ)
    { gender: 'female', size: 'XS', pantsLengthCm: 95, waistCm: 64, hipCm: 87, thighCm: 53, legOpeningCm: 14, bottomCircumferenceCm: 58.5 },
    { gender: 'female', size: 'S', pantsLengthCm: 95, waistCm: 68, hipCm: 91, thighCm: 55, legOpeningCm: 15, bottomCircumferenceCm: 60 },
    { gender: 'female', size: 'M', pantsLengthCm: 96, waistCm: 72, hipCm: 95, thighCm: 57, legOpeningCm: 16, bottomCircumferenceCm: 61.5 },
    { gender: 'female', size: 'L', pantsLengthCm: 96, waistCm: 76, hipCm: 99, thighCm: 59, legOpeningCm: 17, bottomCircumferenceCm: 63 },
    { gender: 'female', size: 'XL', pantsLengthCm: 97, waistCm: 80, hipCm: 103, thighCm: 61, legOpeningCm: 18, bottomCircumferenceCm: 64.5 },
    { gender: 'female', size: '2XL', pantsLengthCm: 97, waistCm: 84, hipCm: 107, thighCm: 63, legOpeningCm: 18, bottomCircumferenceCm: 66 },
    { gender: 'female', size: '3XL', pantsLengthCm: 98, waistCm: 88, hipCm: 111, thighCm: 65, legOpeningCm: 19, bottomCircumferenceCm: 67.5 },
    { gender: 'female', size: '4XL', pantsLengthCm: 98, waistCm: 92, hipCm: 115, thighCm: 67, legOpeningCm: 19, bottomCircumferenceCm: 69 },
    // Male pants (quần tây nam)
    { gender: 'male', size: 'XS', pantsLengthCm: 98, waistCm: 76, hipCm: 91, thighCm: 54, legOpeningCm: 17, bottomCircumferenceCm: 61 },
    { gender: 'male', size: 'S', pantsLengthCm: 98, waistCm: 79, hipCm: 94, thighCm: 56, legOpeningCm: 17, bottomCircumferenceCm: 62 },
    { gender: 'male', size: 'M', pantsLengthCm: 99, waistCm: 82, hipCm: 97, thighCm: 58, legOpeningCm: 18, bottomCircumferenceCm: 63.5 },
    { gender: 'male', size: 'L', pantsLengthCm: 99, waistCm: 85, hipCm: 100, thighCm: 60, legOpeningCm: 18, bottomCircumferenceCm: 65 },
    { gender: 'male', size: 'XL', pantsLengthCm: 100, waistCm: 88, hipCm: 103, thighCm: 62, legOpeningCm: 19, bottomCircumferenceCm: 66.5 },
    { gender: 'male', size: '2XL', pantsLengthCm: 100, waistCm: 91, hipCm: 106, thighCm: 64, legOpeningCm: 19, bottomCircumferenceCm: 68 },
    { gender: 'male', size: '3XL', pantsLengthCm: 101, waistCm: 94, hipCm: 109, thighCm: 66, legOpeningCm: 20, bottomCircumferenceCm: 69.5 },
    { gender: 'male', size: '4XL', pantsLengthCm: 101, waistCm: 97, hipCm: 112, thighCm: 68, legOpeningCm: 21, bottomCircumferenceCm: 71 },
  ],
};
