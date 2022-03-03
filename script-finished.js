/* global d3 */

async function init(){
  const dim = 600
  const yMargin = 40
  const xMargin = 50
  const dateFmt = d3.timeFormat('%b %d, %Y')
  
  const data = await d3.json("https://cdn.glitch.com/9436007d-ab0f-4f9c-8e0b-7865a784f0dd%2Fphx_dry_streaks.json?v=1606675289659")  
  
  const months = d3.range(0, 12).map(d => ({
    index: d,
    label: d3.timeFormat("%b")(new Date(2020, d, 1)),
    xEnd: Math.cos(d/12 * 2 * Math.PI + Math.PI/2),
    yEnd: -Math.sin(d/12 * 2 * Math.PI + Math.PI/2)
  }))
  
  const streaksDataFull = data.filter(d => d.days > 1)
    .map((d,j) => {
      const lineData = d3.timeDay.range(new Date(d.start), new Date(d.end))
        .map((e,i) => ({
          parentIndex: j,
          index: i,
          date: e,
          r: i / 30,
          angle: -(d3.timeDay.count(new Date(d3.timeYear.round(e)), e) / 365) * Math.PI * 2
        }))
      return lineData  
    })
  
  const svg = d3.select('#viz')
    .append('svg')
    .attr('height', dim)
    .attr('width', dim)

  const ctr = (dim - 2 * xMargin) / 2
  
  const monthRadii = svg.append('g').attr('class', 'months')
    .attr('transform', `translate(${ctr + xMargin}, ${ctr + xMargin})`)
    .selectAll('g.month')
    .data(months)
    .join(enter => {
      const e = enter.append('g')
        .attr('class', 'month')
      e.append('line')
      e.append('text')
      return e;
    })
  
  monthRadii.selectAll('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', d => ctr * d.xEnd)
    .attr('y2', d => ctr * d.yEnd)
    .attr('stroke', '#ddd')
  monthRadii.selectAll('text')
    .text(d => d.label)
    .attr('x', d => 1.07 * ctr * d.xEnd)
    .attr('y', d => 1.07 * ctr * d.yEnd)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
  
  const timeRings = svg.append('g').attr('class', 'rings')
    .attr('transform', `translate(${ctr + xMargin}, ${ctr + xMargin})`)
    .selectAll('g.ring')
    .data(d3.range(1, 7))
    .join(enter => {
      const e = enter.append('g')
        .attr('class', 'ring')
      e.append('circle')
      return e;
    })
 
  timeRings.selectAll('circle')
    .attr('r', d => d/6 * ctr)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', 'none')
    .attr('stroke', '#ddd')
  
  const line = d3.lineRadial()
    .angle(d => d.angle)
    .radius(d => d.r * ctr/6)
  
  const streaks = svg.append('g').attr('class', 'streaks')
    .attr('transform', `translate(${ctr + xMargin}, ${ctr + xMargin})`)
  
  const streakLabels = svg.append('g').attr('class', 'streak-labels')
    .attr('transform', `translate(${ctr + xMargin}, ${ctr + xMargin})`)
  
  let yr = 1896;
  
  svg.append('text')
    .attr('class', 'year')
    .attr('x', xMargin)
    .attr('y', yMargin)
    .attr('font-size', '24px')
  
  const update = () => {
    svg.select('text.year').text(yr)
    
    const streaksData = streaksDataFull
      .filter(d => {
        const thisDate = new Date(d[0].date)
        return thisDate <= new Date(yr, 12, 31) &&
          thisDate >= new Date(yr - 10, 1, 1)
      });
    streaks.selectAll('path.streak')
      .data(streaksData, d => d[0].date)
      .join(
        enter => 
          enter.append('path')
            .attr('class', 'streak')
            .attr('stroke-opacity', 1),
        update => 
          update.call(sel => sel.transition().attr('stroke-opacity', 0.5)),
        exit => 
          exit.call(sel => sel.transition().attr('stroke-opacity', 0.1).remove())
      )
      .attr('d', line)
      .attr('stroke', d => d.length > 150 
            ? 'gold' 
            : d.length > 120 
            ? 'red' 
            : 'darkred')
      .attr('fill', 'none')

    streakLabels
      .selectAll('text.streak')
      .data(streaksData.filter(d => d.length > 120).map(d => d.slice(-1)[0]))
      .join('text')
      .attr('class', 'streak')
      .attr('x', d => ctr/6 * d.r * Math.cos(d.angle - Math.PI/2))
      .attr('y', d => ctr/6 * d.r * Math.sin(d.angle - Math.PI/2))
      .text(d => dateFmt(d.date))
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
    
    if (yr >= 2020){
      t.stop();
    } else {
      yr += 1
    }
  }
  
  // update();
  const t = d3.interval(update, 500)

}

init()