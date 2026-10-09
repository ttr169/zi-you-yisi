declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    AUTH_ACCOUNTS?: string;
    AUTH_SESSION_SECRET?: string;
  }
}
