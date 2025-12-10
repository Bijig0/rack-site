import { notFound } from "next/navigation";
import { getPropertyById } from "@/actions/properties";
import EditPropertyClient from "./EditPropertyClient";

export const dynamic = "force-dynamic";

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

  const initialData = {
    bedroomCount: data.bedroomCount,
    bathroomCount: data.bathroomCount,
    propertyType: data.propertyType,
    landAreaSqm: data.landAreaSqm,
    mainImageUrl: data.mainImageUrl,
  };

  return (
    <EditPropertyClient
      propertyId={id}
      addressCommonName={data.addressCommonName}
      initialData={initialData}
    />
  );
}
