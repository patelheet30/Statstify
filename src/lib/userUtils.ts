// src/lib/userUtils.ts
import { fetchDataFromIndexedDB } from "@/lib/dbutils";
import { User } from "@/lib/User";

export async function processUserData(timeout: number, setUser: (user: User) => void) {
  await new Promise((resolve) => setTimeout(resolve, timeout));

  try {
    const identifiersData = await fetchDataFromIndexedDB("Spotify Account Data/Identifiers.json");
    const identityData = await fetchDataFromIndexedDB("Spotify Account Data/Identity.json");
    const userData = await fetchDataFromIndexedDB("Spotify Account Data/Userdata.json")

    const email = identifiersData?.identifierValue || "N/A";
    const name = identityData?.displayName || "N/A";
    const pfpURL = identityData?.imageUrl || "/static/Default_pfp.svg.png";
    const birthdate = userData?.birthdate || "N/A";
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear() || 0;
    const accountCreationDate = userData?.creationTime || "N/A";
    const gender = userData?.gender || "N/A";


    setUser({ name, email, pfpURL, birthdate, age, accountCreationDate, gender });
    console.log("User:", { name, email, pfpURL, birthdate, age, accountCreationDate, gender });

    return true;
  } catch (error) {
    console.error("Error processing data", error);
    return false;
  }
}