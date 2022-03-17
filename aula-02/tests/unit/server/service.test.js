import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";
import config from "../../../server/config.js";
import fs from "fs";
import fsPromises from "fs/promises";
import { join } from "path";

const {
  dir: { publicDirectory },
} = config;

describe("Service", () => {
  const service = new Service();

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('createFileStream, should create a file', () => {
    const mockReadableStream = TestUtil.generateReadableStream(['data'])
    const fileName = 'file.mp3'

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(mockReadableStream)

    const service = new Service()
    const result = service.createFileStream(fileName)

    expect(result).toStrictEqual(mockReadableStream)
    expect(fs.createReadStream).toHaveBeenCalledWith(fileName)
  })

  test("getFileInfo - should return an object with name and type", async () => {
    const fileName = "any-song.mp3";
    const filePath = join(publicDirectory, fileName);
    const expectedResult = {
      type: ".mp3",
      name: filePath,
    };

    jest.spyOn(fsPromises, fsPromises.access.name).mockReturnValue();

    const result = await service.getFileInfo(fileName);

    expect(result).toStrictEqual(expectedResult);
  });

  test("getFileStream - should return a fileStream", async () => {
    const fileName = "any-song.mp3";
    const filePath = join(publicDirectory, fileName);
    const mockReadableStream = TestUtil.generateReadableStream(["data"]);

    const fileInfo = {
      type: ".mp3",
      name: filePath,
    };

    const service = new Service();

    jest.spyOn(service, service.getFileInfo.name).mockResolvedValue(fileInfo);

    jest
      .spyOn(service, service.createFileStream.name)
      .mockReturnValue(mockReadableStream);

    const result = await service.getFileStream(fileName);
    const expectedResult = {
      type: fileInfo.type,
      stream: mockReadableStream,
    };
    expect(result).toStrictEqual(expectedResult);
    expect(service.createFileStream).toHaveBeenCalledWith(fileInfo.name);

    expect(service.getFileInfo).toHaveBeenCalledWith(fileName);
  });
});
