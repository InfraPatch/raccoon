export type StorageStrategyIdentifier = 'file' | 'firebase' | 's3';

export interface AppConfig {
  protocol: string;
  domain: string;
  port: number;
  nextauthUrl: string;
  maxPayloadSize: string;
  serverSideProxy?: string;
};

export interface DatabaseConfig {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
};

export interface FileStorageConfig {
  location: string;
};

export interface FirebaseStorageConfig {
  serviceAccount: string;
  bucket: string;
};

export interface S3StorageConfig {
  endpoint: string;
  key: string;
  secret: string;
  bucket: string;
};

export interface StorageConfig {
  strategy: StorageStrategyIdentifier;

  file?: FileStorageConfig;
  firebase?: FirebaseStorageConfig;
  s3?: S3StorageConfig;
};

export interface EmailConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  emailFrom: string;
  contactEmail: string;
};

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
};

export interface FacebookOAuthProviderConfig extends OAuthProviderConfig {};

export interface GoogleOAuthProviderConfig extends OAuthProviderConfig { };

export interface TwitterOAuthProviderConfig extends OAuthProviderConfig { };

export interface AuthConfig {
  facebook?: FacebookOAuthProviderConfig;
  google?: GoogleOAuthProviderConfig;
  twitter?: TwitterOAuthProviderConfig;
};

export interface IConfig {
  app: AppConfig;
  database: DatabaseConfig;
  storage: StorageConfig;
  email: EmailConfig;
  auth: AuthConfig;
};
