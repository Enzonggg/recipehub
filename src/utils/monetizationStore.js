const PURCHASES_KEY = 'recipehub-recipe-purchases'
const GIFTS_KEY = 'recipehub-recipe-gifts'
const WALLETS_KEY = 'recipehub-user-wallets'

const PHP_PER_COIN = 1
const PLATFORM_SHARE_RATE = 0.2
const TAX_RATE = 0.12
const ESTIMATED_MONTHLY_AD_REVENUE = 8000

function readJson(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function createEventId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function splitRevenue(grossAmountPhp) {
  const gross = Number(grossAmountPhp || 0)
  const platformGross = gross * PLATFORM_SHARE_RATE
  const estimatedTax = platformGross * TAX_RATE
  const platformNet = platformGross - estimatedTax
  const chefShare = gross - platformGross

  return {
    gross,
    platformGross,
    estimatedTax,
    platformNet,
    chefShare,
  }
}

function calculateTotals(records, mapper) {
  return records.reduce(
    (totals, record) => {
      const value = mapper(record)
      const split = splitRevenue(value)

      return {
        gross: totals.gross + split.gross,
        platformGross: totals.platformGross + split.platformGross,
        estimatedTax: totals.estimatedTax + split.estimatedTax,
        platformNet: totals.platformNet + split.platformNet,
        chefShare: totals.chefShare + split.chefShare,
      }
    },
    {
      gross: 0,
      platformGross: 0,
      estimatedTax: 0,
      platformNet: 0,
      chefShare: 0,
    },
  )
}

function toCurrency(value) {
  return Number(value || 0).toFixed(2)
}

export function hasUserPurchasedRecipe(userId, recipeId) {
  if (!userId || !recipeId) {
    return false
  }

  const purchases = toArray(readJson(PURCHASES_KEY, []))
  return purchases.some((purchase) => String(purchase.userId) === String(userId) && String(purchase.recipeId) === String(recipeId))
}

export function purchaseRecipeAccess({ userId, recipe }) {
  if (!userId || !recipe?.id) {
    return { ok: false, message: 'User and recipe are required.' }
  }

  if (hasUserPurchasedRecipe(userId, recipe.id)) {
    return { ok: true, alreadyOwned: true, message: 'Recipe already purchased.' }
  }

  const purchases = toArray(readJson(PURCHASES_KEY, []))
  purchases.push({
    id: createEventId('buy'),
    userId: String(userId),
    recipeId: String(recipe.id),
    creatorId: String(recipe.submittedBy || ''),
    amountPhp: Number(recipe.pricePhp || 0),
    createdAt: new Date().toISOString(),
  })
  writeJson(PURCHASES_KEY, purchases)

  return { ok: true, alreadyOwned: false, message: 'Recipe unlocked.' }
}

export function getUserCoinWallet(userId) {
  if (!userId) {
    return 0
  }

  const wallets = readJson(WALLETS_KEY, {})
  if (typeof wallets[String(userId)] !== 'number') {
    wallets[String(userId)] = 200
    writeJson(WALLETS_KEY, wallets)
  }

  return Number(wallets[String(userId)] || 0)
}

function setUserCoinWallet(userId, value) {
  const wallets = readJson(WALLETS_KEY, {})
  wallets[String(userId)] = Math.max(0, Number(value || 0))
  writeJson(WALLETS_KEY, wallets)
  return wallets[String(userId)]
}

export function giftRecipeCoins({ userId, recipe, coins }) {
  if (!userId || !recipe?.id) {
    return { ok: false, message: 'User and recipe are required.' }
  }

  const safeCoins = Number(coins || 0)
  if (safeCoins <= 0) {
    return { ok: false, message: 'Gift coins must be greater than zero.' }
  }

  const walletBalance = getUserCoinWallet(userId)
  if (walletBalance < safeCoins) {
    return { ok: false, message: 'Not enough coins in your wallet.' }
  }

  const gifts = toArray(readJson(GIFTS_KEY, []))
  gifts.push({
    id: createEventId('gift'),
    userId: String(userId),
    recipeId: String(recipe.id),
    creatorId: String(recipe.submittedBy || ''),
    coins: safeCoins,
    amountPhp: safeCoins * PHP_PER_COIN,
    createdAt: new Date().toISOString(),
  })
  writeJson(GIFTS_KEY, gifts)
  setUserCoinWallet(userId, walletBalance - safeCoins)

  return { ok: true, message: `You gifted ${safeCoins} coins.` }
}

export function getRecipeRevenueSnapshot(recipeId) {
  const purchases = toArray(readJson(PURCHASES_KEY, [])).filter((record) => String(record.recipeId) === String(recipeId))
  const gifts = toArray(readJson(GIFTS_KEY, [])).filter((record) => String(record.recipeId) === String(recipeId))

  const purchaseTotals = calculateTotals(purchases, (record) => record.amountPhp)
  const giftTotals = calculateTotals(gifts, (record) => record.amountPhp)

  const combined = {
    gross: purchaseTotals.gross + giftTotals.gross,
    platformGross: purchaseTotals.platformGross + giftTotals.platformGross,
    estimatedTax: purchaseTotals.estimatedTax + giftTotals.estimatedTax,
    platformNet: purchaseTotals.platformNet + giftTotals.platformNet,
    chefShare: purchaseTotals.chefShare + giftTotals.chefShare,
  }

  return {
    purchasesCount: purchases.length,
    giftsCount: gifts.length,
    giftedCoins: gifts.reduce((sum, record) => sum + Number(record.coins || 0), 0),
    purchaseTotals,
    giftTotals,
    combined,
    display: {
      gross: toCurrency(combined.gross),
      platformGross: toCurrency(combined.platformGross),
      estimatedTax: toCurrency(combined.estimatedTax),
      platformNet: toCurrency(combined.platformNet),
      chefShare: toCurrency(combined.chefShare),
    },
  }
}

export function getAdminFinancialSummary() {
  const purchases = toArray(readJson(PURCHASES_KEY, []))
  const gifts = toArray(readJson(GIFTS_KEY, []))
  const purchaseTotals = calculateTotals(purchases, (record) => record.amountPhp)
  const giftTotals = calculateTotals(gifts, (record) => record.amountPhp)

  const grossRevenue = purchaseTotals.gross + giftTotals.gross
  const platformGross = purchaseTotals.platformGross + giftTotals.platformGross
  const estimatedTax = purchaseTotals.estimatedTax + giftTotals.estimatedTax
  const platformNet = purchaseTotals.platformNet + giftTotals.platformNet
  const chefPayout = purchaseTotals.chefShare + giftTotals.chefShare

  return {
    purchasesCount: purchases.length,
    giftsCount: gifts.length,
    giftedCoins: gifts.reduce((sum, gift) => sum + Number(gift.coins || 0), 0),
    grossRevenue,
    platformGross,
    estimatedTax,
    platformNet,
    chefPayout,
    adRevenueMonthly: ESTIMATED_MONTHLY_AD_REVENUE,
    projectedMonthlyValue: platformNet + ESTIMATED_MONTHLY_AD_REVENUE,
  }
}

export function formatPhp(value) {
  return `PHP ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
