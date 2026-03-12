//commonjs 
const express = require("express")

module.exports = router

//es6
import express from "express"

export default router

module.exports = {
    login,
    register
}

export const login = () => {}

export const register = () => {}

import { login, register } from "./authController.js"