class ProfitCalculator {
    constructor(totalBets, winningTeamBets) {
      this.totalBets = totalBets;
      this.winningTeamBets = winningTeamBets;
      this.losingPool = totalBets - winningTeamBets;
    }
  
    calculatePrizeDistribution() {
      const losingPool = this.losingPool;
      
      return {
        winningBettors: losingPool * 0.65,
        prizes: {
          firstPlace: losingPool * 0.15,
          secondPlace: losingPool * 0.115,
          thirdPlace: losingPool * 0.08
        },
        platformFee: losingPool * 0.005
      };
    }
  
    calculateBettorPayout(betAmount) {
      const { winningBettors } = this.calculatePrizeDistribution();
      const proportion = betAmount / this.winningTeamBets;
      return {
        originalBet: betAmount,
        profit: winningBettors * proportion,
        totalPayout: betAmount + (winningBettors * proportion)
      };
    }
  
    static validateBet(betAmount, currentPool, maxRiskPercentage = 0.2) {
      // Prevent any single bet from being too large a portion of the pool
      return betAmount <= (currentPool * maxRiskPercentage);
    }
  }
  
  module.exports = ProfitCalculator;