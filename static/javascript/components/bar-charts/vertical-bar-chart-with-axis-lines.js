import React from 'react';
import * as d3 from "d3";
import { generateArray } from '../../data-layer/array-processors';

export default class SvgVerticalBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: generateArray()
    };
  }

  componentDidMount() {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const { xScale, yScale } = this.getScales(width, height);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisRight(yScale)
      .ticks(10)
      .tickSize(width)
      .tickPadding(-1 * (width + 10));

    const chart = d3.select(this.chart)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    chart
      .append("g")
        .attr('class', 'chart-inner')
        .attr("transform", `translate(${margin.left},${margin.top})`);

    chart.select('.chart-inner')
      .append('g')
        .attr("class", "axis axis--x")
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
      .append("text")
        .attr("y", 16)
        .attr("x", width + 20)
        .text("Labels");

    const barsContainer = chart.select('.chart-inner')
      .append("g")
        .attr('class', 'chart-content');

    const bar = barsContainer.selectAll('g')
      .data(this.state.data)
      .enter()
        .append('g')
          .attr('transform', (x, i) => `translate(${xScale(x.label)}, 0)`);

    bar.append('rect')
      .attr("width", xScale.bandwidth())
      .attr("height", (x) => height - yScale(x.val))
      .attr('y', (x) => yScale(x.val));

    bar.append('text')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', (x) => yScale(x.val) + 20)
      .text((x) => x.val);

    chart.select('.chart-inner')
      .append('g')
        .attr("class", "axis axis--y")
        .call(yAxis);
  }

  getScales(width, height) {
    const xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(this.state.data.map((x) => x.label));

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.state.data, x => x.val)])
      .range([height, 0]);

    return { xScale, yScale };
  }

  render() {
    return (
      <div>
        <svg className="bar-chart--basic bar-charts--axis-with-lines" ref={(r) => this.chart = r}></svg>
      </div>
    );
  }
}
