export type ARBACRole =
  | "SUPER_ADMIN"
  | "INSTITUTION_ADMIN"
  | "STORE_MANAGER"
  | "STORE_STAFF"
  | "VIEWER"

export type TransactionType =
  | "ISSUE"
  | "TRANSFER"
  | "ADJUSTMENT"
  | "REVERSAL"
  | "OTHER"

export type RewardType =
  | "POINT"
  | "TICKET"
  | "VOUCHER"
  | "COUPON"
  | "ITEM"
  | "OTHER"

export interface InstitutionBranding {
  primaryColor: string
  primaryForeground: string
  accentColor: string
  slogan: string
  currencyName: string
  logoText: string
  borderRadius?: string
}

export interface Institution {
  id: string
  code: string
  name: string
  plan: "Enterprise" | "Business" | "Startup" | "Standard"
  status: "ACTIVE" | "INACTIVE"
  description: string
  branding: InstitutionBranding
  branchCount: number
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface Branch {
  id: string
  branchCode: string
  name: string
  address: string
  city: string
  contactEmail: string
  contactPhone: string
  status: "ACTIVE" | "INACTIVE"
  institutionId: string
  memberCount: number
  transactionCount: number
  redemptionCount: number
  metadata?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface BinhiUser {
  id: string
  name: string
  email: string
  avatar: string
  role: ARBACRole
  institutionId?: string // undefined for SUPER_ADMIN
  branchId?: string // defined for STORE_MANAGER, STORE_STAFF
  status: "ACTIVE" | "INACTIVE"
  lastActive: string
  createdAt: string
}

export interface Member {
  id: string
  externalReference: string // e.g., CUS-100293
  name: string
  email: string
  phone: string
  institutionId: string
  primaryBranchId: string
  status: "ACTIVE" | "SUSPENDED"
  balances: {
    [rewardCode: string]: number
  }
  totalPointsEarned: number
  totalPointsRedeemed: number
  createdAt: string
  updatedAt: string
}

export interface Reward {
  id: string
  code: string // e.g. "POINT", "VCHR-COFFEE-01"
  name: string
  description: string
  type: RewardType
  mode: "QUANTITY" | "CODE"
  costInPoints?: number
  institutionId: string // "GLOBAL" or specific institutionId
  status: "ACTIVE" | "INACTIVE"
  totalIssued: number
  totalInCirculation: number
  expiresInDays?: number
  metadata?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface LedgerMovementEntry {
  id: string
  accountName: string
  accountType: "SYSTEM" | "MEMBER" | "REDEMPTION" | "EXPIRY"
  entryType: "DEBIT" | "CREDIT"
  amount: number
  rewardCode: string
}

export interface MemberImpact {
  memberId: string
  memberReference: string
  memberName: string
  rewardCode: string
  beforeBalance: number
  change: number
  afterBalance: number
}

export interface Transaction {
  id: string
  reference: string // TXN-2026-000192
  institutionId: string
  branchId: string
  type: TransactionType
  rewardCode: string
  changeAmount: number
  sourceSystem: string
  sourceReference: string
  idempotencyKey: string
  description: string
  createdAt: string
  entries: LedgerMovementEntry[]
  memberImpacts: MemberImpact[]
}

export interface Redemption {
  id: string
  redemptionCode: string
  memberId: string
  memberReference: string
  memberName: string
  rewardId: string
  rewardName: string
  rewardCode: string
  rewardType: RewardType
  pointsSpent: number
  branchId: string
  institutionId: string
  transactionId: string
  transactionReference: string
  createdAt: string
}

export interface Game {
  id: string
  code: string
  name: string
  description: string
  type: "SPIN_WHEEL" | "MYSTERY_BOX" | "LOTTERY" | "MILESTONE"
  status: "ACTIVE" | "PAUSED"
  institutionId: string
  rewardCode: string
  rewardPool: number
  rewardDistributed: number
  playsCount: number
  allowedBranches: string[] // empty = all branches
  createdAt: string
}

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  institutionId: string
  action: string
  resource: string
  resourceId: string
  requestId: string
  ipAddress: string
  userAgent: string
  beforeData?: string
  afterData?: string
  timestamp: string
}

export interface RolePermission {
  id: string
  role: ARBACRole
  title: string
  description: string
  scope: "GLOBAL" | "INSTITUTION" | "BRANCH"
  permissions: {
    ledgerView: boolean
    ledgerExport: boolean
    membersView: boolean
    membersManage: boolean
    rewardsView: boolean
    rewardsManage: boolean
    redemptionsPerform: boolean
    gamesManage: boolean
    institutionsManage: boolean
    usersManage: boolean
    brandingManage: boolean
  }
}
