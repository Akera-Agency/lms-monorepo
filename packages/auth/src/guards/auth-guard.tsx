// import React from "react";
// import { useEffect } from "react";
// import { useAuthForm } from "../hooks/useAuth";

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//     const {
//         session,
//         loading,
//         navigate,
//         setLoading,
//     } = useAuthForm();

//     const PUBLIC_PATHS = ["/login", "/signup","/"];

//   useEffect(() => {
//     const checkAuth = async () => {
//         if (PUBLIC_PATHS.includes(location.pathname)) {
//             setLoading(false);
//             return;
//           }

//       if (!session) {
//         setLoading(false);
//         navigate({ to: "/login" });
//       } else {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) {
//     return <div className="flex h-screen items-center justify-center">Loading...</div>;
//   }

//   return {children};
// }
