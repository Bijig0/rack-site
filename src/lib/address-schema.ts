import { z } from "zod";

// Australian State/Territory schema
export const AustralianStateSchema = z.enum([
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
]);

export type AustralianState = z.infer<typeof AustralianStateSchema>;

// Postcode ranges for each state/territory
const POSTCODE_RANGES: Record<AustralianState, Array<[number, number]>> = {
  ACT: [
    [200, 299],
    [2600, 2639],
  ],
  NSW: [
    [1000, 1999],
    [2000, 2599],
    [2640, 2914],
  ],
  NT: [
    [800, 899],
    [900, 999],
  ],
  QLD: [
    [4000, 4999],
    [9000, 9999],
  ],
  SA: [[5000, 5999]],
  TAS: [
    [7000, 7499],
    [7800, 7999],
  ],
  VIC: [
    [3000, 3999],
    [8000, 8999],
  ],
  WA: [[6800, 6999]],
};

// Helper function to check if postcode is valid for a given state
const isPostcodeValidForState = (
  postcode: number,
  state: AustralianState
): boolean => {
  return POSTCODE_RANGES[state].some(
    ([min, max]) => postcode >= min && postcode <= max
  );
};

// Standalone Postcode schema with regex validation
export const PostcodeSchema = z
  .string()
  .regex(
    /^(0[289][0-9]{2})|([1345689][0-9]{3})|(2[0-8][0-9]{2})|(290[0-9])|(291[0-4])|(7[0-4][0-9]{2})|(7[8-9][0-9]{2})$/,
    "Postcode must be a valid 4-digit Australian postcode"
  );

// Base address object schema
const AddressBaseSchema = z.object({
  addressLine: z.string().min(1, "Address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: AustralianStateSchema,
  postcode: PostcodeSchema,
});

// Address schema with state-specific postcode validation
export const AddressSchema = AddressBaseSchema.refine(
  (data) => {
    const postcode = parseInt(data.postcode, 10);
    return isPostcodeValidForState(postcode, data.state);
  },
  {
    message: "Postcode is not valid for the selected state",
    path: ["postcode"],
  }
);

export type Address = z.infer<typeof AddressSchema>;

// Helper to parse address from Google Places result
export function parseGooglePlacesAddress(place: google.maps.places.PlaceResult): Partial<Address> {
  const address: Partial<Address> = {
    addressLine: '',
    suburb: '',
    state: undefined,
    postcode: '',
  };

  if (!place.address_components) {
    return address;
  }

  let streetNumber = '';
  let streetName = '';

  const stateMap: Record<string, AustralianState> = {
    'Australian Capital Territory': 'ACT',
    'New South Wales': 'NSW',
    'Northern Territory': 'NT',
    'Queensland': 'QLD',
    'South Australia': 'SA',
    'Tasmania': 'TAS',
    'Victoria': 'VIC',
    'Western Australia': 'WA',
    'ACT': 'ACT',
    'NSW': 'NSW',
    'NT': 'NT',
    'QLD': 'QLD',
    'SA': 'SA',
    'TAS': 'TAS',
    'VIC': 'VIC',
    'WA': 'WA',
  };

  for (const component of place.address_components) {
    const types = component.types;

    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      streetName = component.long_name;
    } else if (types.includes('locality')) {
      address.suburb = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      const stateCode = component.short_name;
      address.state = stateMap[stateCode] || stateMap[component.long_name];
    } else if (types.includes('postal_code')) {
      address.postcode = component.long_name;
    }
  }

  // Construct address line
  address.addressLine = streetNumber ? `${streetNumber} ${streetName}` : streetName;

  return address;
}
