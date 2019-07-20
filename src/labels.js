import { names, xScale, getBB, parseTime } from './config';
import { levels as linesLevels } from './lines';

const namesLevels = {
  first: 185,
  second: 90,
  third: 18
};

export default class DrawLabels {
  constructor(selection, props) {
    this.namesNodes = selection
      .selectAll('g')
      .data(names.map(name => ({
        ...name,
        position: xScale(parseTime(name.position)),
        smallLabelPosition: xScale(parseTime(name.smallLabelPosition))
      })))
      .enter()
      .append('g')
      .classed('label-container', true);

    this.namesNodes
      .append('text')
      .attr('class', 'name-label')
      .attr('x', item => item.position + (item.noShift ? -5 : 9))
      .attr('y', item => namesLevels[item.level] - 11)
      .text(item => item.label)
      .call(getBB);

    this.namesNodes
      .filter(name => name.annotationLine)
      .append('line')
      .attr('class', 'annotation-line')
      .attr('x1', item => item.position)
      .attr('y1', item => namesLevels[item.level] - 4)
      .attr('x2', item => item.position)
      .attr('y2', item => linesLevels.throne - 8);

    this.namesNodes
      .filter(name => name.smallAnnotationLine)
      .append('line')
      .attr('class', 'annotation-line')
      .attr('x1', item => item.smallLabelPosition)
      .attr('y1', item => linesLevels[item.smallLabelPointTo] + 8)
      .attr('x2', item => item.smallLabelPosition)
      .attr('y2', item => linesLevels[item.smallLabelLevel] + 4);

    this.namesNodes.append('rect')
      .attr('width', item => item.bbox.width)
      .attr('height', item => item.bbox.height)
      .attr('x', item => item.bbox.x)
      .attr('y', item => item.bbox.y)
      .attr('class', 'hidden-rect')
      .on('mouseenter', function(item) {
        props.hoverLabel(item.key, true);
      })
      .on('mouseleave', function(item) {
        props.hoverLabel(item.key, false);
      });

    const withSmallLabels = this.namesNodes
      .filter(item => item.smallLabel);

    withSmallLabels
      .append('text')
      .attr('class', 'name-small-label')
      .attr('y', item => linesLevels[item.smallLabelLevel] + 4)
      .selectAll('tspan')
      .data(item => item.smallLabel.map(text => ({
        text,
        xPosition: item.smallLabelPosition + (item.smallLabelShift || -3)
      })))
      .enter()
      .append('tspan')
      .attr('x', item => item.xPosition)
      .attr('dy', '1.2em')
      .text(item => item.text);

    withSmallLabels
      .selectAll('text.name-small-label')
      .call(getBB);

    withSmallLabels.append('rect')
      .attr('width', item => item.bbox.width)
      .attr('height', item => item.bbox.height)
      .attr('x', item => item.bbox.x)
      .attr('y', item => item.bbox.y)
      .attr('class', 'hidden-rect')
      .on('mouseenter', function(item) {
        props.hoverLabel(item.key, true);
      })
      .on('mouseleave', function(item) {
        props.hoverLabel(item.key, false);
      });
  }

  toggleLabel = (key, status) => {
    this.namesNodes
      .filter(item => item.key === key)
      .classed('hovered', status);
  }
};
