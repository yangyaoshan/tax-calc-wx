//index.js
const app = getApp()
const taxes_freeIncome = 5000,
  taxRates = [
    {
      maxIncome: 3000,
      taxRate: 0.03,
      deduction: 0
    },
    {
      maxIncome: 12000,
      taxRate: 0.1,
      deduction: 210
    },
    {
      maxIncome: 25000,
      taxRate: 0.2,
      deduction: 1410
    },
    {
      maxIncome: 35000,
      taxRate: 0.25,
      deduction: 2660
    },
    {
      maxIncome: 55000,
      taxRate: 0.3,
      deduction: 4410
    },
    {
      maxIncome: 80000,
      taxRate: 0.35,
      deduction: 7160
    },
    {
      maxIncome: Infinity,
      taxRate: 0.45,
      deduction: 15160
    }
  ],
  criticalPoint = [
    {
      maxIncome: 36000,
      point: null
    },
    {
      maxIncome: 144000,
      point: 38560
    },
    {
      maxIncome: 300000,
      point: 160500
    },
    {
      maxIncome: 660000,
      point: 447500
    },
    {
      maxIncome: 960000,
      point: 706500
    },
    {
      maxIncome: Infinity,
      point: 1120000
    }
  ];
function taxesCalc(m, y) {
  let mTaxes = 0,
    yTaxes = 0,
    wrongIndex = null,
    best_yTaxes = null,
    bestAwads = null,
    undercharged = null;
  m = m - taxes_freeIncome;
  // debugger
  for (let i = 0; i < criticalPoint.length; i++) {
    const element = criticalPoint[i];
    if (!bestAwads && y > 0 && y <= element.maxIncome) {
      // 若年终奖仍处于临界点内，则为亏损
      // console.log(element, y, element.point && y < element.point);
      if (element.point && y < element.point) {
        wrongIndex = i;
        bestAwads = criticalPoint[i - 1];
      } else {
        bestAwads = criticalPoint[i];
      }
    }
  }
  for (let i = 0; i < taxRates.length; i++) {
    const element = taxRates[i],
      yAver = (y / 12).toFixed(2);
    if (m > 0 && m <= element.maxIncome && !mTaxes) {
      mTaxes = element.taxRate * m - element.deduction;
      // console.log("m level", element.maxIncome);
    }
    if (y > 0) {
      if (yAver <= element.maxIncome && !yTaxes) {
        yTaxes = element.taxRate * y - element.deduction;
      }
      if (wrongIndex !== null && !best_yTaxes && (bestAwads.maxIncome / 12) <= element.maxIncome) {
        // debugger
        best_yTaxes = element.taxRate * bestAwads.maxIncome - element.deduction;
      }
      // console.log("y level", yAver, element.maxIncome);
    }
  }
  if (best_yTaxes) {
    undercharged = parseInt(bestAwads.maxIncome - best_yTaxes - (y - yTaxes));
  }
  mTaxes = parseInt(mTaxes);
  yTaxes = parseInt(yTaxes);
  return {
    mTaxes,
    yTaxes,
    wrongIndex,
    bestAwads,
    best_yTaxes,
    undercharged: undercharged, // 少拿的年终奖
    totalTaxes: mTaxes * 12 + yTaxes,
    afterTaxesIncome: (m + taxes_freeIncome) * 12 + y - mTaxes * 12 - yTaxes
  };
}
Page({
  data: {
    monthlySalary: "",
    yearEndAwards: "",
    result: {}
  },
  inputMValue: function (e) {
    // console.log(e.detail.value);
    // this.data.monthlySalary = e.detail.value;
    this.setData({
      monthlySalary: e.detail.value
    });
  },
  inputYValue: function (e) {
    // this.data.yearEndAwards = e.detail.value;
    this.setData({
      yearEndAwards: e.detail.value
    });
    // console.log(e.detail.value);
  },
  calc: function () {
    // this.result = taxesCalc(parseInt(this.data.monthlySalary), parseInt(this.data.yearEndAwards));
    let result = taxesCalc(parseInt(this.data.monthlySalary), parseInt(this.data.yearEndAwards));
    console.log('result = ', result);
    this.setData({
      result
    });
  }
})
