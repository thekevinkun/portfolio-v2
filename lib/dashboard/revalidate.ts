import { revalidatePath } from "next/cache";

// One call refreshes the five public routes and the root-layout SEO metadata (D88)
export function revalidateSite() {
  revalidatePath("/", "layout");
}
