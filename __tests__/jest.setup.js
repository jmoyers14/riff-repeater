import jestChrome from "jest-chrome";
import { jest } from "@jest/globals";

global.jest = jest;
Object.assign(global, jestChrome);
