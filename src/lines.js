import * as d3 from 'd3';
import { xScale, parseTime } from './config';

const line = d3.line()
  .x(function (d) {
    return d.x;
  })
  .y(function (d) {
    return d.y;
  });

const connectorsLine = d3.line()
  .curve(d3.curveBundle.beta(1))
  .x(function (d) {
    return d.x;
  })
  .y(function (d) {
    return d.y;
  });

export const levels = {
  outpetriii: 15,
  outnickolayii: 148,
  out: 88,
  throne: 185,
  first: 202,
  second: 219,
  third: 236,
  fourth: 253,
  martaout: 265,
  petriiout: 290,
  petriiiout: 310
};

const getLinesCoords = (chronology) => {
  const results = chronology.levels.reduce((accum, item) => {
    let leftCorrector = 0;
    let rightCorrector = 0;

    if (item.radiusLeft) {
      leftCorrector = item.radiusLeft;
    }

    if (item.radiusRight) {
      rightCorrector = item.radiusRight;
    }

    let coords = null;

    if (!item.doNotRenderHorizontal) {
      coords = [
        {
          x: item.points[0] + leftCorrector,
          y: levels[item.level],
          key: chronology.key,
          color: chronology.color
        },
        {
          x: item.points[1] - rightCorrector,
          y: levels[item.level],
          key: chronology.key,
          color: chronology.color
        }
      ];
    }

    accum.push(coords);
    return accum;
  }, []);

  return results.filter(item => item);
};

const getConnectorCoords = (chronology) => {
  const results = chronology.levels.reduce((accum, item, index, list) => {
    let coords = [];
    const prevItem = list[index - 1];

    if (prevItem) {
      let leftCorrector = 0;
      let rightCorrector = 0;

      if (item.radiusLeft) {
        leftCorrector = item.radiusLeft;
      }

      if (prevItem.radiusRight) {
        rightCorrector = prevItem.radiusRight;
      }

      coords = coords.concat([
        {
          x: item.points[0] - rightCorrector,
          y: levels[prevItem.level],
          key: chronology.key,
          color: chronology.color,
          isBorn: item.isBorn
        },
        {
          x: item.points[0],
          y: levels[prevItem.level],
          key: chronology.key,
          color: chronology.color
        },
        {
          x: item.points[0],
          y: levels[item.level],
          key: chronology.key,
          color: chronology.color
        },
        {
          x: item.points[0] + leftCorrector,
          y: levels[item.level],
          key: chronology.key,
          color: chronology.color
        }
      ])
    }

    accum.push(coords);
    return accum;
  }, []);

  return results.filter(item => item.length);
};

export default class DrawLines {
  constructor(selection, props) {
    this.props = props;
    const { chronology } = props;
    const points = chronology.map(tsar => getLinesCoords(tsar));
    const connectors = chronology.map(tsar => getConnectorCoords(tsar));

    const hiddenLinesRoot = selection
      .append('g');

    const connectorsRoot = selection
      .append('g');

    const linesRoot = selection
      .append('g');

    this.linesNodes = linesRoot
      .selectAll('g')
      .data(points)
      .enter()
      .append('g');

    this.hiddenLinesNodes = hiddenLinesRoot
      .selectAll('g')
      .data(points)
      .enter()
      .append('g');

    this.connectorsNodes = connectorsRoot
      .selectAll('g')
      .data(connectors)
      .enter()
      .append('g');

    this.connectorsNodes
      .selectAll('path')
      .data(item => item)
      .enter()
      .append('path')
      .attr('d', data => connectorsLine(data))
      .attr('stroke', item => item[0].color)
      .classed('is-born', item => item[0].isBorn)
      .call(this.bindToggleEvents);

    this.hiddenLinesNodes
      .selectAll('path')
      .data(item => item)
      .enter()
      .append('path')
      .attr('class', 'hidden-lines')
      .attr('d', data => line(data))
      .call(this.bindToggleEvents);

    this.linesNodes
      .selectAll('path')
      .data(item => item)
      .enter()
      .append('path')
      .attr('d', data => line(data))
      .attr('stroke', item => item[0].color)
      .call(this.bindToggleEvents);
  }

  bindToggleEvents = (selection) => {
    selection
      .on('mouseenter', (hoveredItem) => {
        this.props.toggleLine(hoveredItem[0].key, true);
      })
      .on('mouseleave', (hoveredItem) => {
        this.props.toggleLine(hoveredItem[0].key, false);
      });
  }

  toggleLine = (key, visibilityStatus) => {
    this.linesNodes
      .filter(item => item[0][0].key === key)
      .classed('hovered-group', visibilityStatus);

    this.connectorsNodes
      .filter(item => item[0][0].key === key)
      .classed('hovered-group', visibilityStatus);
  }
}
