import { LanguagesEnum } from './i18n';

export const AUTH_MESSAGES = {
  [LanguagesEnum.en]: {
    // Authentication errors
    TOKEN_REQUIRED: 'Authentication token is required',
    TOKEN_EXPIRED: 'JWT token has expired',
    TOKEN_INVALID: 'Invalid JWT token',
    ANONYMOUS_NOT_ALLOWED: 'Anonymous access is not allowed',
    JWT_SECRET_NOT_CONFIGURED: 'JWT secret is not configured',
    
    // Permission errors
    UNAUTHORIZED: 'You are not authorized to access this resource',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    
    // General auth messages
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    EMAIL_VERIFICATION_SENT: 'Email verification sent',
    EMAIL_VERIFIED: 'Email verified successfully',
    
    // Form labels and placeholders
    EMAIL: 'Email',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    FIRST_NAME: 'First Name',
    LAST_NAME: 'Last Name',
    LOGIN: 'Login',
    REGISTER: 'Register',
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up',
    FORGOT_PASSWORD: 'Forgot Password?',
    RESET_PASSWORD: 'Reset Password',
    REMEMBER_ME: 'Remember Me',
    
    // Button labels
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    CONTINUE: 'Continue',
    BACK: 'Back',
    SEND_RESET_LINK: 'Send Reset Link',
    
    // Validation messages
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_CONFIRMATION_REQUIRED: 'Password confirmation is required',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
  },
  [LanguagesEnum.fr]: {
    // Authentication errors
    TOKEN_REQUIRED: 'Un jeton d\'authentification est requis',
    TOKEN_EXPIRED: 'Le jeton JWT a expiré',
    TOKEN_INVALID: 'Jeton JWT invalide',
    ANONYMOUS_NOT_ALLOWED: 'L\'accès anonyme n\'est pas autorisé',
    JWT_SECRET_NOT_CONFIGURED: 'Le secret JWT n\'est pas configuré',
    
    // Permission errors
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé(e) à accéder à cette ressource',
    INSUFFICIENT_PERMISSIONS: 'Permissions insuffisantes',
    
    // General auth messages
    LOGIN_SUCCESS: 'Connexion réussie',
    LOGOUT_SUCCESS: 'Déconnexion réussie',
    REGISTRATION_SUCCESS: 'Inscription réussie',
    PASSWORD_RESET_SENT: 'E-mail de réinitialisation du mot de passe envoyé',
    PASSWORD_RESET_SUCCESS: 'Réinitialisation du mot de passe réussie',
    EMAIL_VERIFICATION_SENT: 'E-mail de vérification envoyé',
    EMAIL_VERIFIED: 'E-mail vérifié avec succès',
    
    // Form labels and placeholders
    EMAIL: 'E-mail',
    PASSWORD: 'Mot de passe',
    CONFIRM_PASSWORD: 'Confirmer le mot de passe',
    FIRST_NAME: 'Prénom',
    LAST_NAME: 'Nom',
    LOGIN: 'Connexion',
    REGISTER: 'S\'inscrire',
    SIGN_IN: 'Se connecter',
    SIGN_UP: 'Créer un compte',
    FORGOT_PASSWORD: 'Mot de passe oublié ?',
    RESET_PASSWORD: 'Réinitialiser le mot de passe',
    REMEMBER_ME: 'Se souvenir de moi',
    
    // Button labels
    SUBMIT: 'Valider',
    CANCEL: 'Annuler',
    SAVE: 'Enregistrer',
    CONTINUE: 'Continuer',
    BACK: 'Retour',
    SEND_RESET_LINK: 'Envoyer le lien de réinitialisation',
    
    // Validation messages
    EMAIL_REQUIRED: 'L\'e-mail est requis',
    EMAIL_INVALID: 'Veuillez saisir une adresse e-mail valide',
    PASSWORD_REQUIRED: 'Le mot de passe est requis',
    PASSWORD_MIN_LENGTH: 'Le mot de passe doit contenir au moins 8 caractères',
    PASSWORD_CONFIRMATION_REQUIRED: 'La confirmation du mot de passe est requise',
    PASSWORDS_DO_NOT_MATCH: 'Les mots de passe ne correspondent pas',
    FIRST_NAME_REQUIRED: 'Le prénom est requis',
    LAST_NAME_REQUIRED: 'Le nom est requis',
  },
  [LanguagesEnum.ar]: {
    // Authentication errors
    TOKEN_REQUIRED: 'رمز المصادقة مطلوب',
    TOKEN_EXPIRED: 'انتهت صلاحية رمز JWT',
    TOKEN_INVALID: 'رمز JWT غير صالح',
    ANONYMOUS_NOT_ALLOWED: 'الوصول المجهول غير مسموح',
    JWT_SECRET_NOT_CONFIGURED: 'سر JWT غير مكون',
    
    // Permission errors
    UNAUTHORIZED: 'غير مصرح لك بالوصول إلى هذا المورد',
    INSUFFICIENT_PERMISSIONS: 'صلاحيات غير كافية',
    
    // General auth messages
    LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
    LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح',
    REGISTRATION_SUCCESS: 'تم التسجيل بنجاح',
    PASSWORD_RESET_SENT: 'تم إرسال بريد إعادة تعيين كلمة المرور',
    PASSWORD_RESET_SUCCESS: 'تم إعادة تعيين كلمة المرور بنجاح',
    EMAIL_VERIFICATION_SENT: 'تم إرسال بريد التحقق',
    EMAIL_VERIFIED: 'تم التحقق من البريد الإلكتروني بنجاح',
    
    // Form labels and placeholders
    EMAIL: 'البريد الإلكتروني',
    PASSWORD: 'كلمة المرور',
    CONFIRM_PASSWORD: 'تأكيد كلمة المرور',
    FIRST_NAME: 'الاسم الأول',
    LAST_NAME: 'اسم العائلة',
    LOGIN: 'تسجيل الدخول',
    REGISTER: 'التسجيل',
    SIGN_IN: 'تسجيل الدخول',
    SIGN_UP: 'إنشاء حساب',
    FORGOT_PASSWORD: 'نسيت كلمة المرور؟',
    RESET_PASSWORD: 'إعادة تعيين كلمة المرور',
    REMEMBER_ME: 'تذكرني',
    
    // Button labels
    SUBMIT: 'إرسال',
    CANCEL: 'إلغاء',
    SAVE: 'حفظ',
    CONTINUE: 'متابعة',
    BACK: 'رجوع',
    SEND_RESET_LINK: 'إرسال رابط الإعادة',
    
    // Validation messages
    EMAIL_REQUIRED: 'البريد الإلكتروني مطلوب',
    EMAIL_INVALID: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    PASSWORD_REQUIRED: 'كلمة المرور مطلوبة',
    PASSWORD_MIN_LENGTH: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل',
    PASSWORD_CONFIRMATION_REQUIRED: 'تأكيد كلمة المرور مطلوب',
    PASSWORDS_DO_NOT_MATCH: 'كلمات المرور غير متطابقة',
    FIRST_NAME_REQUIRED: 'الاسم الأول مطلوب',
    LAST_NAME_REQUIRED: 'اسم العائلة مطلوب',
  },
};

export type MessageKey = keyof typeof AUTH_MESSAGES[LanguagesEnum.en];

export function getMessage(key: MessageKey, language: LanguagesEnum = LanguagesEnum.en): string {
  return AUTH_MESSAGES[language]?.[key] || AUTH_MESSAGES[LanguagesEnum.en][key];
}