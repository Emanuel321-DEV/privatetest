/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test } from "@nestjs/testing";
import { WebchatGateway } from "./webchat.gateway";
import { INestApplication } from "@nestjs/common";
import { Socket, io } from "socket.io-client";

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe("WebchatGateway", () => {
  let gateway: WebchatGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(WebchatGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<WebchatGateway>(WebchatGateway);
    // Create a new client that will interact with the gateway
    ioClient = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', async () => {
    ioClient.connect();
    ioClient.emit("ping", "Hello world!");
    await new Promise<void>((resolve) => {
      ioClient.on("connect", () => {
        console.log("connected");
      });
      ioClient.on("pong", (data) => {
        expect(data).toBe("Hello world!");
        resolve();
      });
    });
    ioClient.disconnect();
  });
});