export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}
