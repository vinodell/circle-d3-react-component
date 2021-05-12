import React, { useState } from 'react'
import { scaleLinear } from 'd3-scale'
import { select } from 'd3'
import { arc } from 'd3-shape'

const DEFAULT_HEIGHT = 500
const DEFAULT_WIDTH = 960
const RADIUS = 2 * Math.PI

// eslint-disable-next-line
const drawLine = ({ width, height, number }) => {
  const scaleY = scaleLinear().domain([0, 100]).range([0, height])
  const scaleX = scaleLinear().domain([0, 100]).range([0, width])
  const scaleColor = scaleLinear().domain([0, 100]).range(['#2DD3AB', '#13C298'])

  const myArc = select('#chart').selectAll('.circle-bar').data(number)

  myArc
    .enter()
    .append('path')
    .attr('class', 'circle-bar')
    .attr('transform', `translate(${scaleX(40)},${scaleY(50)})`)
    // eslint-disable-next-line
    .attr('d', arc().innerRadius(100).outerRadius(150).startAngle(0).endAngle(0))
    .attr('stroke', 'black')
    .attr('fill', 'none')

  myArc
    .attr('stroke', 'black')
    .transition()
    .attr(
      'd',
      arc()
        .innerRadius(100)
        .outerRadius(150)
        .startAngle(0)
        .endAngle((RADIUS / 100) * number)
    )
    .transition()
    .attr('fill', scaleColor(number))

  myArc.exit().remove()

  const textIndicator = select('#chart').selectAll('.my-text').data(number)

  textIndicator
    .enter()
    .append('text')
    .attr('class', 'my-text')
    .attr('x', scaleX(40))
    .attr('y', scaleY(50))
    .attr('text-anchor', 'middle')
    .attr('font-size', 40)
    .attr('stroke', scaleColor(number))
    .attr('fill', scaleColor(number))
    .attr('stroke-width', '3')
    .text(`${number}%`)

  textIndicator
    .attr('stroke', scaleColor(number))
    .attr('fill', scaleColor(number))
    .transition()
    .duration(2000)
    .text(`${number}%`)

  textIndicator.exit().remove()
}

const Dummy = () => {
  const [width] = useState(DEFAULT_WIDTH)
  const [height] = useState(DEFAULT_HEIGHT)
  const [number, setNumber] = useState(0)
  const onChange = (e) => {
    setNumber(e.target.value)
  }
  const onClick = () => {
    drawLine({
      width,
      height,
      number
    })
  }
  return (
    <div>
      <div className="min-w-screen min-h-screen bg-gray-900 flex flex-wrap content-around justify-center px-5 py-5">
        <div className="bg-indigo-600 text-white rounded shadow-xl py-5 px-5 w-full lg:w-10/12 xl:w-3/4">
          <div className="flex items-end">
            <svg width={width} height={height} id="chart" />
          </div>
          <input type="number" className="text-gray-700" onChange={onChange} value={number} />
          <button type="button" onClick={onClick}>
            __send__
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dummy
