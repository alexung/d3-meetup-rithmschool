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
      svg: null
    }
  }

  componentDidMount = () => {
    const { width, height } = this.state;
    const svg = d3
      .select('svg')
      .attr('width', width)
      .attr('height', height);

    this.plotMovies();
    this.setState({ svg })
  }

  plotMovies = () => {
    const { width, height } = this.state;

    // const scale = d3.scaleLinear().domain([1,5]).range([12, 70]);
    // ^^ this maps values between 1 - 5 to 12 - 70

    // d3 has method to calculate extreme values of data
    // d3.extent(movies, movie => movie.runtime) ==> returns an array [smallestNum, largestNum]

    const runtimeDomain = d3.extent(movies, movie => movie.runtime);
    const xScale = d3.scaleLinear().domain(runtimeDomain).range([0, width]);

    // IMPORTANT
    // height is in first coord bc svg's read y coords from 0 being at top and max being at bottom
    const yScale = d3.scaleLinear().domain([0,1]).range([height, 0]);

    d3.select('svg')
      .selectAll('circle')
      .data(movies)
      .enter()
      // take nodes out of .enter() purgatory and append them to page as circles
      .append('circle')
      .attr('cx', movieObj => xScale(movieObj.runtime))
      .attr('cy', movieObj => yScale(movieObj.freshness))
      .attr('r', 8)
      .attr('fill', 'blue');
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
