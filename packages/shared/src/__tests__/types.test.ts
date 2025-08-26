import { expect, test } from "bun:test";
import { ZodUser } from "../types";

test("ZodUser validates correct user data", () => {
  const validUser = {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  expect(() => ZodUser.parse(validUser)).not.toThrow();
});

test("ZodUser validates user with optional image", () => {
  const userWithImage = {
    id: "123",
    name: "John Doe", 
    email: "john@example.com",
    image: "https://example.com/avatar.jpg",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  expect(() => ZodUser.parse(userWithImage)).not.toThrow();
});

test("ZodUser rejects invalid email", () => {
  const invalidUser = {
    id: "123",
    name: "John Doe",
    email: "not-an-email",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  expect(() => ZodUser.parse(invalidUser)).toThrow();
});

test("ZodUser rejects missing required fields", () => {
  const incompleteUser = {
    id: "123",
    name: "John Doe"
  };
  
  expect(() => ZodUser.parse(incompleteUser)).toThrow();
});