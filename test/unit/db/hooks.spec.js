import { InternalError } from '@playscode/fns/lib/errors';
import hooks from "src/db/hooks";

async function resolveTrue(model, hook) {
  // Arrange:
  let beforeCreate = jest.fn(callback => callback(model));
  let query = jest.fn((stmt, opts) => Promise.resolve("0000001"));

  // Act:
  hook({ beforeCreate }, { query });

  // Assert:
  await expect(query.mock.results[0].value).resolves.toBe("0000001");
  await expect(beforeCreate.mock.results[0].value).resolves.toBeTrue();
}

async function rejectQuery(model, hook) {
  // Arrange:
  let beforeCreate = jest.fn(callback => callback(model));
  let query = jest.fn((stmt, opts) => Promise.reject(new InternalError("x")));

  // Act:
  hook({ beforeCreate }, { query });

  // Assert:
  await expect(query.mock.results[0].value).rejects.toThrowError("x");
  await expect(beforeCreate.mock.results[0].value).rejects.toThrowError("x");
}

async function returnFalse(model, hook) {
  // Arrange:
  let beforeCreate = jest.fn(cb => cb(model));

  // Act:
  hook({ beforeCreate });

  // Assert:
  await expect(beforeCreate.mock.results[0].value).resolves.toBeFalse();
}

describe('hooks', () => {
  Object.keys(hooks).forEach(key => {
    const name = key.toLowerCase().replace("hooks", "");
    const hook = hooks[key];

    describe(name, () => {
      it('should be a function', () => {
        expect(hook).toBeFunction();
      });

      it("should return true when code is 'unset'", () => {
        resolveTrue({ code: "unset" }, hook);
      });

      it("should throw an error when query fails", () => {
        rejectQuery({ code: "unset" }, hook);
      });

      it("should return false hen the code is not 'unset'", () => {
        returnFalse({ code: "dkndkn" }, hook);
      });

      if (name.startsWith("order")) {
        it("should return true when code is 'unset' and type is 'installation'", () => {
          resolveTrue({ code: "unset", type: "installation" }, hook);
        });
        it("should return true when code is 'unset' and type is 'work'", () => {
          resolveTrue({ code: "unset", type: "work" }, hook);
        });
      } else if (name.startsWith("item")) {
        it("should return true when code is 'unset' and type is 'service'", () => {
          resolveTrue({ code: "unset", type: "service" }, hook);
        });
        it("should return true when code is 'unset' and type is 'product'", () => {
          resolveTrue({ code: "unset", type: "product" }, hook);
        });
        it("should return true when code is 'unset' and type is 'material'", () => {
          resolveTrue({ code: "unset", type: "material" }, hook);
        });
      } else if (name.startsWith("quote")) {
        it("should return true when code is 'unset' and type is 'invoice'", () => {
          resolveTrue({ code: "unset", type: "invoice" }, hook);
        });
        it("should return true when code is 'unset' and type is 'quote'", () => {
          resolveTrue({ code: "unset", type: "quote" }, hook);
        });
      }
    });
  });
});
