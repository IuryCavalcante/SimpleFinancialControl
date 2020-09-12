function isValidPeriod(period) {
  try {
    if (
      typeof period === "undefined" ||
      period === "" ||
      period.length < 6 ||
      period.length > 7
    ) {
      throw new Error(
        "É necessário informar o parâmetro 'period', cujo valor deve estar no formato YYYY-MM onde YYYY deve estar entre [2000-3000] e MM entre [1-12]"
      );
    } else {
      const valitedYearMonth = period.split("-");
      let year = valitedYearMonth[0];
      let month = valitedYearMonth[1];
      if (
        year.length === 4 &&
        (month.length >= 1 || month.length <= 2) &&
        between(month, 1, 12) &&
        between(year, 2000, 3000)
      ) {
        return true;
      } else {
        throw new Error("Ano-Mes é invalido!");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

function between(compare, initial, final) {
  return (compare - initial) * (compare - final) <= 0;
}

export { isValidPeriod };
