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
  title: z.string().min(5, "Judul karya minimal 5 karakter").max(200, "Judul maksimal 200 karakter"),
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
  logo_vector_file: FileListSchema
    .refine((files) => files && files.length > 0, "File vektor logo wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 45 * 1024 * 1024,
      "Ukuran file vektor maksimal 45MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        const name = files[0]?.name.toLowerCase();
        return name?.endsWith('.ai') || name?.endsWith('.eps') || name?.endsWith('.cdr') || name?.endsWith('.pdf');
      },
      "Format file vektor harus AI, EPS, CDR, atau PDF"
    ),
  logo_png_file: FileListSchema
    .refine((files) => files && files.length > 0, "File PNG logo wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 10 * 1024 * 1024,
      "Ukuran file PNG maksimal 10MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        return files[0]?.type === "image/png";
      },
      "Format file harus PNG"
    ),
  logo_jpeg_file: FileListSchema
    .refine((files) => files && files.length > 0, "File JPEG logo wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 10 * 1024 * 1024,
      "Ukuran file JPEG maksimal 10MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        return files[0]?.type === "image/jpeg";
      },
      "Format file harus JPEG"
    ),
  filosofi_pdf_file: FileListSchema
    .refine((files) => files && files.length > 0, "File filosofi PDF wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 5 * 1024 * 1024,
      "Ukuran file filosofi maksimal 5MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        return files[0]?.type === "application/pdf";
      },
      "Format file filosofi harus PDF"
    ),
  surat_pernyataan_file: FileListSchema
    .refine((files) => files && files.length > 0, "File surat pernyataan wajib diunggah")
    .refine(
      (files) => !files || files[0]?.size <= 5 * 1024 * 1024,
      "Ukuran file surat pernyataan maksimal 5MB"
    )
    .refine(
      (files) => {
        if (!files) return true;
        const validTypes = ["image/jpeg", "image/png", "application/pdf"];
        return validTypes.includes(files[0]?.type);
      },
      "Format file surat pernyataan harus JPG, PNG, atau PDF"
    ),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
