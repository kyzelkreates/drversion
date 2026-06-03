// 4P3X Package Validators — Run 9
// State-level validation for base package records.
// Powered by 4P3X Intelligent AI — Created by Kyzel Kreates

export function validateBasePackageState(basePackage) {
  if (!basePackage || typeof basePackage !== 'object') {
    return { valid: false, error: 'basePackage state section is missing or not an object.' };
  }
  if (!Array.isArray(basePackage.packages)) {
    return { valid: false, error: 'basePackage.packages must be an array.' };
  }
  if (!basePackage.locks || typeof basePackage.locks !== 'object') {
    return { valid: false, error: 'basePackage.locks must be an object.' };
  }
  if (basePackage.locks.preventSecretPackaging !== true) {
    return { valid: false, error: 'basePackage.locks.preventSecretPackaging must be true.' };
  }
  if (basePackage.locks.preventNodeModulesPackaging !== true) {
    return { valid: false, error: 'basePackage.locks.preventNodeModulesPackaging must be true.' };
  }
  return { valid: true };
}

export function validateSinglePackageRecord(record) {
  if (!record || typeof record !== 'object') return { valid: false, error: 'Package record is not an object.' };
  if (!record.id) return { valid: false, error: 'Package record missing id.' };
  if (record.type !== 'reusable_base_package') return { valid: false, error: 'Package type must be reusable_base_package.' };
  if (!record.identity?.brandingLine) return { valid: false, error: 'Package record missing branding line.' };
  return { valid: true };
}

export default { validateBasePackageState, validateSinglePackageRecord };
