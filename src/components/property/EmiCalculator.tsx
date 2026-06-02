"use client";

import { useState, useMemo } from "react";
import { Calculator, Info } from "lucide-react";

interface EmiCalculatorProps {
  price: number;
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
  const [propertyPrice, setPropertyPrice] = useState<number>(price);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20); // 20% down payment by default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% average interest rate
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years tenure

  // Recalculated values
  const { downPaymentAmt, loanAmount, monthlyEmi, totalInterest, totalPayment } = useMemo(() => {
    const downAmt = Math.round((propertyPrice * downPaymentPct) / 100);
    const loanAmt = propertyPrice - downAmt;
    
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months
    
    let emi = 0;
    if (loanAmt > 0) {
      if (r === 0) {
        emi = loanAmt / n;
      } else {
        emi = (loanAmt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
    }
    
    const roundedEmi = Math.round(emi);
    const totPay = roundedEmi * n;
    const totInt = Math.max(0, totPay - loanAmt);

    return {
      downPaymentAmt: downAmt,
      loanAmount: loanAmt,
      monthlyEmi: roundedEmi,
      totalInterest: totInt,
      totalPayment: totPay,
    };
  }, [propertyPrice, downPaymentPct, interestRate, tenureYears]);

  const formatInr = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Calculator className="h-5 w-5 text-[#C9A84C]" />
        <h3 className="font-semibold text-gray-900">EMI & Mortgage Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Property Price Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Property Price</span>
            <span>{formatInr(propertyPrice)}</span>
          </div>
          <input
            type="number"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332]/10 font-medium text-gray-800"
          />
        </div>

        {/* Down Payment Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Down Payment ({downPaymentPct}%)</span>
            <span>{formatInr(downPaymentAmt)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1B4332]"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Interest Rate</span>
            <span>{interestRate}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1B4332]"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Tenure</span>
            <span>{tenureYears} Years</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1B4332]"
          />
        </div>
      </div>

      {/* Results Box */}
      <div className="rounded-xl bg-[#1B4332]/5 p-4 border border-[#1B4332]/10 space-y-3">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estimated Monthly EMI</div>
          <div className="text-2xl font-extrabold text-[#1B4332] mt-0.5">{formatInr(monthlyEmi)}</div>
        </div>

        <div className="border-t border-[#1B4332]/10 pt-3 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Loan Amount:</span>
            <span className="font-semibold text-gray-800">{formatInr(loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest Payable:</span>
            <span className="font-semibold text-gray-800">{formatInr(totalInterest)}</span>
          </div>
          <div className="flex justify-between border-t border-[#1B4332]/5 pt-1.5 text-sm font-bold text-gray-700">
            <span>Total Amount Payable:</span>
            <span className="text-[#1B4332]">{formatInr(totalPayment)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-[10px] text-gray-400 leading-normal">
        <Info className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-0.5" />
        <span>Calculations are indicative. Actual bank terms and mortgage rates will vary based on your credit profile.</span>
      </div>
    </div>
  );
}
