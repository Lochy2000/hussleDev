import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const hustleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  status: z.enum(['saved', 'in-progress', 'launched']),
  time_commitment: z.enum(['low', 'medium', 'high']),
  earning_potential: z.enum(['low', 'medium', 'high']),
  image: z.string().url('Please enter a valid image URL'),
  tools: z.array(z.string()),
  notes: z.string().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type HustleInput = z.infer<typeof hustleSchema>;