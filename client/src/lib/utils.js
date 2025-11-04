export const API_BASE_URL = "http://localhost:5000";

export async function addTestData(name, email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) throw new Error("Failed to add test data");

    return await response.json();
  } catch (error) {
    console.error("Error adding test data:", error);
  }
}
