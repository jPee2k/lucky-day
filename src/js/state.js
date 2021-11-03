const state = {
  processState: 'filling', // sending, success, error
  url: 'https://ignio.com/r/export/utf/xml/daily/com.xml',
  storageAvailability: false,
  userData: {
    name: 'user',
    birthday: null,
    zodiacSign: null,
    horoscope: '',
    currentStatus: '',
  },
  validationErrors: {},
  errors: [],
  zodiacsList: [
    { name: 'aries', dateFrom: '03.21', dateTo: '04.20' }, // Овен 21 марта – 20 апреля
    { name: 'taurus', dateFrom: '04.21', dateTo: '05.21' }, // Телец 21 апреля – 21 мая
    { name: 'gemini', dateFrom: '05.22', dateTo: '06.21' }, // Близнецы 22 мая – 21 июня
    { name: 'cancer', dateFrom: '06.22', dateTo: '07.22' }, // Рак 22 июня – 22 июля
    { name: 'leo', dateFrom: '07.23', dateTo: '08.21' }, // Лев 23 июля – 21 августа
    { name: 'virgo', dateFrom: '08.22', dateTo: '09.23' }, // Дева 22 августа – 23 сентября
    { name: 'libra', dateFrom: '09.24', dateTo: '10.23' }, // Весы 24 сентября – 23 октября
    { name: 'scorpio', dateFrom: '10.24', dateTo: '11.23' }, // Скорпион 24 октября – 23 ноября
    { name: 'sagittarius', dateFrom: '11.24', dateTo: '12.22' }, // Стрелец 24 ноября – 22 декабря
    { name: 'capricorn', dateFrom: '12.23', dateTo: '01.20' }, // Козерог 23 декабря – 20 января
    { name: 'aquarius', dateFrom: '01.21', dateTo: '02.19' }, // Водолей 21 января – 19 февраля
    { name: 'pisces', dateFrom: '02.20', dateTo: '03.20' }, // Рыбы 20 февраля – 20 марта
  ],
  fullHoroscope: '',
  roulette: {
    currentItem: 1,
    itemsCount: 12,
    circleAngle: 360,
    rotateCount: 5,
    oneRotateTime: 1000, // ms
    rotateTime: null,
    rotateOnDegrees: 0,
    statuses: [
      's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12',
    ],
  },
};

export default state;
