import { UserDto } from "@membros-total/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getUsers(): Promise<UserDto[]> {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}
