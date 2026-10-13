"use client"

import * as React from "react"
import {
  Institution,
  InstitutionBranding,
  BinhiUser,
  Branch,
  Member,
  Reward,
  Transaction,
  Redemption,
  Game,
  RolePermission,
} from "@/lib/types"
import { mockInstitutions } from "@/lib/mock/institutions"
import { mockBranches } from "@/lib/mock/branches"
import { mockMembers } from "@/lib/mock/members"
import { mockRewards } from "@/lib/mock/rewards"
import { mockTransactions } from "@/lib/mock/transactions"
import { mockRedemptions } from "@/lib/mock/redemptions"
import { mockGames } from "@/lib/mock/games"
import { mockUsers } from "@/lib/mock/users"
import { mockRoles } from "@/lib/mock/roles"
import { applyInstitutionTheme } from "@/lib/theme-utils"

interface InstitutionContextValue {
  institutions: Institution[]
  activeInstitution: Institution
  setActiveInstitutionId: (id: string) => void
  authorizedInstitutions: Institution[]
  currentUser: BinhiUser
  setCurrentUserId: (id: string) => void
  allUsers: BinhiUser[]
  roles: RolePermission[]
  userPermissions: RolePermission["permissions"]
  activeBranchId: string
  setActiveBranchId: (id: string) => void
  isBranchLocked: boolean
  institutionBranches: Branch[]
  institutionMembers: Member[]
  institutionRewards: Reward[]
  institutionTransactions: Transaction[]
  institutionRedemptions: Redemption[]
  institutionGames: Game[]
  updateInstitutionBranding: (instId: string, branding: Partial<InstitutionBranding>) => void
  createRedemption: (params: {
    memberId: string
    rewardId: string
    branchId: string
  }) => { success: boolean; error?: string; redemption?: Redemption; transaction?: Transaction }
  toggleGameStatus: (gameId: string) => void
  createGame: (gameData: Omit<Game, "id" | "createdAt" | "rewardDistributed" | "playsCount">) => void
  updateGame: (gameId: string, gameData: Partial<Game>) => void
  createBranch: (branchData: Omit<Branch, "id" | "createdAt" | "updatedAt" | "memberCount" | "transactionCount" | "redemptionCount">) => void
  createReward: (rewardData: Omit<Reward, "id" | "createdAt" | "updatedAt" | "totalIssued" | "totalInCirculation">) => void
}

const InstitutionContext = React.createContext<InstitutionContextValue | null>(null)

export function InstitutionProvider({ children }: { children: React.ReactNode }) {
  const [institutions, setInstitutions] = React.useState<Institution[]>(mockInstitutions)
  const [users] = React.useState<BinhiUser[]>(mockUsers)
  const [currentUserId, setCurrentUserIdState] = React.useState<string>(mockUsers[0].id)
  const [activeInstitutionId, setActiveInstitutionIdState] = React.useState<string>(mockInstitutions[0].id)
  const [activeBranchId, setActiveBranchIdState] = React.useState<string>("ALL")

  // State collections allowing live mutations (redemptions, games, etc.)
  const [branches, setBranches] = React.useState<Branch[]>(mockBranches)
  const [members, setMembers] = React.useState<Member[]>(mockMembers)
  const [rewards, setRewards] = React.useState<Reward[]>(mockRewards)
  const [transactions, setTransactions] = React.useState<Transaction[]>(mockTransactions)
  const [redemptions, setRedemptions] = React.useState<Redemption[]>(mockRedemptions)
  const [games, setGames] = React.useState<Game[]>(mockGames)

  const currentUser = React.useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0]
  }, [users, currentUserId])

  // Compute authorized institutions for the current user
  const authorizedInstitutions = React.useMemo(() => {
    if (currentUser.role === "SUPER_ADMIN") {
      return institutions
    }
    if (currentUser.institutionId) {
      return institutions.filter((i) => i.id === currentUser.institutionId)
    }
    return [institutions[0]]
  }, [institutions, currentUser])

  // Ensure active institution is authorized
  const activeInstitution = React.useMemo(() => {
    const found = authorizedInstitutions.find((i) => i.id === activeInstitutionId)
    if (found) return found
    return authorizedInstitutions[0] || institutions[0]
  }, [authorizedInstitutions, activeInstitutionId, institutions])

  // User permissions from ARBAC role
  const userPermissions = React.useMemo(() => {
    const roleDef = mockRoles.find((r) => r.role === currentUser.role)
    return (
      roleDef?.permissions || {
        ledgerView: true,
        ledgerExport: false,
        membersView: true,
        membersManage: false,
        rewardsView: true,
        rewardsManage: false,
        redemptionsPerform: false,
        gamesManage: false,
        institutionsManage: false,
        usersManage: false,
        brandingManage: false,
      }
    )
  }, [currentUser])

  // If user has a locked branch (e.g. STORE_STAFF or STORE_MANAGER), lock activeBranchId
  const isBranchLocked = Boolean(currentUser.branchId && (currentUser.role === "STORE_STAFF" || currentUser.role === "STORE_MANAGER"))

  const effectiveBranchId = React.useMemo(() => {
    if (isBranchLocked && currentUser.branchId) {
      return currentUser.branchId
    }
    return activeBranchId
  }, [isBranchLocked, currentUser.branchId, activeBranchId])

  // Switch simulated user: when switching user, automatically align active institution and branch
  const setCurrentUserId = React.useCallback(
    (newUserId: string) => {
      const newUser = users.find((u) => u.id === newUserId)
      if (newUser) {
        setCurrentUserIdState(newUserId)
        if (newUser.institutionId) {
          setActiveInstitutionIdState(newUser.institutionId)
        }
        if (newUser.branchId) {
          setActiveBranchIdState(newUser.branchId)
        } else {
          setActiveBranchIdState("ALL")
        }
      }
    },
    [users]
  )

  const setActiveInstitutionId = React.useCallback(
    (newId: string) => {
      const isAllowed = authorizedInstitutions.some((i) => i.id === newId)
      if (isAllowed) {
        setActiveInstitutionIdState(newId)
        setActiveBranchIdState("ALL")
      }
    },
    [authorizedInstitutions]
  )

  // Dynamically apply institution theme when activeInstitution changes
  React.useEffect(() => {
    if (activeInstitution?.branding) {
      applyInstitutionTheme(activeInstitution.branding)
    }
  }, [activeInstitution])

  // Filter scoped data by current institution
  const institutionBranches = React.useMemo(() => {
    return branches.filter((b) => b.institutionId === activeInstitution.id)
  }, [branches, activeInstitution.id])

  const institutionMembers = React.useMemo(() => {
    let result = members.filter((m) => m.institutionId === activeInstitution.id)
    if (effectiveBranchId !== "ALL") {
      result = result.filter((m) => m.primaryBranchId === effectiveBranchId)
    }
    return result
  }, [members, activeInstitution.id, effectiveBranchId])

  const institutionRewards = React.useMemo(() => {
    return rewards.filter(
      (r) => r.institutionId === activeInstitution.id || r.institutionId === "GLOBAL"
    )
  }, [rewards, activeInstitution.id])

  const institutionTransactions = React.useMemo(() => {
    let result = transactions.filter((t) => t.institutionId === activeInstitution.id)
    if (effectiveBranchId !== "ALL") {
      result = result.filter((t) => t.branchId === effectiveBranchId)
    }
    return result
  }, [transactions, activeInstitution.id, effectiveBranchId])

  const institutionRedemptions = React.useMemo(() => {
    let result = redemptions.filter((r) => r.institutionId === activeInstitution.id)
    if (effectiveBranchId !== "ALL") {
      result = result.filter((r) => r.branchId === effectiveBranchId)
    }
    return result
  }, [redemptions, activeInstitution.id, effectiveBranchId])

  const institutionGames = React.useMemo(() => {
    return games.filter((g) => g.institutionId === activeInstitution.id)
  }, [games, activeInstitution.id])

  const updateInstitutionBranding = React.useCallback(
    (instId: string, updatedBranding: Partial<InstitutionBranding>) => {
      setInstitutions((prev) =>
        prev.map((inst) => {
          if (inst.id === instId) {
            const newBranding = { ...inst.branding, ...updatedBranding }
            applyInstitutionTheme(newBranding)
            return {
              ...inst,
              branding: newBranding,
              updatedAt: new Date().toISOString(),
            }
          }
          return inst
        })
      )
    },
    []
  )

  const toggleGameStatus = React.useCallback((gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, status: g.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : g))
    )
  }, [])

  const createGame = React.useCallback(
    (gameData: Omit<Game, "id" | "createdAt" | "rewardDistributed" | "playsCount">) => {
      const newGame: Game = {
        ...gameData,
        id: `game-${Date.now()}`,
        rewardDistributed: 0,
        playsCount: 0,
        createdAt: new Date().toISOString(),
      }
      setGames((prev) => [newGame, ...prev])
    },
    []
  )

  const updateGame = React.useCallback((gameId: string, gameData: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, ...gameData } : g))
    )
  }, [])

  const createBranch = React.useCallback(
    (branchData: Omit<Branch, "id" | "createdAt" | "updatedAt" | "memberCount" | "transactionCount" | "redemptionCount">) => {
      const newBranch: Branch = {
        ...branchData,
        id: `branch-${Date.now()}`,
        memberCount: 0,
        transactionCount: 0,
        redemptionCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setBranches((prev) => [...prev, newBranch])
    },
    []
  )

  const createReward = React.useCallback(
    (rewardData: Omit<Reward, "id" | "createdAt" | "updatedAt" | "totalIssued" | "totalInCirculation">) => {
      const newReward: Reward = {
        ...rewardData,
        id: `rew-${Date.now()}`,
        totalIssued: 0,
        totalInCirculation: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setRewards((prev) => [...prev, newReward])
    },
    []
  )

  // Double-entry balanced redemption creation
  const createRedemption = React.useCallback(
    ({
      memberId,
      rewardId,
      branchId,
    }: {
      memberId: string
      rewardId: string
      branchId: string
    }) => {
      const member = members.find((m) => m.id === memberId)
      if (!member) return { success: false, error: "Member not found" }

      const reward = rewards.find((r) => r.id === rewardId)
      if (!reward) return { success: false, error: "Reward not found" }

      const pointsCost = reward.costInPoints || 0
      const currentPoints = member.balances["POINT"] || 0

      if (currentPoints < pointsCost) {
        return {
          success: false,
          error: `Insufficient point balance. Member has ${currentPoints.toLocaleString()} points, requires ${pointsCost.toLocaleString()} points.`,
        }
      }

      const timestamp = new Date().toISOString()
      const txnRef = `TXN-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`
      const redemptionCode = `RED-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`
      const txnId = `txn-${Date.now()}`
      const redId = `red-${Date.now()}`

      // 1. Immutable Balanced Ledger Transaction
      // Balanced: DEBIT Member Account, CREDIT Redemption Account
      const newTxn: Transaction = {
        id: txnId,
        reference: txnRef,
        institutionId: member.institutionId,
        branchId: branchId || member.primaryBranchId,
        type: "OTHER",
        rewardCode: "POINT",
        changeAmount: -pointsCost,
        sourceSystem: "In-Store Point of Redemption Terminal",
        sourceReference: redemptionCode,
        idempotencyKey: `idemp-red-${Date.now()}`,
        description: `Member redemption fulfillment for ${reward.name} (${reward.code})`,
        createdAt: timestamp,
        entries: [
          {
            id: `ent-${Date.now()}-1`,
            accountName: `Member ${member.externalReference} (${member.name})`,
            accountType: "MEMBER",
            entryType: "DEBIT",
            amount: pointsCost,
            rewardCode: "POINT",
          },
          {
            id: `ent-${Date.now()}-2`,
            accountName: "Store Redemption Settlement Account",
            accountType: "REDEMPTION",
            entryType: "CREDIT",
            amount: pointsCost,
            rewardCode: "POINT",
          },
        ],
        memberImpacts: [
          {
            memberId: member.id,
            memberReference: member.externalReference,
            memberName: member.name,
            rewardCode: "POINT",
            beforeBalance: currentPoints,
            change: -pointsCost,
            afterBalance: currentPoints - pointsCost,
          },
        ],
      }

      // 2. Redemption Record
      const newRedemption: Redemption = {
        id: redId,
        redemptionCode,
        memberId: member.id,
        memberReference: member.externalReference,
        memberName: member.name,
        rewardId: reward.id,
        rewardName: reward.name,
        rewardCode: reward.code,
        rewardType: reward.type,
        pointsSpent: pointsCost,
        branchId: branchId || member.primaryBranchId,
        institutionId: member.institutionId,
        transactionId: txnId,
        transactionReference: txnRef,
        createdAt: timestamp,
      }

      // Update Member state
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === memberId) {
            const updatedBalances: Record<string, number> = {
              ...m.balances,
              POINT: currentPoints - pointsCost,
            }
            if (reward.mode === "CODE") {
              updatedBalances[reward.code] = (updatedBalances[reward.code] || 0) + 1
            }
            return {
              ...m,
              balances: updatedBalances,
              totalPointsRedeemed: m.totalPointsRedeemed + pointsCost,
              updatedAt: timestamp,
            }
          }
          return m
        })
      )

      // Update Reward circulation
      setRewards((prev) =>
        prev.map((r) => {
          if (r.id === rewardId) {
            return {
              ...r,
              totalInCirculation: r.totalInCirculation + 1,
              updatedAt: timestamp,
            }
          }
          return r
        })
      )

      // Append Transaction and Redemption
      setTransactions((prev) => [newTxn, ...prev])
      setRedemptions((prev) => [newRedemption, ...prev])

      return {
        success: true,
        redemption: newRedemption,
        transaction: newTxn,
      }
    },
    [members, rewards]
  )

  const value: InstitutionContextValue = {
    institutions,
    activeInstitution,
    setActiveInstitutionId,
    authorizedInstitutions,
    currentUser,
    setCurrentUserId,
    allUsers: users,
    roles: mockRoles,
    userPermissions,
    activeBranchId: effectiveBranchId,
    setActiveBranchId: setActiveBranchIdState,
    isBranchLocked,
    institutionBranches,
    institutionMembers,
    institutionRewards,
    institutionTransactions,
    institutionRedemptions,
    institutionGames,
    updateInstitutionBranding,
    createRedemption,
    toggleGameStatus,
    createGame,
    updateGame,
    createBranch,
    createReward,
  }

  return <InstitutionContext.Provider value={value}>{children}</InstitutionContext.Provider>
}

export function useInstitution() {
  const context = React.useContext(InstitutionContext)
  if (!context) {
    throw new Error("useInstitution must be used within an InstitutionProvider")
  }
  return context
}
