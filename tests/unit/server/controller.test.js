import { jest, expect, describe, test } from "@jest/globals";
import config from "../../../server/config.js";
import TestUtil from "../_util/testUtil.js";
import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";

const { pages } = config;

describe("Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test("getFileStream - Should return a fileStream", async () => {
    const mockFileStream = TestUtil.generateReadableStream(["data"]);
    const expectedType = ".html";
    const controller = new Controller();

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    const { stream, type } = await controller.getFileStream(pages.homeHTML);

    expect(stream).toStrictEqual(mockFileStream)
    expect(type).toStrictEqual(expectedType)
  });
});
