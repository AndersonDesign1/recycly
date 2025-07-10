"use client"

import { useState, useEffect } from "react"
import type { User, Session } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setSession(data.session)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      setUser(null)
      setSession(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  }
}
