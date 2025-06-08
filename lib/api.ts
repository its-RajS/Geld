// // lib/api.ts

// export async function apiFetch<T>(
//   url: string,
//   options?: RequestInit
// ): Promise<T> {
//   const res = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "API fetch failed");
//   }

//   return res.json();
// }
