import { z } from "zod";

// ponytail: FileList validation only works client-side
const FileListSchema = typeof window !== 'undefined' 
  ? z.instanceof(FileList)
  : z.any();

// Validation schema matching backend exactly
export const submissionSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp tidak valid")
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, "Format nomor WhatsApp tidak valid"),
  title: z.string().min(1, "Judul karya wajib diisi"),
  description: z
    .string()
    .min(10, "Narasi minimal 10 karakter")
    .max(2000, "Narasi maksimal 2000 karakter"),
  ktp_file: FileListSchema
    .refine((files) => files && files.length > 0, "File KTP wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 5 * 1024 * 1024,
      "Ukuran file KTP maksimal 5MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        const validTypes = ["image/jpeg", "image/png", "application/pdf"];
        return validTypes.includes(files[0]?.type);
      },
      "Format file KTP harus JPG, PNG, atau PDF"
    ),
  logo_file: FileListSchema
    .refine((files) => files && files.length > 0, "File Logo wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 10 * 1024 * 1024,
      "Ukuran file Logo maksimal 10MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        const validTypes = ["image/jpeg", "image/png"];
        return validTypes.includes(files[0]?.type);
      },
      "Format file Logo harus PNG atau JPG"
    ),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
