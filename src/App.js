import React, { Component } from 'react';
import * as d3 from 'd3';

import movies from './movies';

import './App.css';

// const quotes = [
//   "Go ahead, make my day.",
//   "I'll be back.",
//   "May the Force be with you.",
//   "There's no place like home.",
//   "You're gonna need a bigger boat."
// ];


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 600,
      height: 600,
      svg: null,
      padding: {
        top: 40,
        right: 20,
        bottom: 20,
        left: 70
      }
    }
  }

  componentDidMount = () => {
    const { width, height } = this.state;
    const svg = d3
      .select('svg')
      .attr('width', width)
      .attr('height', height);
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', '#000')
      .style('color', '#FFF')
      .style('padding', '3px');

    this.setState({ svg, tooltip }, () => this.plotMovies());
  }

  plotMovies = () => {
    const { width, height, padding, tooltip } = this.state;

    // const scale = d3.scaleLinear().domain([1,5]).range([12, 70]);
    // ^^ this maps values between 1 - 5 to 12 - 70

    // d3 has method to calculate extreme values of data
    // d3.extent(movies, movie => movie.runtime) ==> returns an array [smallestNum, largestNum]

    const runtimeDomain = d3.extent(movies, movie => movie.runtime);
    const xScale = d3.scaleLinear().domain(runtimeDomain).range([padding.left, width - padding.right]);

    // IMPORTANT
    // height is in first coord bc svg's read y coords from 0 being at top and max being at bottom
    const yScale = d3.scaleLinear().domain([0,1]).range([height - padding.top, padding.bottom]);

    const [ rMin, rMax ] = d3.extent(movies, movie => movie.maxTheaters);
    const rScale = d3.scaleLinear().domain([rMin, rMax]).range([5, 20]);

    const colorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(['green', 'red']);

    d3.select('svg')
      .selectAll('circle')
      .data(movies)
      .enter()
      // take nodes out of .enter() purgatory and append them to page as circles
      .append('circle')
      .attr('cx', movieObj => xScale(movieObj.runtime))
      .attr('cy', movieObj => yScale(movieObj.freshness))
      .attr('r', d => rScale(d.maxTheaters))
      .attr('fill', d => colorScale(d.freshness))
      .attr('stroke', 'black')
      .on('mouseover', d => {
        tooltip
          .text(d.title)
          .style('opacity', 1)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY}px`);
      })
      .on('mouseout', d => tooltip.style('opacity', 0));

    this.setState({ xScale, yScale }, () => this.plotAxes());
  }

  plotAxes = () => {
    this.xAxis();
    this.yAxis();
  }

  xAxis = () => {
    const { svg, width, height, padding, xScale } = this.state;
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${(height - padding.top)})`)
      .call(d3.axisBottom(xScale));

    // x-axis label
    svg
      .append('text')
      .attr('transform',
            `translate(${(width/2)}, ${height})`)
      .style('text-anchor', 'middle')
      .text('Runtime');
  }

  yAxis = () => {
    const { svg, padding, yScale, height, width } = this.state;
    svg
      .append('g')
      .attr("class", "y-axis")
      .attr('transform', `translate(${padding.left}, 0)`)
      .call(d3.axisLeft(yScale));
    // y-axis label
    svg
      .append('text')
      .attr('transform',
            `translate(${20}, ${height/2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('RottenTomatoes Score');
  }

  // componentDidMount() {
  //   // IMPORTANT
  //   // Rather than accessing nodes via _groups[0][0], -- this is dev way of saying this is bad
  //   // use d3.select('h1').node()
  //
  //   // lisp functional programming
  //
  //   d3
  //     // we're making sure that what happens in the id container
  //     .select('#container')
  //     /* looking for p tags on the page but there are NONE.
  //      Gives a Selection Object (which should be empty) back, not 'null'
  //      Here is where we can insert each quote */
  //     .selectAll('p')
  //     /* d3 creates as many 'p' _enter nodes as there are quotes
  //      if there's leftover elements that are not being used by d3,
  //      it puts them in the _exit selection */
  //     .data(quotes)
  //     /* .enter gives us new nodes within _enter.
  //      .exit gives us nodes are being unused
  //      _groups gives the update()
  //      https://bost.ocks.org/mike/join/ */
  //     .enter()
  //     /* for each enter node, it will append a p tag with the text of that data inside */
  //     .append('p')
  //     .text(d => d);
  // }

  render() {
    return (
      <div id='container'>
        <svg></svg>
      </div>
    );
  }
}

export default App;
