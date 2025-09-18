// Auto-generated types from translation files
// Run: bun run src/shared/i18n/generate-types.ts

export type CommonKeys = 'welcome' | 'hello' | 'goodbye' | 'loading' | 'save' | 'cancel' | 'delete' | 'edit' | 'create' | 'update' | 'search' | 'filter' | 'sort' | 'export' | 'import' | 'download' | 'upload' | 'submit' | 'reset' | 'back' | 'next' | 'previous' | 'close' | 'open' | 'view' | 'details' | 'settings' | 'profile' | 'logout' | 'login' | 'register' | 'forgot_password' | 'reset_password' | 'change_password' | 'email' | 'password' | 'confirm_password' | 'name' | 'first_name' | 'last_name' | 'phone' | 'address' | 'city' | 'country' | 'zip_code' | 'date' | 'time' | 'status' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'success' | 'error' | 'warning' | 'info';

export type ErrorsKeys = 'internal_server_error' | 'not_found' | 'unauthorized' | 'forbidden' | 'bad_request' | 'validation_failed' | 'duplicate_entry' | 'invalid_credentials' | 'account_locked' | 'account_disabled' | 'email_not_verified' | 'password_too_weak' | 'password_mismatch' | 'invalid_email' | 'invalid_phone' | 'required_field' | 'min_length' | 'max_length' | 'invalid_format' | 'file_too_large' | 'unsupported_file_type' | 'network_error' | 'timeout' | 'rate_limit_exceeded' | 'maintenance_mode' | 'feature_unavailable' | 'database_error' | 'external_service_error' | 'insufficient_permissions' | 'resource_conflict' | 'invalid_token' | 'token_expired' | 'user_not_found' | 'tenant_not_found' | 'role_not_found' | 'notification_failed' | 'unauthorized_tenant' | 'invalid_permissions_structure' | 'cannot_modify_system_roles' | 'cannot_delete_system_roles' | 'failed_to_send_email' | 'failed_to_load_email_template' | 'jwt_secret_not_configured' | 'jwt_token_expired' | 'invalid_jwt_token' | 'authentication_token_required' | 'anonymous_access_not_allowed' | 'activity_not_found' | 'activity_update_failed';

export type ValidationKeys = 'email.required' | 'email.invalid' | 'email.already_exists' | 'email.not_found' | 'password.required' | 'password.too_short' | 'password.too_long' | 'password.weak' | 'password.mismatch' | 'password.current_required' | 'password.new_required' | 'name.required' | 'name.too_short' | 'name.too_long' | 'name.invalid_characters' | 'first_name.required' | 'first_name.too_short' | 'first_name.too_long' | 'last_name.required' | 'last_name.too_short' | 'last_name.too_long' | 'phone.required' | 'phone.invalid' | 'phone.format' | 'address.required' | 'address.too_short' | 'address.too_long' | 'city.required' | 'city.too_short' | 'city.too_long' | 'country.required' | 'country.invalid' | 'zip_code.required' | 'zip_code.invalid' | 'zip_code.format' | 'date.required' | 'date.invalid' | 'date.past' | 'date.future' | 'date.format' | 'time.required' | 'time.invalid' | 'time.format' | 'file.required' | 'file.too_large' | 'file.invalid_type' | 'file.corrupted' | 'url.required' | 'url.invalid' | 'url.protocol' | 'number.required' | 'number.invalid' | 'number.min' | 'number.max' | 'number.positive' | 'number.negative' | 'number.integer' | 'number.decimal';

export type MessagesKeys = 'user.created' | 'user.updated' | 'user.deleted' | 'user.activated' | 'user.deactivated' | 'user.password_changed' | 'user.profile_updated' | 'user.email_verified' | 'user.password_reset_sent' | 'user.password_reset_successful' | 'user.login_successful' | 'user.logout_successful' | 'user.registration_successful' | 'user.account_created' | 'tenant.created' | 'tenant.updated' | 'tenant.deleted' | 'tenant.activated' | 'tenant.deactivated' | 'tenant.user_added' | 'tenant.user_removed' | 'tenant.role_assigned' | 'tenant.role_revoked' | 'role.created' | 'role.updated' | 'role.deleted' | 'role.permissions_updated' | 'notification.sent' | 'notification.delivered' | 'notification.read' | 'notification.deleted' | 'notification.bulk_deleted' | 'notification.settings_updated' | 'system.maintenance_mode' | 'system.backup_created' | 'system.backup_restored' | 'system.settings_updated' | 'system.cache_cleared' | 'system.logs_exported' | 'api.rate_limit_warning' | 'api.deprecated_endpoint' | 'api.version_mismatch' | 'api.feature_flag_disabled' | 'email.sent' | 'email.delivered' | 'email.bounced' | 'email.failed' | 'email.template_not_found' | 'email.invalid_recipient' | 'file.uploaded' | 'file.downloaded' | 'file.deleted' | 'file.processed' | 'file.converted' | 'file.compressed';

// Combined type for all translation keys
export type AllTranslationKeysWithNs = 
  | `common:${CommonKeys}`
  | `errors:${ErrorsKeys}`
  | `validation:${ValidationKeys}`
  | `messages:${MessagesKeys}`;

// All translation keys
export type AllTranslationKeys =
  | CommonKeys
  | ErrorsKeys
  | ValidationKeys
  | MessagesKeys;

// Namespace type
export type Namespace = 'common' | 'errors' | 'validation' | 'messages';

// Context types for interpolation
export interface CommonContext {
  name?: string;
}

export interface ValidationContext {
  min?: number;
  max?: number;
  types?: string;
}

export interface MessageContext {
  [key: string]: unknown;
}

export interface ErrorsContext {
  [key: string]: unknown;
}


export type TranslationContext = CommonContext | ValidationContext | MessageContext | ErrorsContext;
