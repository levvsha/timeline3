import * as d3 from 'd3';
import WebFont from 'webfontloader';

let fontIsActive = false;
let fontActivationCallback = () => {};

WebFont.load({
  google: {
    families: ['Noto Serif']
  },
  active: () => {
    fontIsActive = true;
    fontActivationCallback();
  }
});

const margins = {
  top: 20,
  right: 140,
  bottom: 30,
  left: 125
};

const parseTime  = d3.timeParse('%d.%m.%Y');

const config = {
  consortWidth: 6,
  mainWidth: 12,
  spacing: 30
};

const getBB = (selection, properyName = 'bbox') => {
  selection.each(function (d) {
    d[properyName] = this.getBBox();
  });
};

const getMaxDate = (data) => {
  let store = [data];
  let maxDate = parseTime(data.life[1]);

  while (store.length !== 0) {
    const item = store.shift();
    const deathDate = parseTime(item.life[1]);
    maxDate = deathDate > maxDate ? deathDate : maxDate;

    if (data.consort) {
      data.consort.forEach(consortItem => {
        const consortDeathDate = consortItem.life[1]
        maxDate = consortDeathDate > maxDate ? consortDeathDate : maxDate;
      });
    }

    if (item.children) {
      store = item.children.concat(store);
    }
  }

  return maxDate;
}

export default class Visualization {
  constructor(data) {

    const maxDate = getMaxDate(data);
    const diff = +maxDate - +parseTime(data.life[0]);
    const width = 3000 * diff / (+parseTime('05.12.1909') - +parseTime('20.09.1754'));

    // x --------- diff
    // 3000        (+parseTime('05.12.1909') - +parseTime('20.09.1754'));

    const xScale = d3.scaleTime()
      .range([0, width])
      .domain([data.life[0], '05.12.1909'].map(parseTime));

    const getCoordsForConsortGridLines = (consortItem, currentBottomY) => (
      {
        coords: [
          {
            x: 0,
            y: currentBottomY
          },
          {
            x: document.location.search ?  width : xScale(parseTime(consortItem.life[1])),
            y: currentBottomY
          }
        ]
      }
    );

    const getCoordsForPrinceGridLines = (item, currentBottomY) => (
      {
        isEmperor: item.rule,
        coords: [
          {
            x: 0,
            y: currentBottomY
          },
          {
            x: document.location.search ?  width : xScale(parseTime(item.life[1])),
            y: currentBottomY
          }
        ]
      }
    );

    const getCoordsForConsortLines = (consortItem, currentBottomY, diff) => {
      const result = [
        {
          isConsort: true,
          coords: [
            {
              x: xScale(parseTime(consortItem.life[0])),
              y: currentBottomY
            },
            {
              x: xScale(parseTime(consortItem.marriage[0])),
              y: currentBottomY
            },
            {
              x: xScale(parseTime(consortItem.marriage[0])),
              y: currentBottomY + config.spacing * diff
            }
          ]
        },
      ];

      result.push(
        {
          isConsort: true,
          coords: [
            {
              x: xScale(parseTime(consortItem.marriage[0])) - config.consortWidth / 2,
              y: currentBottomY + config.spacing * diff
            },
            {
              x: xScale(parseTime(consortItem.marriage[1])),
              y: currentBottomY + config.spacing * diff
            }
          ]
        },
      );

      if (parseTime(consortItem.life[1]) > parseTime(consortItem.marriage[1])) {
        result.push(
          {
            isConsort: true,
            coords: [
              {
                x: xScale(parseTime(consortItem.marriage[1])) - config.consortWidth / 2,
                y: currentBottomY + config.spacing
              },
              {
                x: xScale(parseTime(consortItem.marriage[1])) - config.consortWidth / 2,
                y: currentBottomY
              },
              {
                x: xScale(parseTime(consortItem.life[1])),
                y: currentBottomY
              }
            ]
          }
        );
      }

      return result;
    };

    const getCoordsForPrinceLines = (item, currentBottomY) => (
      {
        isPrince: true,
        coords: [
          {
            x: xScale(parseTime(item.life[0])),
            y: currentBottomY
          },
          {
            x: xScale(parseTime(item.life[1])),
            y: currentBottomY
          }
        ]
      }
    );

    const getCoordsForEmperorLines = (item, currentBottomY) => (
      {
        isEmperor: true,
        coords: [
          {
            x: xScale(parseTime(item.life[0])),
            y: currentBottomY
          },
          {
            x: xScale(parseTime(item.life[1])),
            y: currentBottomY
          }
        ]
      }
    );

    const getLabelsCoords = (item, currentBottomY) => (
      {
        text: item.name,
        isEmperor: item.rule,
        coords: {
          x: xScale(parseTime(item.life[0])) + (item.rule ? -8 : 0),
          y: currentBottomY + (item.rule ? 6.5 : (item.marriage ? -7 : -10))
        }
      }
    );

    let currentBottomY = 0;

    let gridLines = [];
    let mainLines = [];
    const relationshipLabels = [];
    const nameLabels = [];
    const emperorsMap = {};
    const levels = [];
    const gradients = [];
    const ruleTime = [];
    const ruleTimeConsorts = [];

    data.level = 0;
    let store = [data];

    while (store.length !== 0) {
      const item = store.shift();

      if (item.consort) {
        item.consort.forEach((consortItem, index) => {
          gridLines.push(getCoordsForConsortGridLines(consortItem, currentBottomY));
          mainLines = mainLines.concat(getCoordsForConsortLines(consortItem, currentBottomY, item.consort.length - index));
          nameLabels.push(getLabelsCoords(consortItem, currentBottomY));

          levels.push({
            index: index + 1,
            isConsort: true,
            consortName: item.name,
            yCoord: currentBottomY,
            level: item.level,
            name: consortItem.name
          });

          currentBottomY += config.spacing;

          if (index === item.consort.length - 1) {
            gridLines.push(getCoordsForConsortGridLines(consortItem, currentBottomY));

            levels.push({
              index: index + 1,
              isConsort: true,
              consortName: item.name,
              isWife: true,
              yCoord: currentBottomY,
              level: item.level
            });

            if (item.rule) {
              item.consort.forEach((d, index) => {
                let diff = 0;

                if (parseTime(d.marriage[0]) > parseTime(item.rule[0])) {
                  diff = config.consortWidth / 2;
                }

                const x = Math.max(xScale(parseTime(d.marriage[0])), xScale(parseTime(item.rule[0]))) - diff;

                ruleTimeConsorts.push({
                  x,
                  y: currentBottomY - config.consortWidth / 2,
                  width: xScale(parseTime(d.marriage[1])) - x ,
                  height: config.consortWidth
                });
              });
            }

            currentBottomY += config.spacing;
          }
        });
      }

      gridLines.push(getCoordsForPrinceGridLines(item, currentBottomY));

      if (item.rule) { // is emperor ??
        mainLines.push(getCoordsForEmperorLines(item, currentBottomY));

        ruleTime.push({
          x: xScale(parseTime(item.rule[0])),
          y: currentBottomY - config.mainWidth / 2,
          width: xScale(parseTime(item.rule[1])) - xScale(parseTime(item.rule[0])),
          height: config.mainWidth
        });

        emperorsMap[item.name] = {
          xCoord: xScale(parseTime(item.life[0])) - 8,
          ruleXCoord: xScale(parseTime(item.rule[0])),
          level: item.level,
          name: item.name,
          dad: item.dad,
          grandpa: item.grandpa,
          moreThanOneConsort: item.moreThanOneConsort,
          mother: item.mother
        };
      } else {
        mainLines.push(getCoordsForPrinceLines(item, currentBottomY));
      }

      levels.push({
        marriage: item.consort
          ? item.consort.map(consortItem => consortItem.marriage.map((d) => xScale(parseTime(d))))
          : null,
        life: item.life.map((d) => xScale(parseTime(d))),
        name: item.name,
        isConsort: false,
        yCoord: currentBottomY,
        level: item.level,
        dad: item.dad,
        grandpa: item.grandpa,
        index: item.index,
      });

      nameLabels.push(getLabelsCoords(item, currentBottomY));
      currentBottomY += config.spacing;

      if (item.children) {
        store = item.children.map((childItem, index) => Object.assign({
          level: item.level + 1,
          dad: item.name,
          grandpa: item.dad,
          moreThanOneConsort: item.consort && item.consort.length > 1,
          index: index + 1,
        }, childItem)).concat(store);
      }
    }

    const getRelationshipText = (emperor, currentLevel) => {
      const emperorLevel = emperor.level;
      const diff = emperorLevel - currentLevel.level;

      const result = {
        '-2': currentLevel.grandpa === emperor.name ? `внук ${ currentLevel.index }` : 'внучатый племянник',
        '-1': currentLevel.isConsort
          ? 'невестка'
          : currentLevel.dad === emperor.name ? `сын ${ currentLevel.index }` : 'племянник',
        '0': currentLevel.isConsort
          ? currentLevel.consortName === emperor.name ? `женщина ${ currentLevel.index }` : 'невестка'
          : `брат ${ currentLevel.index }`,
        '1': currentLevel.isConsort
          ? emperor.dad === currentLevel.consortName
            ? emperor.moreThanOneConsort
              ? emperor.mother === currentLevel.name ? 'мать' : null
              : 'мать'
            : 'тётя'
          : currentLevel.name === emperor.dad ? 'отец' : 'дядя',
        '2': currentLevel.isConsort
          ? currentLevel.consortName === emperor.grandpa ? 'бабка' : 'двоюродная бабка'
          : currentLevel.name === emperor.grandpa ? 'дед' : 'двоюродный дед'
      };

      return result[diff] || '';
    };

    Object.keys(emperorsMap).forEach((emperorName) => {
      levels.forEach(level => {
        if (emperorName !== level.name) {
          let text = null;

          if (level.isWife) {
            text = level.consortName === emperorName ? 'супруга' : null;
          } else {
            text = getRelationshipText(emperorsMap[emperorName], level);
          }

          if (
            emperorsMap[emperorName].ruleXCoord
            && level.life
            && emperorsMap[emperorName].ruleXCoord > level.life[0]
            && emperorsMap[emperorName].ruleXCoord < level.life[1] - 1
          ) {
            gradients.push({
              x: emperorsMap[emperorName].ruleXCoord,
              y: level.yCoord - config.mainWidth / 2,
              width: 20,
              height: config.mainWidth,
              className: emperorsMap[level.name] ? 'filled-emperor' : 'filled'
            });
          }

          relationshipLabels.push({
            x: emperorsMap[emperorName].xCoord,
            y: level.yCoord + 3,
            text,
            life: level.life
          });
        }
      });
    });

    const line = d3.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    const svg = d3.select('.root')
      .append('svg');

    const root = svg.attr('width', width + margins.left + margins.right)
      .attr('height', currentBottomY + margins.top + margins.bottom)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    const emperorGradColors = [ 'rgba(81,112,153)', 'rgba(122,164,222)'];
    const gradColors = ['rgba(102,165,105)', 'rgba(146,199,144)'];

    const gradEmperor = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'filled-emperor-grad')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradEmperor.selectAll('stop')
      .data(emperorGradColors)
      .enter()
      .append('stop')
      .style('stop-color', function(d){ return d; })
      .attr('offset', function(d,i){
        return 100 * (i / (emperorGradColors.length - 1)) + '%';
      });

    const grad = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'filled-grad')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    grad.selectAll('stop')
      .data(gradColors)
      .enter()
      .append('stop')
      .style('stop-color', function(d){ return d; })
      .attr('offset', function(d,i){
        return 100 * (i / (gradColors.length - 1)) + '%';
      });

    const gridLinesNode = root.append('g');
    const mainLinesNode = root.append('g');
    const labelsNode = root.append('g');
    const relationshipLabelsNode = root.append('g');
    const gradientsNode = root.append('g');
    const ruleTimeNode = root.append('g');
    const ruleTimeConsortNode = root.append('g');

    gradientsNode
      .selectAll('rect')
      .data(gradients)
      .enter()
      .append('rect')
      .attr('class', item => item.className)
      .attr('x', item => item.x)
      .attr('y', item => item.y)
      .attr('width', item => item.width)
      .attr('height', item => item.height);

    gridLinesNode
      .selectAll('path')
      .data(gridLines)
      .enter()
      .append('path')
      .attr('class', 'grid-line')
      .classed('is-emperor', item => item.isEmperor)
      .datum(item => item.coords)
      .attr('d', data => line(data));

    ruleTimeNode
      .selectAll('rect')
      .data(ruleTime)
      .enter()
      .append('rect')
      .style('fill', '#51709d')
      .attr('x', item => item.x)
      .attr('y', item => item.y)
      .attr('width', item => item.width)
      .attr('height', item => item.height);

    ruleTimeConsortNode
      .selectAll('rect')
      .data(ruleTimeConsorts)
      .enter()
      .append('rect')
      .style('fill', '#51709d')
      .attr('x', item => item.x)
      .attr('y', item => item.y)
      .attr('width', item => item.width)
      .attr('height', item => item.height);

    mainLinesNode
      .selectAll('path')
      .data(mainLines)
      .enter()
      .append('path')
      .attr('class', 'main-line')
      .classed('is-prince', item => item.isPrince)
      .classed('is-consort', item => item.isConsort)
      .classed('is-emperor', item => item.isEmperor)
      .datum(item => item.coords)
      .attr('d', data => line(data));

    const labelsTextGroups = labelsNode
      .selectAll('g')
      .data(nameLabels)
      .enter()
      .append('g');

    const labelsTextNodes = labelsTextGroups
      .append('text')
      .attr('text-anchor', item => item.isEmperor ? 'end' : 'start')
      .attr('x', item => item.coords.x)
      .attr('y', item => item.coords.y)
      .attr('class', item => item.isEmperor ? 'name-label' : 'name-small-label')
      .text(item => item.text);

    const relationshipLabelsGroups = relationshipLabelsNode
      .selectAll('g')
      .data(relationshipLabels)
      .enter()
      .append('g');

    const relationshipLabelsTextNodes = relationshipLabelsGroups.append('text')
      .attr('class', 'relationship-label')
      .attr('text-anchor', 'end')
      .attr('x', item => item.x)
      .attr('y', item => item.y)
      .text(item => item.text);

    function drawRects() {
      labelsTextNodes
        .call(getBB);

      labelsTextGroups
        .filter(item => item.isEmperor)
        .insert('rect', 'text')
        .attr('width', item => item.bbox.width + 11)
        .attr('height', item => item.bbox.height)
        .attr('x', item => item.bbox.x - 3)
        .attr('y', item => item.bbox.y);

      relationshipLabelsTextNodes.call(getBB);

      relationshipLabelsGroups
        .filter(item => {
          if (item.life && item.bbox.x > item.life[0] && item.bbox.x + item.bbox.width < item.life[1]) {
            return false;
          } else {
            return true;
          }
        })
        .insert('rect', 'text')
        .attr('width', item => item.bbox.width + 6)
        .attr('height', item => item.bbox.height)
        .attr('x', item => item.bbox.x - 3)
        .attr('y', item => item.bbox.y);
    }

    if (fontIsActive) {
      setTimeout( () => {
        drawRects();
      }, 500);
    } else {
      fontActivationCallback = drawRects;
    }
  }
}

