export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  ex: number;
}

export interface HeaderConfig {
  userId: string;
  isAdmin: string;
}

export interface MailConfig {
  host: string;
  username: string;
  password: string;
  port: number;
  secure: boolean;
  from: string;
}

export interface CoreConfig {
  url: string;
}
