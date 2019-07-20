import * as d3 from 'd3';
import { chapters, getBB, xScale, parseTime } from './config';

const chaptersLevels = {
  first: 440,
  second: 460,
  third: 480,
  fourth: 510,
};

export default class DrawChapters {
  constructor(selection, props) {
    this.props = props;

    this.chaptersNode = selection
      .selectAll('g')
      .data(chapters.map(chapter => ({
        ...chapter,
        period: [xScale(parseTime(chapter.period[0])), xScale(parseTime(chapter.period[1]))]
      })))
      .enter()
      .append("g")
      .attr('class', 'chapter-g');

    this.chaptersNode
      .append('line')
      .attr('class', 'hidden-chapter-line')
      .attr("x1", item => item.period[0])
      .attr("y1", item => chaptersLevels[item.level])
      .attr("x2", item => item.period[1])
      .attr("y2", item => chaptersLevels[item.level])
      .call(this.bindHoverEvent);

    this.chaptersNode
      .append('line')
      .attr('class', 'chapter-line')
      .attr("x1", item => item.period[0])
      .attr("y1", item => chaptersLevels[item.level])
      .attr("x2", item => item.period[1])
      .attr("y2", item => chaptersLevels[item.level])
      .call(this.bindHoverEvent);

    this.chaptersNode
      .append("text")
      .attr('class', 'chapter-label')
      .attr('text-anchor', 'middle')
      .attr('x', item => {
        let xPosition = item.period[0] + (item.period[1] - item.period[0]) / 2;

        if (item.position === 'right') {
          xPosition = item.period[1] + 65
        }

        return xPosition;
      })
      .attr('y', item => {
        let positionAdjustment = null;

        if (item.position === 'top') {
          positionAdjustment = 10;
        } else if (item.position === 'bottom') {
          positionAdjustment = -22;
        } else if (item.position === 'right') {
          positionAdjustment = -5.5;
        }

        return chaptersLevels[item.level] - positionAdjustment;
      })
      .text(item => item.label)
      .call(getBB);

    this.chaptersNode.append('rect')
      .attr('width', item => item.bbox.width)
      .attr('height', item => item.bbox.height)
      .attr('x', item => item.bbox.x)
      .attr('y', item => item.bbox.y)
      .attr('class', 'hidden-rect')
      .call(this.bindHoverEvent)
  }

  bindHoverEvent = (selection) => {
    const self = this;

    selection
      .on('mouseenter', function(chapter) {
        self.props.hoverLinesByChapter(chapter, true);

        d3.select(this.parentNode)
            .classed('hovered-chapter', true);
      })
      .on('mouseleave', function(chapter) {
        self.props.hoverLinesByChapter(chapter, false);

        d3.select(this.parentNode)
          .classed('hovered-chapter', false);
      });
  }
}