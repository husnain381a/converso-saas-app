'use server'

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth()
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('companions')
    .insert({ ...formData, author })
    .select()

  if (error || !data) throw new Error(error?.message || 'Failed to create companion')

  return data[0]
}

// Function to get all companions from the database with optional filters and pagination
export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
  // Create a Supabase client instance
  const supabase = createSupabaseClient();

  // Start building the query by getting 'companions' table
  let query = supabase
    .from('companions')
    .select();

  // Apply filters if subject and topic are provided
  if (subject && topic) {
    // Filter by subject and match topic or name
    query = query
      .ilike('subject', `%${subject}%`)
      .or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
  }
  // Apply subject filter only
  else if (subject) {
    query = query.ilike('subject', `%${subject}%`);
  }
  // Apply topic filter only
  else if (topic) {
    query = query.or(`topic.ilike.%${topic}%, name.ilike.%${topic}%`);
  }

  // Apply pagination using range (start and end indexes)
  query = query.range((page - 1) * limit, page * limit - 1);

  // Execute the query and get data or error
  const { data: companions, error } = await query;

  // If there's an error, throw it
  if (error) throw new Error(error.message);

  // Return the list of companions
  return companions;
};


//Get only one companion

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) throw new Error(error?.message || "Companion not found")

  return data
}