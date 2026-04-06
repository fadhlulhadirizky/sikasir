// frontend\src\lib\uploadthing.ts
import { 
  generateUploadButton, 
  generateUploadDropzone,
  generateReactHelpers 
} from "@uploadthing/react";

// Karena kita menggunakan custom Express server, kita arahkan URL-nya ke backend
const url = "http://localhost:3000/api/uploadthing";

export const UploadButton = generateUploadButton({ url });
export const UploadDropzone = generateUploadDropzone({ url });

// Tambahkan baris ini agar kita bisa pakai hooks untuk UI kustom!
export const { useUploadThing, uploadFiles } = generateReactHelpers({ url });