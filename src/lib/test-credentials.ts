/**
 * Test Credentials for The City's Block
 * 
 * After wiring up Firebase Auth, create these test accounts manually:
 * 
 * Admin Account:
 * - Email: admin@citysblock.in
 * - Password: Admin@123
 * - Role: admin
 * 
 * Owner Account:
 * - Email: owner@citysblock.in
 * - Password: Owner@123
 * - Role: owner
 * 
 * Buyer Account:
 * - Email: buyer@citysblock.in
 * - Password: Buyer@123
 * - Role: buyer
 * 
 * Note: These accounts need to be created in Firebase Auth and have corresponding
 * user documents in Firestore with the appropriate role field.
 */

export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@citysblock.in',
    password: 'Admin@123',
    role: 'admin',
  },
  owner: {
    email: 'owner@citysblock.in',
    password: 'Owner@123',
    role: 'owner',
  },
  buyer: {
    email: 'buyer@citysblock.in',
    password: 'Buyer@123',
    role: 'buyer',
  },
} as const;
