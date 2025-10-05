"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function syncWalletAddress(walletAddress: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "User not authenticated" }
  }

  // Check if wallet address is already in use by another user
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("wallet_address", walletAddress)
    .neq("id", user.id)
    .single()

  if (existingProfile) {
    return { error: "This wallet address is already connected to another account" }
  }

  // Update user profile with wallet address
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      wallet_address: walletAddress,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (updateError) {
    return { error: "Failed to sync wallet address" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/wallet")

  return { success: true }
}

export async function disconnectWallet() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "User not authenticated" }
  }

  // Remove wallet address from profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      wallet_address: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (updateError) {
    return { error: "Failed to disconnect wallet" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/wallet")

  return { success: true }
}

export async function getWalletProfile() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "User not authenticated" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("wallet_address, eco_points, total_carbon_saved, total_trips")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return { error: "Failed to fetch wallet profile" }
  }

  return { profile }
}
