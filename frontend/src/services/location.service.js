const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchLocations() {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/locations`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}

export async function fetchLocation(locationId) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/locations/${locationId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location");
  }

  return response.json();
}