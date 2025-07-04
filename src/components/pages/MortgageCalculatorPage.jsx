import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { formatPrice } from '@/utils/formatters';

const MortgageCalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(5000);
  const [insurance, setInsurance] = useState(1200);
  const [pmi, setPmi] = useState(200);
  const [hoaFees, setHoaFees] = useState(0);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [principalAndInterest, setPrincipalAndInterest] = useState(0);
  const [monthlyTaxes, setMonthlyTaxes] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [monthlyPmi, setMonthlyPmi] = useState(0);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, downPayment, interestRate, loanTerm, propertyTax, insurance, pmi, hoaFees]);
  
  const calculateMortgage = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly principal and interest
    const monthlyPI = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate other monthly costs
    const monthlyTax = propertyTax / 12;
    const monthlyIns = insurance / 12;
    const monthlyPMI = pmi / 12;
    const monthlyHOA = hoaFees / 12;
    
    // Calculate totals
    const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI + monthlyHOA;
    const totalInt = (monthlyPI * numberOfPayments) - principal;
    const totalPay = totalInt + principal;
    
    setPrincipalAndInterest(monthlyPI);
    setMonthlyTaxes(monthlyTax);
    setMonthlyInsurance(monthlyIns);
    setMonthlyPmi(monthlyPMI);
    setMonthlyHoa(monthlyHOA);
    setMonthlyPayment(totalMonthly);
    setTotalInterest(totalInt);
    setTotalPayment(totalPay);
  };
  
  const handleReset = () => {
    setLoanAmount(400000);
    setDownPayment(80000);
    setInterestRate(6.5);
    setLoanTerm(30);
    setPropertyTax(5000);
    setInsurance(1200);
    setPmi(200);
    setHoaFees(0);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Mortgage Calculator
        </h1>
        <p className="text-gray-600">
          Calculate your monthly mortgage payment and see how different factors affect your costs
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Loan Details</h2>
            <Button variant="outline" onClick={handleReset} size="small">
              Reset
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Price: {formatPrice(loanAmount)}
              </label>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="range-slider w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100K</span>
                <span>$2M</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment: {formatPrice(downPayment)} ({((downPayment / loanAmount) * 100).toFixed(1)}%)
              </label>
              <input
                type="range"
                min="0"
                max={loanAmount * 0.3}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value))}
                className="range-slider w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>{formatPrice(loanAmount * 0.3)}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate: {interestRate}%
              </label>
              <input
                type="range"
                min="3"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="range-slider w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>10%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term: {loanTerm} years
              </label>
              <input
                type="range"
                min="15"
                max="30"
                step="5"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="range-slider w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 years</span>
                <span>30 years</span>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Additional Costs</h3>
              
              <Input
                label="Annual Property Tax"
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(parseInt(e.target.value) || 0)}
                icon="Home"
              />
              
              <Input
                label="Annual Home Insurance"
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(parseInt(e.target.value) || 0)}
                icon="Shield"
              />
              
              <Input
                label="Monthly PMI"
                type="number"
                value={pmi}
                onChange={(e) => setPmi(parseInt(e.target.value) || 0)}
                icon="DollarSign"
              />
              
              <Input
                label="Monthly HOA Fees"
                type="number"
                value={hoaFees}
                onChange={(e) => setHoaFees(parseInt(e.target.value) || 0)}
                icon="Building"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Monthly Payment */}
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ApperIcon name="Home" size={24} />
              <h3 className="text-xl font-display font-semibold">Monthly Payment</h3>
            </div>
            <div className="text-4xl font-display font-bold mb-2">
              {formatPrice(monthlyPayment)}
            </div>
            <p className="text-white/80">Total monthly payment including all costs</p>
          </div>
          
          {/* Payment Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Principal & Interest</span>
                <span className="font-semibold">{formatPrice(principalAndInterest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Property Tax</span>
                <span className="font-semibold">{formatPrice(monthlyTaxes)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Home Insurance</span>
                <span className="font-semibold">{formatPrice(monthlyInsurance)}</span>
              </div>
              {monthlyPmi > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">PMI</span>
                  <span className="font-semibold">{formatPrice(monthlyPmi)}</span>
                </div>
              )}
              {monthlyHoa > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">HOA Fees</span>
                  <span className="font-semibold">{formatPrice(monthlyHoa)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Monthly</span>
                  <span className="text-primary">{formatPrice(monthlyPayment)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loan Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-display font-bold text-primary mb-1">
                  {formatPrice(loanAmount - downPayment)}
                </div>
                <div className="text-sm text-gray-600">Loan Amount</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-display font-bold text-accent mb-1">
                  {formatPrice(totalInterest)}
                </div>
                <div className="text-sm text-gray-600">Total Interest</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-display font-bold text-secondary mb-1">
                  {formatPrice(totalPayment)}
                </div>
                <div className="text-sm text-gray-600">Total Paid</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-display font-bold text-info mb-1">
                  {((downPayment / loanAmount) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Down Payment</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageCalculatorPage;