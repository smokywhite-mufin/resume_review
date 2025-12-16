import { BASE_URL } from "@/constants/env";
import axios from "axios";

const defaultInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default defaultInstance;
