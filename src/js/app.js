const app = async (state, i18n) => {
  const getZodiacByBirthday = (day, month) => {
    const birthDate = new Date(`${month}.${day}`);
    const data = state.zodiacsList.find((zodiac) => {
      const dateFrom = new Date(zodiac.dateFrom);
      const dateTo = new Date(zodiac.dateTo);
      return dateFrom <= birthDate && dateTo >= birthDate;
    });
    return data.name;
  };

  // TODO App
  const zodiacSign = getZodiacByBirthday(8, 'october');
  console.log(i18n.t(`zodiacSigns.${zodiacSign}`));
};

export default app;
