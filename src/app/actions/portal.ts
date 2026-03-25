"use server";

import { Resend } from "resend";
import { integrationStatus, listings, portalEnv } from "@/lib/portal";

type InquiryPayload = {
  listingId: string;
  listingTitle: string;
  agentEmail: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
};

export async function submitInquiryAction(payload: InquiryPayload) {
  if (!payload.buyerName || !payload.buyerPhone || !payload.buyerEmail) {
    return { ok: false, message: "Share your name, phone number, and email so the expert can get back to you." };
  }

  if (integrationStatus.resend) {
    const resend = new Resend(portalEnv.resendKey);
    await resend.emails.send({
      from: portalEnv.resendFrom,
      to: [payload.agentEmail],
      subject: `New inquiry for ${payload.listingTitle}`,
      text: `${payload.buyerName} (${payload.buyerPhone}, ${payload.buyerEmail})\n\n${payload.message}`,
    });
  }

  return {
    ok: true,
    message: integrationStatus.resend
      ? "Your inquiry is on its way. The listing expert will review it and reach out shortly."
      : "Your inquiry has been captured. Live delivery will start once email is connected.",
  };
}

export async function submitListingDraftAction(formData: {
  title: string;
  city: string;
  propertyType: string;
}) {
  if (!formData.title || !formData.city || !formData.propertyType) {
    return { ok: false, message: "Add a title, location, and property type to save your draft." };
  }

  return {
    ok: true,
    message: `Your draft for "${formData.title}" is ready for the next review step.`,
  };
}

export async function signInAction(formData: { email: string; password: string }) {
  if (!formData.email || !formData.password) {
    return { ok: false, message: "Enter your email and password to continue." };
  }

  return {
    ok: true,
    message:
      "You are signed in to the demo experience. Connect live authentication to activate real account access.",
  };
}

export async function signUpAction(formData: {
  name: string;
  email: string;
  password: string;
}) {
  if (!formData.name || !formData.email || !formData.password) {
    return { ok: false, message: "Enter your name, email, and password to create your account." };
  }

  return {
    ok: true,
    message:
      "Your demo account is ready. Connect live authentication to enable saved activity and role-based access.",
  };
}

export async function saveSearchAction(label: string) {
  if (!label) {
    return { ok: false, message: "Name this alert so you can find it quickly later." };
  }

  return {
    ok: true,
    message: `"${label}" has been saved to your alert list in the demo workspace.`,
  };
}

export async function getListingCountAction() {
  return listings.length;
}
