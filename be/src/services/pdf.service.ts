import PDFDocument from "pdfkit";
import { Submission } from "@prisma/client";

export const generateReceiptPDF = (submission: Submission): PDFKit.PDFDocument => {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 40,
      bottom: 40,
      left: 45,
      right: 45,
    },
  });

  const PAGE_WIDTH = 595.28;
  const LEFT = 45;
  const RIGHT = PAGE_WIDTH - 45;
  const CONTENT_WIDTH = RIGHT - LEFT;

  const COLORS = {
    primary: "#00796B",
    primaryDark: "#00574B",
    primaryLight: "#E8F5F2",
    text: "#1F2937",
    muted: "#6B7280",
    lightText: "#9CA3AF",
    border: "#E5E7EB",
    background: "#F8FAFC",
    white: "#FFFFFF",
    success: "#087F5B",
    successBg: "#E8F8F1",
  };

  const drawRoundedBox = (x: number, y: number, width: number, height: number, fill: string, radius = 8) => {
    doc.roundedRect(x, y, width, height, radius).fillColor(fill).fill();
  };

  const drawSectionTitle = (title: string, yPos: number) => {
    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.primaryDark).text(title.toUpperCase(), LEFT, yPos);

    doc
      .strokeColor(COLORS.primary)
      .lineWidth(2)
      .moveTo(LEFT, yPos + 15)
      .lineTo(LEFT + 28, yPos + 15)
      .stroke();
  };

  const drawField = (label: string, value: string, x: number, yPos: number, width: number) => {
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.muted).text(label.toUpperCase(), x, yPos, {
      width,
    });

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(COLORS.text)
      .text(value || "-", x, yPos + 11, {
        width,
        lineGap: 2,
      });
  };

  // ============================================================
  // BACKGROUND & ACCENT
  // ============================================================

  // Full page background
  doc.rect(0, 0, PAGE_WIDTH, 841.89).fillColor(COLORS.background).fill();

  // Top header accent bar
  doc.rect(0, 0, PAGE_WIDTH, 6).fillColor(COLORS.primary).fill();

  // ============================================================
  // HEADER
  // ============================================================

  let y = 38;

  // Header Title Area
  doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.primary).text("DOKUMEN DIGITAL RESMI", LEFT, y);

  y += 15;
  doc.font("Helvetica-Bold").fontSize(20).fillColor(COLORS.text).text("Bukti Pengiriman Karya", LEFT, y);

  y += 24;
  doc.font("Helvetica").fontSize(9.5).fillColor(COLORS.muted).text("Sayembara Desain Logo HUT ke-14 Kabupaten Mamuju Tengah", LEFT, y);

  // Status Badge (Top Right)
  const badgeWidth = 110;
  const badgeHeight = 38;
  drawRoundedBox(RIGHT - badgeWidth, 38, badgeWidth, badgeHeight, COLORS.successBg, 8);

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text("STATUS", RIGHT - badgeWidth, 44, {
      width: badgeWidth,
      align: "center",
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.success)
    .text("TERDAFTAR", RIGHT - badgeWidth, 57, {
      width: badgeWidth,
      align: "center",
    });

  y += 30;

  // Divider Line
  doc.strokeColor(COLORS.border).lineWidth(1).moveTo(LEFT, y).lineTo(RIGHT, y).stroke();

  y += 18;

  // ============================================================
  // KODE REGISTRASI CARD
  // ============================================================

  const codeCardHeight = 76;
  drawRoundedBox(LEFT, y, CONTENT_WIDTH, codeCardHeight, COLORS.white, 10);

  // Left Accent Bar inside card
  doc.roundedRect(LEFT, y, 4, codeCardHeight, 2).fillColor(COLORS.primary).fill();

  doc
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text("KODE REGISTRASI UNIK", LEFT + 18, y + 14);

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(COLORS.primary)
    .text(submission.submissionCode, LEFT + 18, y + 28);

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.lightText)
    .text("Simpan kode ini sebagai referensi bukti sah pengiriman karya Anda.", LEFT + 18, y + 54);

  y += codeCardHeight + 20;

  // ============================================================
  // DATA PESERTA
  // ============================================================

  drawSectionTitle("Data Peserta", y);
  y += 24;

  const participantCardHeight = 105;
  drawRoundedBox(LEFT, y, CONTENT_WIDTH, participantCardHeight, COLORS.white, 10);

  const colGap = 20;
  const colWidth = (CONTENT_WIDTH - 40 - colGap) / 2;
  const leftColX = LEFT + 20;
  const rightColX = LEFT + 20 + colWidth + colGap;

  // Row 1
  drawField("Nama Lengkap", submission.name, leftColX, y + 15, colWidth);
  drawField("Email", submission.email, rightColX, y + 15, colWidth);

  // Row 2
  drawField("Nomor WhatsApp", submission.whatsapp, leftColX, y + 58, colWidth);

  y += participantCardHeight + 20;

  // ============================================================
  // DATA KARYA
  // ============================================================

  drawSectionTitle("Data Karya", y);
  y += 24;

  // Combined Work Card (Title & Description in 1 Container)
  const workCardHeight = 180;
  drawRoundedBox(LEFT, y, CONTENT_WIDTH, workCardHeight, COLORS.white, 10);

  // Title section inside container
  drawField("Judul Karya", submission.title, LEFT + 20, y + 15, CONTENT_WIDTH - 40);

  // Inner Divider
  doc
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .moveTo(LEFT + 20, y + 55)
    .lineTo(RIGHT - 20, y + 55)
    .stroke();

  // Philosophy / Description
  // ponytail: filosofi now in separate PDF file, remove from receipt

  y += workCardHeight + 20;

  // ============================================================
  // INFORMASI PENGIRIMAN
  // ============================================================

  drawSectionTitle("Informasi Pengiriman", y);
  y += 24;

  const infoCardHeight = 60;
  drawRoundedBox(LEFT, y, CONTENT_WIDTH, infoCardHeight, COLORS.white, 10);

  const submittedDate = new Date(submission.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Makassar",
  });

  drawField("Tanggal & Waktu Pengiriman", `${submittedDate} WITA`, leftColX, y + 15, colWidth);
  drawField("Status Pengiriman", "Terverifikasi / Terdaftar", rightColX, y + 15, colWidth);

  // ============================================================
  // FOOTER
  // ============================================================

  const footerY = 780;

  doc.strokeColor(COLORS.border).lineWidth(1).moveTo(LEFT, footerY).lineTo(RIGHT, footerY).stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("PANITIA SAYEMBARA DESAIN LOGO HUT KE-14 KABUPATEN MAMUJU TENGAH", LEFT, footerY + 12, {
      width: CONTENT_WIDTH,
      align: "center",
    });

  doc.end();

  return doc;
};
