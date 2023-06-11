export type StorageStrategyIdentifier = 'file' | 'firebase' | 's3';

export interface AppConfig {
  protocol: string;
  domain: string;
  port: number;
  nextauthUrl: string;
  maxPayloadSize: string;
  serverSideProxy?: string;
  sessionSecret: string;
}

export interface DatabaseConfig {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface FileStorageConfig {
  location: string;
}

export interface FirebaseStorageConfig {
  serviceAccount: string;
  bucket: string;
}

export interface S3StorageConfig {
  endpoint: string;
  key: string;
  secret: string;
  bucket: string;
}

export interface StorageConfig {
  strategy: StorageStrategyIdentifier;

  file?: FileStorageConfig;
  firebase?: FirebaseStorageConfig;
  s3?: S3StorageConfig;
}

export interface EmailConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  emailFrom: string;
  contactEmail: string;
}

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
}

export type FacebookOAuthProviderConfig = OAuthProviderConfig;

export type GoogleOAuthProviderConfig = OAuthProviderConfig;

export type TwitterOAuthProviderConfig = OAuthProviderConfig;

export interface AuthConfig {
  facebook?: FacebookOAuthProviderConfig;
  google?: GoogleOAuthProviderConfig;
  twitter?: TwitterOAuthProviderConfig;
}

export interface AvdhConfig {
  key?: string;
  password?: string;
}

export interface IConfig {
  app: AppConfig;
  database: DatabaseConfig;
  storage: StorageConfig;
  email: EmailConfig;
  avdh: AvdhConfig;
  auth: AuthConfig;
}
