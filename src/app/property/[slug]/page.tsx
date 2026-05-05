import { redirect } from "next/navigation";

export default async function PropertySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try to extract a numeric ID from the slug
  // Slugs like "4-bhk-apartment-golf-course-road-gurugram" don't have IDs
  // But we can try to find a listing ID from the end of the slug
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);

  if (!isNaN(id) && id > 0) {
    redirect(`/listings/${id}`);
  }

  // For old mock slugs, just redirect to search
  redirect("/search");
}
