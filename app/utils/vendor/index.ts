// Re-export all vendor utilities from a central location
export * from './platform-vendors';
export * from './dependency-vendors';
export * from './documentation-vendors';

// Legacy export for backward compatibility
export { getVendorDetails, generateVendorComparison } from './platform-vendors';
