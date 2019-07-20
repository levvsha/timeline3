import * as d3 from 'd3';

const defaultRadius = 10;
const lastLevelRadius = 5;

const margins = {
  top: 15,
  right: 140,
  bottom: 30,
  left: 30
};

const width = 4900 - margins.left - margins.right;
const height = 900 - margins.top - margins.bottom;

export const dimensions = {
  width,
  height,
  margins
};

export const getBB = (selection, properyName = 'bbox') => {
  selection.each(function(d){
    d[properyName] = this.getBBox();
  });
};

export const parseTime  = d3.timeParse("%d.%m.%Y");

export const xScale = d3.scaleTime()
  .range([0, width])
  .domain([parseTime('01.01.1645'), parseTime('17.07.1918')]);

const reignDates = {
  petri: ['07.05.1682', '08.02.1725'],
  ekaterinai: ['08.02.1725', '17.05.1727'],
  petrii: ['17.05.1727', '30.01.1730'],
  anna: ['30.01.1730', '28.10.1740'],
  ivanvi: ['28.10.1740', '06.12.1741'],
  elizaveta: ['06.12.1741', '05.01.1762'],
  petriii: ['05.01.1762', '09.06.1762'],
  ekaterinaii: ['09.06.1762', '17.11.1796'],
  paveli: ['17.11.1796', '24.03.1801'],
  alexandri: ['24.03.1801', '01.12.1825'],
  nikolayi: ['01.12.1825', '02.03.1855'],
  alexandrii: ['02.03.1855', '13.03.1881'],
  alexandriii: ['13.03.1881', '01.11.1894'],
  nikolayii: ['01.11.1894', '15.03.1917']
};

const bornDates = {
  petri: '09.06.1672',
  ekaterinai: '15.04.1684',
  petrii: '23.10.1715',
  anna: '07.02.1693',
  ivanvi: '23.08.1740',
  elizaveta: '29.12.1709',
  petriii: '21.02.1728',
  ekaterinaii: '02.05.1729',
  paveli: '01.10.1754',
  alexandri: '23.12.1777',
  nilolayi: '06.07.1796',
  alexandrii: '29.04.1818',
  alexandriii: '11.03.1845',
  nikolayii: '18.05.1868'
};

export const chapters = [
  {
    label: 'ГЛАВА 1',
    period: ['01.01.1645', '01.01.1700'],
    position: 'top',
    level: 'first'
  },
  {
    label: 'ГЛАВА 2',
    period: ['01.01.1696', '01.01.1723'],
    position: 'top',
    level: 'second'
  },
  {
    label: 'ГЛАВА 3',
    period: ['01.01.1725', '01.01.1762'],
    position: 'top',
    level: 'first'
  },
  {
    label: 'ГЛАВА 4',
    period: ['01.01.1678', '01.01.1760'],
    position: 'bottom',
    level: 'third'
  },
  {
    label: 'ГЛАВА 5',
    period: ['01.01.1762', '01.01.1800'],
    position: 'top',
    level: 'first'
  },
  {
    label: 'ГЛАВА 6',
    period: ['01.01.1761', '01.01.1796'],
    position: 'bottom',
    level: 'third'
  },
  {
    label: 'ГЛАВА 7',
    period: ['01.01.1800', '01.01.1822'],
    position: 'top',
    level: 'second'
  },
  {
    label: 'ГЛАВА 8',
    period: ['01.01.1823', '01.01.1853'],
    position: 'top',
    level: 'second'
  },
  {
    label: 'ГЛАВА 9',
    period: ['01.01.1797', '01.01.1856'],
    position: 'bottom',
    level: 'third'
  },
  {
    label: 'ГЛАВА 10',
    period: ['01.01.1853', '01.01.1879'],
    position: 'top',
    level: 'first'
  },
  {
    label: 'ГЛАВА 11',
    period: ['01.01.1879', '01.01.1917'],
    position: 'top',
    level: 'second'
  },
  {
    label: 'ГЛАВА 12',
    period: ['01.01.1854', '01.01.1917'],
    position: 'bottom',
    level: 'fourth'
  },
  {
    label: 'ГЛАВА 12',
    period: ['01.01.1914', '01.01.1917'],
    position: 'right',
    level: 'third'
  },
];

export const names = [
  {
    label: 'Пётр I',
    level: 'first',
    position: reignDates.petri[0],
    key: 'petri',
    smallLabel: ['Пётр Алексеевич'],
    smallLabelLevel: 'first',
    smallLabelPosition: bornDates.petri
  },
  {
    label: 'Екатерина I',
    level: 'third',
    position: reignDates.ekaterinai[0],
    noShift: true,
    annotationLine: true,
    key: 'ekaterinai',
    smallLabel: ['Марта Самуиловна', 'Скавронская'],
    smallAnnotationLine: true,
    smallLabelLevel: 'martaout',
    smallLabelPosition: bornDates.ekaterinai,
    smallLabelPointTo: 'first'
  },
  {
    label: 'Пётр II',
    level: 'second',
    position: reignDates.petrii[1],
    noShift: true,
    key: 'petrii',
    smallLabel: ['Пётр Алексеевич'],
    smallAnnotationLine: true,
    smallLabelLevel: 'petriiout',
    smallLabelPosition: bornDates.petrii,
    smallLabelPointTo: 'second'
  },
  {
    label: 'Анна',
    level: 'first',
    position: reignDates.anna[0],
    key: 'anna',
    smallLabel: ['Анна Иоановна'],
    smallLabelLevel: 'third',
    smallLabelPosition: bornDates.anna
  },
  {
    label: 'Иван VI',
    level: 'second',
    position: reignDates.ivanvi[1],
    key: 'ivanvi'
  },
  {
    label: 'Елизавета',
    level: 'first',
    position: reignDates.elizaveta[0],
    key: 'elizaveta',
    smallLabel: ['Елизавета Петровна'],
    smallLabelLevel: 'fourth',
    smallLabelPosition: bornDates.elizaveta,
    smallLabelShift: 15
  },
  {
    label: 'Пётр III',
    level: 'third',
    position: reignDates.petriii[1],
    noShift: true,
    key: 'petriii',
    smallLabel: [
      'Карл Петер',
      'Ульрих фон Шлейзвиг-',
      'Гольштейн-Готторп'
    ],
    smallAnnotationLine: true,
    smallLabelLevel: 'petriiiout',
    smallLabelPosition: bornDates.petriii,
    smallLabelPointTo: 'third'
  },
  {
    label: 'Екатерина II',
    level: 'first',
    position: reignDates.ekaterinaii[0],
    key: 'ekaterinaii',
    smallLabel: [
      'София',
      'Фредерика Августа',
      'Ангальт-Цербская'
    ],
    smallLabelLevel: 'third',
    smallLabelPosition: reignDates.anna[0],
    smallLabelShift: 10
  },
  {
    label: 'Павел I',
    level: 'second',
    position: reignDates.paveli[0],
    annotationLine: true,
    noShift: true,
    key: 'paveli',
    smallLabel: ['Павел', 'Петрович'],
    smallLabelLevel: 'third',
    smallLabelPosition: bornDates.paveli
  },
  {
    label: 'Александр I',
    level: 'first',
    position: reignDates.alexandri[0],
    key: 'alexandri',
    smallLabel: ['Александр', 'Павлович'],
    smallLabelLevel: 'second',
    smallLabelPosition: bornDates.alexandri
  },
  {
    label: 'Николай I',
    level: 'first',
    position: reignDates.nikolayi[0],
    key: 'nikolayi',
    smallLabel: ['Николай', 'Павлович'],
    smallLabelLevel: 'fourth',
    smallLabelPosition: bornDates.nilolayi
  },
  {
    label: 'Александр II',
    level: 'first',
    position: reignDates.alexandrii[0],
    key: 'alexandrii',
    smallLabel: ['Александр', 'Николаевич'],
    smallLabelLevel: 'second',
    smallLabelPosition: bornDates.alexandrii
  },
  {
    label: 'Александр III',
    level: 'first',
    position: reignDates.alexandriii[0],
    key: 'alexandriii',
    smallLabel: ['Александр', 'Александрович'],
    smallLabelLevel: 'second',
    smallLabelPosition: bornDates.alexandriii
  },
  {
    label: 'Николай II',
    level: 'first',
    position: reignDates.nikolayii[0],
    key: 'nikolayii',
    smallLabel: ['Николай', 'Александрович'],
    smallLabelLevel: 'second',
    smallLabelPosition: bornDates.nikolayii
  },
];

const config = [
  {
    key: 'petri',
    color: '#883813',
    levels: [
      {
        level: 'first',
        points: [bornDates.petri, reignDates.petri[0]],
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.petri,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'ekaterinai',
    color: '#ec3000',
    levels: [
      {
        level: 'first',
        points: [bornDates.ekaterinai, reignDates.petri[1]],
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.ekaterinai,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'petrii',
    color: '#f27300',
    levels: [
      {
        level: 'second',
        points: [bornDates.petrii, reignDates.petri[1]],
        radiusRight: defaultRadius
      },
      {
        level: 'first',
        points: reignDates.ekaterinai,
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.petrii,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'out',
        points: [reignDates.petrii[1], reignDates.petrii[1]],
        radiusLeft: 0,
        radiusRight: 0,
      },
    ]
  },
  {
    key: 'anna',
    color: '#fec900',
    levels: [
      {
        level: 'third',
        points: [bornDates.anna, reignDates.petri[1]],
        radiusRight: defaultRadius
      },
      {
        level: 'second',
        points: reignDates.ekaterinai,
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius
      },
      {
        level: 'first',
        points: reignDates.petrii,
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.anna,
        radiusLeft: defaultRadius,
        radiusRight: 3
      },
    ]
  },
  {
    key: 'ivanvi',
    color: '#7acccf',
    levels: [
      {
        level: 'first',
        points: [bornDates.ivanvi, reignDates.anna[1]],
        radiusLeft: 1,
        radiusRight: 1,
        doNotRenderHorizontal: true,
      },
      {
        level: 'throne',
        points: reignDates.ivanvi,
        radiusLeft: defaultRadius,
        radiusRight: 5,
      },
      {
        level: 'out',
        points: [reignDates.ivanvi[1], '17.07.1764'],
        radiusRight: lastLevelRadius,
        radiusLeft: defaultRadius,
      }
    ]
  },
  {
    key: 'elizaveta',
    color: '#afd500',
    isBorn: true,
    levels: [
      {
        level: 'throne',
        points: [bornDates.elizaveta, bornDates.elizaveta],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true,
      },
      {
        level: 'fourth',
        points: [bornDates.elizaveta, reignDates.petri[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
    ]
  },
  {
    key: 'elizaveta',
    color: '#afd500',
    levels: [
      {
        level: 'first',
        points: [bornDates.elizaveta, bornDates.elizaveta],
        radiusRight: defaultRadius * 3,
        doNotRenderHorizontal: true,
      },
      {
        level: 'fourth',
        points: [bornDates.elizaveta, reignDates.petri[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'third',
        points: reignDates.ekaterinai,
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius
      },
      {
        level: 'second',
        points: reignDates.petrii,
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius
      },
      {
        level: 'first',
        points: [reignDates.anna[0], bornDates.ivanvi],
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'second',
        points: [bornDates.ivanvi, reignDates.anna[1]],
        radiusLeft: 1,
        radiusRight: 1,
        doNotRenderHorizontal: true
      },
      {
        level: 'first',
        points: reignDates.ivanvi,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius,
        doNotRenderHorizontal: true
      },
      {
        level: 'throne',
        points: reignDates.elizaveta,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'petriii',
    color: '#33b125',
    levels: [
      {
        level: 'third',
        points: [bornDates.petriii, reignDates.petrii[1]],
        radiusRight: defaultRadius
      },
      {
        level: 'second',
        points: [reignDates.anna[0], bornDates.ivanvi],
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'third',
        points: [bornDates.ivanvi, reignDates.anna[1]],
        radiusLeft: 1,
        radiusRight: 1,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: reignDates.ivanvi,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius,
        doNotRenderHorizontal: true
      },
      {
        level: 'first',
        points: reignDates.elizaveta,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.petriii,
        radiusLeft: 4,
        radiusRight: 3,
        doNotRenderHorizontal: true
      },
      {
        level: 'outpetriii',
        points: [reignDates.petriii[1], reignDates.petriii[1]],
        radiusLeft: 0,
        radiusRight: 5,
        doNotRenderHorizontal: true
      }
    ]
  },
  {
    key: 'ekaterinaii',
    color: '#b2c2ea',
    levels: [
      {
        level: 'fourth',
        points: [bornDates.ekaterinaii, reignDates.petrii[1]],
        radiusRight: defaultRadius,
      },
      {
        level: 'third',
        points: [reignDates.anna[0], bornDates.ivanvi],
        radiusRight: defaultRadius,
        radiusLeft: defaultRadius,
      },
      {
        level: 'fourth',
        points: [bornDates.ivanvi, reignDates.anna[1]],
        radiusLeft: 1,
        radiusRight: 1,
        doNotRenderHorizontal: true
      },
      {
        level: 'third',
        points: reignDates.ivanvi,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: reignDates.elizaveta,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'first',
        points: reignDates.petriii,
        radiusLeft: 4,
        radiusRight: 4,
        doNotRenderHorizontal: true
      },
      {
        level: 'throne',
        points: reignDates.ekaterinaii,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'paveli',
    color: '#1bb9fb',
    levels: [
      {
        level: 'first',
        points: [bornDates.paveli, bornDates.paveli],
        radiusRight: defaultRadius * 3,
        doNotRenderHorizontal: true
      },
      {
        level: 'third',
        points: [bornDates.paveli, reignDates.elizaveta[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
    ]
  },
  {
    key: 'paveli',
    color: '#1bb9fb',
    levels: [
      {
        level: 'second',
        points: [bornDates.paveli, bornDates.paveli],
        radiusRight: defaultRadius * 3,
        doNotRenderHorizontal: true
      },
      {
        level: 'third',
        points: [bornDates.paveli, reignDates.elizaveta[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'second',
        points: reignDates.petriii,
        radiusLeft: 4,
        radiusRight: 4,
        doNotRenderHorizontal: true
      },
      {
        level: 'first',
        points: reignDates.ekaterinaii,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.paveli,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'alexandri',
    color: '#0972c7',
    levels: [
      {
        level: 'first',
        points: [bornDates.alexandri, bornDates.alexandri],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: [bornDates.alexandri, reignDates.ekaterinaii[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'first',
        points: reignDates.paveli,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.alexandri,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      }
    ]
  },
  {
    key: 'nikolayi',
    color: '#792094',
    levels: [
      {
        level: 'first',
        points: [bornDates.nikolayi, bornDates.nikolayi],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true
      },
      {
        level: 'fourth',
        points: [bornDates.nilolayi, reignDates.ekaterinaii[1]],
        radiusRight: 6,
        isBorn: true
      },
      {
        level: 'second',
        points: reignDates.paveli,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'first',
        points: reignDates.alexandri,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.nikolayi,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      },
    ]
  },
  {
    key: 'alexandrii',
    color: '#bcbec0',
    levels: [
      {
        level: 'first',
        points: [bornDates.alexandrii, bornDates.alexandrii],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: [bornDates.alexandrii, reignDates.alexandri[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'first',
        points: reignDates.nikolayi,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.alexandrii,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      }
    ]
  },
  {
    key: 'alexandriii',
    color: '#6d6e71',
    levels: [
      {
        level: 'first',
        points: [bornDates.alexandriii, bornDates.alexandriii],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: [bornDates.alexandriii, reignDates.nikolayi[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'first',
        points: reignDates.alexandrii,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.alexandriii,
        radiusLeft: defaultRadius,
        radiusRight: lastLevelRadius
      }
    ]
  },
  {
    key: 'nikolayii',
    color: '#242021',
    levels: [
      {
        level: 'first',
        points: [bornDates.nikolayii, bornDates.nikolayii],
        radiusRight: defaultRadius * 2,
        doNotRenderHorizontal: true
      },
      {
        level: 'second',
        points: [bornDates.nikolayii, reignDates.alexandrii[1]],
        radiusRight: defaultRadius,
        isBorn: true
      },
      {
        level: 'first',
        points: reignDates.alexandriii,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'throne',
        points: reignDates.nikolayii,
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius
      },
      {
        level: 'outnickolayii',
        points: [reignDates.nikolayii[1], '17.07.1918'],
        radiusLeft: defaultRadius,
        radiusRight: defaultRadius,
        doNotRenderHorizontal: true
      }
    ]
  },
];

config.forEach(item => {
  item.levels.forEach(level => {
    level.points = level.points.map(date => xScale(parseTime(date)));
  })
});

export default config.reverse();