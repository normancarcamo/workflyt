import { is } from '@playscode/fns';

describe("Environmental variables:", () => {
  describe("base:", () => {
    it("expect APP_NAME have a value", () => {
      expect(process.env.APP_NAME).toBeDefined();
      expect(is.empty(process.env.APP_NAME)).toBe(false);
    });
    it("expect NODE_ENV to be defined and have a valid value", () => {
      expect(process.env.NODE_ENV).toBeDefined();
      expect(is.string(process.env.NODE_ENV)).toBe(true);
      expect(is.empty(process.env.NODE_ENV)).toBe(false);
    });
  });
  describe("server:", () => {
    it("expect var SERVER_IP to be a valid IPV4 address", () => {
      expect(process.env.SERVER_IP).toBeDefined();
      expect(is.ipv4(process.env.SERVER_IP)).toBe(true);
    });
    it("expect SERVER_PORT to be a valid PORT number", () => {
      expect(process.env.SERVER_PORT).toBeDefined();
      expect(is.integer(process.env.SERVER_PORT)).toBe(true);
      expect(process.env.SERVER_PORT).toBeWithin(1, 65535);
    });
  });
  describe("logger:", () => {
    it("expect LOG_LEVEL to be a valid error level", () => {
      expect(process.env.LOG_LEVEL).toBeDefined();
      expect(is.empty(process.env.LOG_LEVEL)).toBe(false);
      expect(process.env.LOG_LEVEL).toBeOneOf([
        'fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'
      ]);
    });
    it("expect LOG_ENABLED to be a valid boolean type value", () => {
      expect(process.env.LOG_ENABLED).toBeDefined();
      expect(JSON.parse(process.env.LOG_ENABLED)).toBeBoolean();
    });
    it("expect LOG_PRETTY_PRINT to be a valid boolean type value", () => {
      expect(process.env.LOG_PRETTY_PRINT).toBeDefined();
      expect(JSON.parse(process.env.LOG_PRETTY_PRINT)).toBeBoolean();
    });
  });
  describe("database:", () => {
    it("expect DATABASE_HOST to be a valid IPV4 address", () => {
      expect(process.env.DATABASE_HOST).toBeDefined();
      expect(is.ipv4(process.env.DATABASE_HOST)).toBe(true);
    });
    it("expect DATABASE_PORT to be a valid PORT number", () => {
      expect(process.env.DATABASE_PORT).toBeDefined();
      expect(is.integer(process.env.DATABASE_PORT)).toBe(true);
      expect(process.env.DATABASE_PORT).toBeWithin(1, 65535);
    });
    it("expect DATABASE_NAME to have a valid value", () => {
      expect(process.env.DATABASE_NAME).toBeDefined();
      expect(is.string(process.env.DATABASE_NAME)).toBe(true);
      expect(is.empty(process.env.DATABASE_NAME)).toBe(false);
    });
    it("expect DATABASE_PASS to have a valid value", () => {
      expect(process.env.DATABASE_PASS).toBeDefined();
      expect(is.string(process.env.DATABASE_PASS)).toBe(true);
      expect(is.empty(process.env.DATABASE_PASS)).toBe(false);
    });
    it("expect DATABASE_URL to have a valid value", () => {
      expect(process.env.DATABASE_URL).toBeDefined();
      expect(is.string(process.env.DATABASE_URL)).toBe(true);
      expect(is.empty(process.env.DATABASE_URL)).toBe(false);
    });
  });
  describe("cookie:", () => {
    it("expect COOKIE_SECRET to have a valid value", () => {
      expect(process.env.COOKIE_SECRET).toBeDefined();
      expect(is.string(process.env.COOKIE_SECRET)).toBe(true);
      expect(is.empty(process.env.COOKIE_SECRET)).toBe(false);
    });
  });
});
