import {
  doc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// ─── Listings ────────────────────────────────────────────────────────────────

export async function approveListing(id: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'listings', id), {
    status: 'active',
    verified: true,
  });
}

export async function rejectListing(id: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'listings', id), {
    status: 'rejected',
  });
}

export interface ListingFormData {
  title: string;
  listingType: string;
  assetClass: string;
  propertyType: string;
  bhk?: number | null;
  bathrooms: number;
  area: number;
  furnishing: string;
  possessionStatus: string;
  price: number;
  priceUnit: string;
  city: string;
  address: string;
  description: string;
  amenities: string[];
  images: string[];
}

export async function submitListing(data: ListingFormData, uid: string): Promise<string> {
  const { firestore } = initializeFirebase();
  const docRef = await addDoc(collection(firestore, 'listings'), {
    ...data,
    status: 'pending',
    verified: false,
    featured: false,
    profileId: uid,
    ownerType: 'owner',
    postedOn: new Date().toISOString(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function verifyUser(uid: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'users', uid), {
    verificationStatus: 'verified',
  });
}

export async function banUser(uid: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'users', uid), {
    verificationStatus: 'banned',
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function markContacted(id: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'inquiries', id), {
    status: 'contacted',
  });
}

export async function closeInquiry(id: string): Promise<void> {
  const { firestore } = initializeFirebase();
  await updateDoc(doc(firestore, 'inquiries', id), {
    status: 'closed',
  });
}

export interface InquiryData {
  listingId: string;
  listingTitle: string;
  agentId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
}

export async function submitInquiry(data: InquiryData): Promise<string> {
  const { firestore } = initializeFirebase();
  const docRef = await addDoc(collection(firestore, 'inquiries'), {
    ...data,
    status: 'new',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}
