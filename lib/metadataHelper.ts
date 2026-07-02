export interface ColorVariant {
  name: string;
  images: string[];
}

export interface VariantItem {
  color: string;
  size: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  sku: string;
}

export interface ProductMetadata {
  hasVariants: boolean;
  images: string[];
  colors: ColorVariant[];
  sizes: string[];
  variants: VariantItem[];
  videoUrl?: string;
}

const MARKER = "<!--alizenmart_metadata_v1:";
const END_MARKER = "-->";

export function parseProductMetadata(description: string): { description: string; metadata: ProductMetadata | null } {
  if (!description) {
    return { description: "", metadata: null };
  }

  const startIndex = description.lastIndexOf(MARKER);
  const endIndex = description.lastIndexOf(END_MARKER);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const jsonStr = description.slice(startIndex + MARKER.length, endIndex).trim();
    try {
      const metadata = JSON.parse(jsonStr) as ProductMetadata;
      const cleanDescription = description.slice(0, startIndex).trim();
      return {
        description: cleanDescription,
        metadata,
      };
    } catch (e) {
      console.error("Failed to parse product metadata:", e);
    }
  }

  return { description, metadata: null };
}

export function serializeProductMetadata(descriptionText: string, metadata: ProductMetadata): string {
  const cleanDescription = parseProductMetadata(descriptionText).description;
  return `${cleanDescription}\n\n${MARKER}${JSON.stringify(metadata)}${END_MARKER}`;
}
