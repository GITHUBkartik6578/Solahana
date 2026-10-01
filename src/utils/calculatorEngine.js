/**
 * SOLAHANA Financial Calculator Math Engine
 * Production-grade financial algorithms for SIP, EMI, Retirement, Lumpsum, FD, Inflation & Goal Planning.
 */

// Helper to format Indian Currency (INR) cleanly: ₹1,50,000 / ₹2.5 Cr / ₹45 Lakhs
export const formatINR = (val, compact = false) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  const num = Math.round(val);

  if (compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)} K`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

// Numeric input reader. Uses `fallback` only when the value is missing / not a number —
// a deliberately entered 0 (e.g. 0% inflation) must stay 0 instead of silently becoming the default.
const numOr = (value, fallback) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * 1. SIP CALCULATOR WITH STEP-UP
 */
export const calculateSIP = (monthlyInvestment, annualRate, durationYears, stepUpPercent = 0) => {
  const p = Math.max(0, Number(monthlyInvestment) || 0);
  const r = Math.max(0, (Number(annualRate) || 0) / 12 / 100);
  const years = Math.max(1, Math.min(50, Number(durationYears) || 1));
  const stepUp = Math.max(0, Math.min(100, Number(stepUpPercent) || 0));

  let totalInvested = 0;
  let futureValue = 0;
  let currentMonthlyP = p;
  const yearlyData = [];

  for (let yr = 1; yr <= years; yr++) {
    let yearlyInvestment = 0;
    for (let month = 1; month <= 12; month++) {
      yearlyInvestment += currentMonthlyP;
      // Compound monthly
      futureValue = (futureValue + currentMonthlyP) * (1 + r);
    }
    totalInvested += yearlyInvestment;

    yearlyData.push({
      year: `Yr ${yr}`,
      invested: Math.round(totalInvested),
      returns: Math.round(Math.max(0, futureValue - totalInvested)),
      futureValue: Math.round(futureValue),
    });

    // Step up annual monthly investment
    if (stepUp > 0) {
      currentMonthlyP = currentMonthlyP * (1 + stepUp / 100);
    }
  }

  const estimatedReturns = Math.max(0, futureValue - totalInvested);
  const wealthGainPct = totalInvested > 0 ? (estimatedReturns / totalInvested) * 100 : 0;

  return {
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(estimatedReturns),
    futureValue: Math.round(futureValue),
    wealthGainPct: Number(wealthGainPct.toFixed(1)),
    yearlyData,
  };
};

/**
 * 2. EMI CALCULATOR & AMORTIZATION
 */
export const calculateEMI = (principal, annualRate, tenureYears) => {
  const P = Math.max(0, Number(principal) || 0);
  const annualR = Math.max(0, Math.min(30, numOr(annualRate, 0)));
  const r = annualR / 12 / 100;
  const N = Math.max(1, Math.min(40, Number(tenureYears) || 1)) * 12;

  let emi = 0;
  if (r > 0) {
    emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
  } else {
    emi = P / N;
  }

  const totalPayment = emi * N;
  const totalInterest = Math.max(0, totalPayment - P);

  // Generate Amortization Schedule Table & Chart Data
  let balance = P;
  const schedule = [];
  const chartData = [];

  for (let m = 1; m <= N; m++) {
    const interestForMonth = balance * r;
    const principalForMonth = Math.min(balance, emi - interestForMonth);
    balance = Math.max(0, balance - principalForMonth);

    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      emi: Math.round(emi),
      principalPaid: Math.round(principalForMonth),
      interestPaid: Math.round(interestForMonth),
      balance: Math.round(balance),
    });

    if (m % 12 === 0 || m === N) {
      chartData.push({
        year: `Yr ${Math.ceil(m / 12)}`,
        balance: Math.round(balance),
        paidPrincipal: Math.round(P - balance),
      });
    }
  }

  return {
    monthlyEMI: Math.round(emi),
    principalAmount: Math.round(P),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalPct: totalPayment > 0 ? Number(((P / totalPayment) * 100).toFixed(1)) : 0,
    interestPct: totalPayment > 0 ? Number(((totalInterest / totalPayment) * 100).toFixed(1)) : 0,
    schedule,
    chartData,
  };
};

/**
 * 3. RETIREMENT CALCULATOR
 */
export const calculateRetirement = (
  currentAge,
  retirementAge,
  monthlyExpensesNow,
  expectedInflation,
  expectedReturn,
  existingSavings = 0
) => {
  const cAge = Math.max(18, Math.min(80, Number(currentAge) || 30));
  const rAge = Math.max(cAge + 1, Math.min(90, Number(retirementAge) || 60));
  const yearsToRetire = rAge - cAge;
  const expNow = Math.max(0, Number(monthlyExpensesNow) || 0);
  const inf = Math.max(0, Math.min(25, numOr(expectedInflation, 6)));
  const ret = Math.max(0, Math.min(30, numOr(expectedReturn, 12)));
  const savings = Math.max(0, Number(existingSavings) || 0);

  // Inflation-adjusted monthly expense at retirement
  const futureMonthlyExpense = expNow * Math.pow(1 + inf / 100, yearsToRetire);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Assuming 25 years post-retirement lifestyle
  const postRetirementYears = 25;
  // Real (inflation-adjusted) return can be zero or negative when inflation >= expected return.
  const realReturnRate = (1 + ret / 100) / (1 + inf / 100) - 1;

  // Required Corpus at retirement age = present value of 25 years of inflation-adjusted withdrawals.
  // Annuity formula divides by the rate, so a ~0 real rate needs the limit value (annual * years).
  const requiredCorpus =
    Math.abs(realReturnRate) < 1e-9
      ? futureAnnualExpense * postRetirementYears
      : futureAnnualExpense * ((1 - Math.pow(1 + realReturnRate, -postRetirementYears)) / realReturnRate);

  // Future value of existing savings
  const futureSavingsValue = savings * Math.pow(1 + ret / 100, yearsToRetire);

  // Net Corpus required
  const netCorpusNeeded = Math.max(0, requiredCorpus - futureSavingsValue);

  // Monthly SIP needed to reach net corpus
  const monthlyRate = ret / 12 / 100;
  const totalMonths = yearsToRetire * 12;
  let requiredMonthlySIP = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    requiredMonthlySIP = (netCorpusNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1) / (1 + monthlyRate);
  } else if (totalMonths > 0) {
    // 0% expected return: no compounding, the corpus has to be saved in equal instalments.
    requiredMonthlySIP = netCorpusNeeded / totalMonths;
  }

  // Projection chart data
  const projectionData = [];
  let accumCorpus = savings;
  const monthlySIP = requiredMonthlySIP;

  for (let yr = 0; yr <= yearsToRetire; yr++) {
    if (yr > 0) {
      for (let m = 1; m <= 12; m++) {
        accumCorpus = (accumCorpus + monthlySIP) * (1 + monthlyRate);
      }
    }

    projectionData.push({
      age: cAge + yr,
      year: `Age ${cAge + yr}`,
      accumulated: Math.round(accumCorpus),
      target: Math.round((requiredCorpus / yearsToRetire) * yr),
    });
  }

  return {
    yearsToRetire,
    futureMonthlyExpense: Math.round(futureMonthlyExpense),
    requiredCorpus: Math.round(requiredCorpus),
    futureSavingsValue: Math.round(futureSavingsValue),
    netCorpusNeeded: Math.round(netCorpusNeeded),
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    progressPct: requiredCorpus > 0 ? Math.min(100, Number(((futureSavingsValue / requiredCorpus) * 100).toFixed(1))) : 0,
    projectionData,
  };
};

/**
 * 4. GOAL PLANNER
 */
export const calculateGoal = (
  goalName,
  targetAmount,
  yearsRemaining,
  expectedReturn,
  existingSavings = 0,
  inflationRate = 6
) => {
  const target = Math.max(0, Number(targetAmount) || 0);
  const years = Math.max(1, Math.min(50, Number(yearsRemaining) || 1));
  const ret = Math.max(0.1, Math.min(30, numOr(expectedReturn, 12)));
  const savings = Math.max(0, Number(existingSavings) || 0);
  const inf = Math.max(0, Math.min(25, numOr(inflationRate, 6)));

  // Future Inflation-adjusted Target
  const futureTargetValue = target * Math.pow(1 + inf / 100, years);
  const futureSavings = savings * Math.pow(1 + ret / 100, years);
  const netTargetNeeded = Math.max(0, futureTargetValue - futureSavings);

  // Monthly SIP needed
  const r = ret / 12 / 100;
  const n = years * 12;
  let requiredMonthlySIP = 0;
  if (r > 0 && n > 0) {
    requiredMonthlySIP = (netTargetNeeded * r) / (Math.pow(1 + r, n) - 1) / (1 + r);
  }

  // One-time Lumpsum needed today
  const requiredLumpsumToday = netTargetNeeded / Math.pow(1 + ret / 100, years);

  // Growth timeline
  const timelineData = [];
  let accumSIP = savings;
  let accumLumpsum = savings + requiredLumpsumToday;

  for (let yr = 1; yr <= years; yr++) {
    for (let m = 1; m <= 12; m++) {
      accumSIP = (accumSIP + requiredMonthlySIP) * (1 + r);
    }
    accumLumpsum = accumLumpsum * (1 + ret / 100);

    timelineData.push({
      year: `Yr ${yr}`,
      sipProgress: Math.round(accumSIP),
      lumpsumProgress: Math.round(accumLumpsum),
      targetLine: Math.round((futureTargetValue / years) * yr),
    });
  }

  return {
    goalName: goalName || 'My Life Goal',
    targetToday: Math.round(target),
    futureTargetValue: Math.round(futureTargetValue),
    futureSavings: Math.round(futureSavings),
    netTargetNeeded: Math.round(netTargetNeeded),
    requiredMonthlySIP: Math.round(requiredMonthlySIP),
    requiredLumpsumToday: Math.round(requiredLumpsumToday),
    timelineData,
  };
};

/**
 * 5. LUMPSUM CALCULATOR
 */
export const calculateLumpsum = (principalAmount, annualRate, durationYears) => {
  const P = Math.max(0, Number(principalAmount) || 0);
  const R = Math.max(0.1, Math.min(30, Number(annualRate) || 0));
  const Y = Math.max(1, Math.min(50, Number(durationYears) || 1));

  const futureValue = P * Math.pow(1 + R / 100, Y);
  const totalGain = Math.max(0, futureValue - P);
  const gainPct = P > 0 ? (totalGain / P) * 100 : 0;

  const yearlyData = [];
  let currentVal = P;
  for (let yr = 1; yr <= Y; yr++) {
    currentVal = currentVal * (1 + R / 100);
    yearlyData.push({
      year: `Yr ${yr}`,
      principal: Math.round(P),
      gain: Math.round(currentVal - P),
      totalValue: Math.round(currentVal),
    });
  }

  return {
    principalAmount: Math.round(P),
    totalGain: Math.round(totalGain),
    futureValue: Math.round(futureValue),
    gainPct: Number(gainPct.toFixed(1)),
    yearlyData,
  };
};

/**
 * 6. FIXED DEPOSIT (FD) CALCULATOR
 */
export const calculateFD = (depositAmount, annualRate, durationYears, frequency = 'Quarterly') => {
  const P = Math.max(0, Number(depositAmount) || 0);
  const R = Math.max(0.1, Math.min(30, Number(annualRate) || 0));
  const Y = Math.max(0.5, Math.min(30, Number(durationYears) || 1));

  const freqMap = {
    'Annually': 1,
    'Half-Yearly': 2,
    'Quarterly': 4,
    'Monthly': 12,
  };
  const n = freqMap[frequency] || 4;

  const maturityAmount = P * Math.pow(1 + R / (n * 100), n * Y);
  const totalInterest = Math.max(0, maturityAmount - P);

  const timelineData = [];
  const yearsInt = Math.ceil(Y);
  for (let yr = 1; yr <= yearsInt; yr++) {
    const valAtYr = P * Math.pow(1 + R / (n * 100), n * Math.min(yr, Y));
    timelineData.push({
      year: `Yr ${yr}`,
      deposit: Math.round(P),
      interest: Math.round(valAtYr - P),
      maturity: Math.round(valAtYr),
    });
  }

  return {
    depositAmount: Math.round(P),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(maturityAmount),
    yieldPct: P > 0 ? Number(((totalInterest / P) * 100).toFixed(1)) : 0,
    timelineData,
  };
};

/**
 * 7. INFLATION CALCULATOR
 */
export const calculateInflation = (todayValue, inflationRate, durationYears) => {
  const costNow = Math.max(0, Number(todayValue) || 0);
  const inf = Math.max(0, Math.min(30, numOr(inflationRate, 0)));
  const Y = Math.max(1, Math.min(50, Number(durationYears) || 1));

  const futureCost = costNow * Math.pow(1 + inf / 100, Y);
  const costIncrease = Math.max(0, futureCost - costNow);

  // Purchasing power loss calculation
  // Purchasing power of 100 today after Y years = 100 / (1 + inf/100)^Y
  const futurePurchasingPowerPct = (1 / Math.pow(1 + inf / 100, Y)) * 100;
  const purchasingPowerLossPct = Math.max(0, 100 - futurePurchasingPowerPct);

  const timelineData = [];
  for (let yr = 1; yr <= Y; yr++) {
    const costAtYr = costNow * Math.pow(1 + inf / 100, yr);
    const powerAtYr = (1 / Math.pow(1 + inf / 100, yr)) * 100;
    timelineData.push({
      year: `Yr ${yr}`,
      cost: Math.round(costAtYr),
      purchasingPowerPct: Number(powerAtYr.toFixed(1)),
    });
  }

  return {
    todayValue: Math.round(costNow),
    futureCost: Math.round(futureCost),
    costIncrease: Math.round(costIncrease),
    increasePct: costNow > 0 ? Number(((costIncrease / costNow) * 100).toFixed(1)) : 0,
    purchasingPowerLossPct: Number(purchasingPowerLossPct.toFixed(1)),
    timelineData,
  };
};
