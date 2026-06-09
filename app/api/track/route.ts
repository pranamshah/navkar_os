import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { jobNo, pin } = await req.json();

    if (!jobNo?.trim() || !pin?.trim()) {
      return NextResponse.json({ error: "Job number and PIN are required" }, { status: 400 });
    }

    const job = await prisma.nexJob.findUnique({
      where: { jobNo: jobNo.trim().toUpperCase() },
      include: {
        containers: true,
        documents: {
          select: {
            id: true,
            type: true,
            label: true,
            fileUrl: true,
            createdAt: true,
          },
        },
        trackingUpdates: {
          orderBy: { createdAt: "asc" },
        },
        client: {
          select: { companyName: true, contactName: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Shipment not found. Check the job number and try again." }, { status: 404 });
    }

    // Verify PIN:
    // 1. If clientAccessPin is set, it must match exactly (case-insensitive)
    // 2. Fallback: last 6 chars of job.id (uppercase) as default PIN
    const storedPin = job.clientAccessPin;
    const defaultPin = job.id.slice(-6).toUpperCase();
    const enteredPin = pin.trim().toUpperCase();

    const pinValid = storedPin
      ? storedPin.toUpperCase() === enteredPin
      : defaultPin === enteredPin;

    if (!pinValid) {
      return NextResponse.json({ error: "Incorrect PIN. Please check with your freight forwarder." }, { status: 401 });
    }

    // Return safe subset of job data (no internal financial info)
    return NextResponse.json({
      jobNo: job.jobNo,
      jobType: job.jobType,
      mode: job.mode,
      status: job.status,
      stage: job.stage,
      // Route
      portLoading: job.portLoading,
      portDischarge: job.portDischarge,
      finalDest: job.finalDest,
      countryOrigin: job.countryOrigin,
      // Cargo
      commodity: job.commodity,
      packages: job.packages,
      packageType: job.packageType,
      grossWeight: job.grossWeight,
      cbm: job.cbm,
      // Vessel / flight
      shippingLine: job.shippingLine,
      vessel: job.vessel,
      voyage: job.voyage,
      flightNo: job.flightNo,
      mblNo: job.mblNo,
      hblNo: job.hblNo,
      mawbNo: job.mawbNo,
      hawbNo: job.hawbNo,
      sailingDate: job.sailingDate,
      etaOriginal: job.etaOriginal,
      etaUpdated: job.etaUpdated,
      arrivalDate: job.arrivalDate,
      clearanceDate: job.clearanceDate,
      gateOutDate: job.gateOutDate,
      deliveryDate: job.deliveryDate,
      // Client
      clientName: job.client.companyName,
      // Containers
      containers: job.containers,
      // Documents
      documents: job.documents,
      // Tracking timeline
      trackingUpdates: job.trackingUpdates.map((t) => ({
        stage: t.stage,
        notes: t.notes,
        createdAt: t.createdAt,
      })),
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (err) {
    console.error("[track API]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
