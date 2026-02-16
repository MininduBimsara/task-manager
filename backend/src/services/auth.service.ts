// Auth Service - Handles authentication business logic
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository.js";

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: string;
}

export class AuthService {
  private userRepository: UserRepository;
  private readonly SALT_ROUNDS = 10;
  private readonly JWT_EXPIRY = "1h";

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   * - Checks if user already exists
   * - Hashes the password with bcryptjs
   * - Creates the user in the database
   */
  async register(registerData: RegisterDTO): Promise<AuthResponse> {
    try {
      const { email, password } = registerData;

      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password are required",
        };
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: "User already exists",
        };
      }

      // Hash the password
      const hashedPassword = await this.hashPassword(password);

      // Create the user
      const user = await this.userRepository.create(email, hashedPassword);

      return {
        success: true,
        message: "User registered successfully",
        userId: user._id.toString(),
      };
    } catch (error) {
      // Log the error internally but don't expose stack trace to client
      console.error("Error during registration:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }

  /**
   * Login a user
   * - Validates credentials
   * - Compares password with stored hash
   * - Generates JWT token if successful
   */
  async login(loginData: LoginDTO): Promise<AuthResponse> {
    try {
      const { email, password } = loginData;

      // Validate input
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password are required",
        };
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      // Compare password with stored hash
      const isPasswordValid = await this.verifyPassword(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      // Generate JWT token
      const token = this.generateToken(user._id.toString());

      return {
        success: true,
        message: "Login successful",
        token,
        userId: user._id.toString(),
      };
    } catch (error) {
      // Log the error internally but don't expose stack trace to client
      console.error("Error during login:", error);
      return {
        success: false,
        message: "An error occurred during login",
      };
    }
  }

  /**
   * Hash a password using bcryptjs
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Verify a password against a hash
   */
  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token
   */
  private generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign({ userId }, jwtSecret, { expiresIn: this.JWT_EXPIRY });
  }

  /**
   * Verify a JWT token
   */
  verifyToken(token: string): { userId: string } | null {
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const decoded = jwt.verify(token, jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }
}
