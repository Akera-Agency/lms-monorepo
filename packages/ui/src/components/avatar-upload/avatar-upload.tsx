// import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
// import { Loader2 } from "lucide-react";
// import { useRef, useState } from "react";
// import { cn } from "../../lib/utils";
// import Image from "next/image";

// type AvatarUploadProps = {
//   setAvatar: (url: string) => void;
//   initialAvatarUrl?: string;
//   handleSave?: () => void;
//   isUpdating?: boolean;
//   size?: number;
//   avatarStyle?: string;
//   loaderStyle?: string;
// };

// type ClientUploadedFileData = {
//   url: string;
// };

// const AvatarUpload = ({
//   setAvatar,
//   initialAvatarUrl,
//   handleSave,
//   isUpdating,
//   size = 100,
//   avatarStyle,
//   loaderStyle,
// }: AvatarUploadProps) => {
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);

//   const uploadButtonRef = useRef<HTMLDivElement | null>(null);

//   const _handleUploadComplete = (file: ClientUploadedFileData) => {
//     setAvatar(file.url);
//     setIsUploading(false);
//     if (handleSave) {
//       handleSave();
//     }
//   };

//   const _handleFilePreview = (files: File[]) => {
//     const file = files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewUrl(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//     setIsUploading(true);
//   };

//   const avatarUrl = previewUrl || initialAvatarUrl || "";

//   const handleAvatarClick = () => {
//     if (uploadButtonRef.current) {
//       const inputElement = uploadButtonRef.current.querySelector(
//         'input[type="file"]'
//       ) as HTMLInputElement;
//       if (inputElement) {
//         inputElement.click();
//       }
//     }
//   };

//   return (
//     <div className="flex w-fit flex-col items-center">
//       {/* <div ref={uploadButtonRef}>
//         <UploadButton
//           className="hidden"
//           endpoint="imageUploader"
//           onBeforeUploadBegin={(acceptedFiles: File[]) => {
//             handleFilePreview(acceptedFiles);
//             return acceptedFiles;
//           }}
//           onClientUploadComplete={(files: ClientUploadedFileData[]) =>
//             handleUploadComplete(files[0])
//           }
//         />
//       </div> */}

//       <div className="relative">
//         <div
//           className="cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 hover:opacity-75"
//           onClick={handleAvatarClick}
//         >
//           <Avatar
//             className={cn(
//               "h-20 w-20 object-cover",
//               (isUploading || isUpdating) && "opacity-60",
//               avatarStyle
//             )}
//           >
//             {avatarUrl && (
//               <AvatarImage
//                 className="object-cover"
//                 src={avatarUrl}
//                 alt="Uploaded Preview"
//                 width={size}
//                 height={size}
//               />
//             )}
//             <AvatarFallback>
//               <Image
//                 src="https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ya0dDVXZtTnVYMEpDaGRCa0RhcEZSNjFUdW8iLCJyaWQiOiJ1c2VyXzJrWWlyd0dwZ2REZHUwVGZuSUU1bjlZendqaiIsImluaXRpYWxzIjoiQUgifQ"
//                 alt="Fallback avatar"
//                 width={size}
//                 height={size}
//                 className="h-full w-full object-cover"
//               />
//             </AvatarFallback>
//           </Avatar>
//         </div>
//         {(isUploading || isUpdating) && (
//           <Loader2
//             className={cn(
//               "absolute left-8 top-8 h-5 w-5 animate-spin",
//               loaderStyle
//             )}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AvatarUpload;
