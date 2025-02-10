"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidateId = checkValidateId;
const env_config_1 = require("../config/env.config");
const validateId = new Set();
validateId.add(Number(env_config_1.config.ADMIN_ID));
function checkValidateId(id) {
    return validateId.has(id);
}
