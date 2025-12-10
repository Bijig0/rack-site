import { notFound } from "next/navigation";
import { getPropertyById } from "@/actions/properties";
import EditPropertyClient from "./EditPropertyClient";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPropertyById(id);

  if (!data) {
    return { title: "Property Not Found" };
  }

  return {
    title: `Edit ${data.addressCommonName} | Dashboard`,
  };
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPropertyById(id);

  if (!data) {
    notFound();
  }

  // Transform images to the format expected by the form
  const images = (data.images || []).map((img) => ({
    id: img.id,
    url: img.url,
    type: img.type as "main" | "gallery" | "floor_plan" | "streetview",
    sortOrder: img.sortOrder,
  }));

  const initialData = {
    bedroomCount: data.bedroomCount,
    bathroomCount: data.bathroomCount,
    propertyType: data.propertyType,
    landAreaSqm: data.landAreaSqm,
    images,
  };

  return (
    <EditPropertyClient
      propertyId={id}
      addressCommonName={data.addressCommonName}
      initialData={initialData}
    />
  );
}
