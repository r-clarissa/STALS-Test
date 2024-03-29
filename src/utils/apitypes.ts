import { AccommodationType, UserType } from "@prisma/client";
import { z } from "zod";

/* ACCOMMODATION */

export const accommodationGetManyExperiementSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  landlord: z.string().optional(),
  barangay: z.string().optional(),
  num_of_rooms: z.number().optional(),
  typeArray: z.array(z.string()).optional(),
  tagArray: z.string().array().optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  showAll: z.boolean().optional(),
  limit: z.number().min(1).max(100).nullish(),
  sortByName: z.boolean().nullish(),
  sortByRating: z.boolean().nullish(),
  sortByPrice: z.boolean().nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export const accommodationAddSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Must not be empty" })
    .regex(/^[\w\s'"-]*[\w'"-][\w\s'"-]*$/, {
      message:
        "Accommodation Name must only contain alphanumerics, apostrophes, double quotes, hyphens and spaces.",
    }),
  street_number: z
    .string()
    .min(1, { message: "Must not be empty." })
    .regex(/\d+/),
  subdivision: z
    .string()
    .min(1, { message: "Must not be empty" })
    .regex(/^[\w\s'"-]*[\w'"-][\w\s'"-]*$/, {
      message:
        "Subdivision must only contain alphanumerics, apostrophes, double quotes, hyphens and spaces",
    }),
  barangay: z.string().min(1),
  location: z.string(),
  contract_length: z.string(),
  contact_number: z.string().regex(/^09\d{9}$/, {
    message: "Must be a valid phone number. e.g. (09123456789)",
  }),
  price: z
    .string()
    .min(1, { message: "Price must contain at least 1 digit(s)" })
    .max(15, { message: "Price must contain at most 15 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Price must be a positive number",
    }),
  fb_page: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(
          /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/,
          { message: "Must be a valid facebook link." },
        ),
    ),
  type: z.nativeEnum(AccommodationType),
  typeArray: z
    .array(z.string())
    .nonempty({ message: "Must select at least one type" }),
  tagArray: z.array(z.string()).optional(),
});

export const accommodationEditSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Must not be empty" })
    .regex(/^[\w\s'"-]*[\w'"-][\w\s'"-]*$/, {
      message:
        "Accommodation Name must only contain alphanumerics, apostrophes, double quotes, hyphens and spaces.",
    }),
  location: z.string().optional(),
  contract_length: z.string().optional(),
  contact_number: z.string().regex(/^09\d{9}$/, {
    message: "Must be a valid phone number. e.g. (09123456789)",
  }),
  fb_page: z
    .string()
    .optional()
    .or(
      z
        .string()
        .regex(
          /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/,
          { message: "Must be a valid facebook link." },
        ),
    ),
  price: z
    .string()
    .min(1, { message: "Price must contain at least 1 digit(s)" })
    .max(15, { message: "Price must contain at most 15 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Price must be a positive number",
    }),
  //   TODO: bring this back
  //   street_number: z.string().min(1),
  //   subdivision: z.string().min(1),
  //   barangay: z.string().min(1),
  //   price: z.number(),
  //   // num_of_rooms: z.number().optional(),
  //   is_archived: z.boolean(),
  typeArray: z
    .array(z.string())
    .nonempty({ message: "Must select at least one type" })
    .min(1, { message: "Must select at least one type" }),
  tagArray: z.array(z.string()).optional(),
});

/* USER */

export const userEditSchema = z.object({
  first_name: z
    .string()
    .regex(/^(?=.*\w)[\w\s]+$/)
    .min(1)
    .optional(),
  middle_name: z.string().optional(),
  last_name: z
    .string()
    .regex(/^(?=.*\w)[\w\s]+$/)
    .min(1)
    .optional(),
  Suffix: z.string().optional(),
  contact_number: z
    .string()
    .regex(/^09\d{9}$/, {
      message: "Must be a valid phone number. e.g. (09123456789)",
    })
    .optional(),
  type: z.nativeEnum(UserType),
});

/* REVIEW */

export const reviewAddSchema = z.object({
  accommodationId: z.string(),
  review: z.string().optional(),
  rating: z.number().gte(1, { message: "Rating must be atleast 1!" }).lte(5),
  time: z.string().optional(),
  date: z.string().optional(),
});

export const reviewEditSchema = z.object({
  id: z.string(),
  review: z.string().optional(),
  rating: z.number().gte(1, { message: "Rating must be atleast 1!" }).lte(5),
});

export const reviewArchiveSchema = z.object({
  id: z.string(),
  accommodationId: z.string().optional(),
  rating: z.number().optional(),
});

export const reviewGetManySchema = z.object({
  accommodationId: z.string().optional(),
  page: z.number(),
  multiplier: z.number(),
});

export const reviewGetInfSchema = z.object({
  accommodationId: z.string().optional(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type

  // page: z.number(),
  // multiplier: z.number(),
});

/* ROOM */
export const roomAddSchema = z.object({
  accommodationId: z.string().min(3),
  price: z
    .string()
    .min(1, { message: "Price must contain at least 1 digit(s)" })
    .max(15, { message: "Price must contain at most 15 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Price must be a positive number",
    }),
  num_of_beds: z
    .string()
    .min(1, { message: "Number of beds must contain at least 1 digit(s)" })
    .max(9, { message: "Number of beds must contain at most 9 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Number of beds must be a positive number",
    }),
  occupied: z.boolean(),
  with_aircon: z.boolean(),
  with_utilities: z.boolean(),
});

export const roomEditSchema = z.object({
  id: z.string(),
  price: z
    .string()
    .min(1, { message: "Price must contain at least 1 digit(s)" })
    .max(15, { message: "Price must contain at most 15 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Price must be a positive number",
    }),
  num_of_beds: z
    .string()
    .min(1, { message: "Number of beds must contain at least 1 digit(s)" })
    .max(9, { message: "Number of beds must contain at most 9 digit(s)" })
    .refine((value) => parseFloat(value) > 0, {
      message: "Number of beds must be a positive number",
    }),
  occupied: z.boolean(),
  with_aircon: z.boolean(),
  with_utilities: z.boolean(),
});

export const roomGetManySchema = z.object({
  accommodationId: z.string().min(3),
  is_archived: z.boolean(),
});

export const roomGetOneSchema = z.object({
  id: z.string(),
});
