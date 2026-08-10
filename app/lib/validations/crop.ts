import { z } from "zod";

export const cropSchema = z.object({
  name: z.string().min(2, "Crop name is required"),
  imageUrl: z.string().min(1,"Please enter a valid URL"),
  description: z.string().min(10, "Description is required"),
  farmingTips: z.string().min(5, "Farming tips are required"),
  commonDiseases: z.string().min(5, "Common diseases info required"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  season: z.enum(["Summer", "Winter", "Monsoon", "All Season"]),
  location: z.string().min(2, "Location is required"),
});

export type CropInput = z.infer<typeof cropSchema>;
