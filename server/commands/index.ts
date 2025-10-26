import * as setup from "./setup";
import * as ip from "./ip";
import * as checkServer from "./check-server";
import * as stopMonitoring from "./stop-monitoring";
import * as playerList from "./player-list";
import * as serverInfo from "./server-info";
import * as help from "./help";

export const commands = {
  setup,
  ip,
  "check-server": checkServer,
  "stop-monitoring": stopMonitoring,
  "player-list": playerList,
  "server-info": serverInfo,
  help,
};

export function getCommandsArray() {
  return Object.values(commands).map((cmd) => cmd.data);
}
