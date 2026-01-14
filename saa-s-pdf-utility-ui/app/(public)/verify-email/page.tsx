// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

// export default function VerifyEmailPage() {
//   const params = useSearchParams();
//   const email = params.get("email");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const resend = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch(`${API_BASE}/api/auth/resend-verification/`, {
//         method: "POST",
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Failed to resend");

//       setMessage("Verification email resent.");
//     } catch {
//       setMessage("Could not resend email. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Verify your email</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <p className="text-sm text-muted-foreground">
//             We sent a verification link to:
//           </p>

//           <p className="font-medium">{email || "your email address"}</p>

//           <p className="text-sm text-muted-foreground">
//             Please check your inbox (and spam folder).
//           </p>

//           {message && (
//             <Alert>
//               <AlertDescription>{message}</AlertDescription>
//             </Alert>
//           )}

//           <Button onClick={resend} disabled={loading} className="w-full">
//             {loading ? "Resending..." : "Resend verification email"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
