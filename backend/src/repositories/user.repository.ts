// User Repository - Handles all database interactions with the User model
import User from "../models/user.model.js";
import type { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
}

export class UserRepository {
  /**
   * Create a new user
   */
  async create(email: string, hashedPassword: string): Promise<IUser> {
    const user = new User({ email, password: hashedPassword });
    return await user.save();
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find a user by ID
   */
  async findById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  /**
   * Update a user's password
   */
  async updatePassword(
    userId: string,
    hashedPassword: string,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
  }

  /**
   * Delete a user by ID
   */
  async deleteById(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Check if a user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return user !== null;
  }

  /**
   * Get all users (useful for admin purposes)
   */
  async findAll(): Promise<IUser[]> {
    return await User.find().select("-password");
  }
}
