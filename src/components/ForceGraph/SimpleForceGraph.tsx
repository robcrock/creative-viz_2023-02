// @ts-nocheck

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type SimpleForceGraphProps = {
  data: Record<any, any>;
};

const SimpleForceGraph: React.FC<SimpleForceGraphProps> = ({ data }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      let { height, width } = ref.current.getBoundingClientRect();

      const links: any = data['links'];
      const nodes: any = data['nodes'];

      // The drag function is configured here and eventually bound to the nodes
      // Useful stackoverflow answer: https://stackoverflow.com/questions/42605261/d3-event-active-purpose-in-drag-dropping-circles
      const drag = (simulation) => {
        console.log('drag function called');

        console.log('drag event ', d3.event?.active);

        const dragstarted = (d) => {
          console.log('start drag');
          if (d.active !== 0) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        };

        const dragged = (d) => {
          console.log('dragged');
          d.fx = d.x;
          d.fy = d.y;
        };

        const dragended = (d) => {
          console.log('end drag');
          if (d.active === 0) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        };

        console.log(
          'function',
          d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
        );

        return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
      };

      // The simulation will be call for every tick and drag event
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3.forceLink(links).id((d) => d.id)
        )
        .force('charge', d3.forceManyBody().strength(-150))
        .force('x', d3.forceX(0.1))
        .force('y', d3.forceY(0.1))
        .force('center', d3.forceCenter());

      // Bind an SVG to the container
      const svg = d3
        .select(ref.current)
        .append('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

      // Append a group and line for each elem of the links array to the svg
      const link = svg
        .append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', '#ffe3d8')
        .attr('stroke-opacity', 1)
        .attr('stroke-width', 1);

      // Append a group and circle for each elem of the nodes array to the svg
      const node = svg
        .append('g')
        .selectAll('circle')
        .data(nodes, (d) => d)
        .join('circle')
        .attr('stroke', '#ffeb7d')
        .attr('stroke-width', 2)
        .attr('r', 5)
        .attr('fill', '#f2d974')
        .attr('fill-opacity', 1)
        .call(drag(simulation));

      // Create the event listeners to the nodes
      // node
      //   .on('mouseover', (d) => {
      //     addTooltip(nodeHoverTooltip, d, d3.event.pageX, d3.event.pageY);
      //   })
      //   .on('mouseout', () => {
      //     removeTooltip();
      //   })
      //   .on('click', (d) => {
      //     setRecipient(d);
      //     showMessageContainer(getNodeInfo, d);
      //   });

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });

      // const tooltipText = node.append("title")
      //     .text(d => d.id);

      // console.log(links)

      // Return the view box and ability to stop the simulation
      // return {
      //   destroy: () => {
      //     simulation.stop();
      //   },
      //   nodes: () => {
      //     return svg.node();
      //   }
      // };

      // let csvtext = nodes
      //   .map((d) => d.index + ',' + d.cx + ',' + d.y + ',' + d.label + ',' + d.id + '\n')
      //   .join('');
      // console.log(csvtext);

      // let csvtext2 = links
      //   .map(
      //     (d) =>
      //       d.index + ',' + d.source.x + ',' + d.source.y + ',source' + ',' + d.source.id + '\n'
      //   )
      //   .join('');
      // console.log(csvtext2);

      // let csvtext3 = links
      //   .map(
      //     (d) =>
      //       d.index + ',' + d.target.x + ',' + d.target.y + ',target' + ',' + d.target.id + '\n'
      //   )
      //   .join('');
      // console.log(csvtext3);
    }
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ height: '100%' }} ref={ref}></div>
    </div>
  );
};

export default SimpleForceGraph;
