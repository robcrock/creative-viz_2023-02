import React, { useEffect, useRef } from 'react';
import { SimulationNodeDatum } from 'd3-force';
import * as d3 from 'd3';
import styles from './forceGraph.module.css';
import { DataObjectType, NodeType } from './types';
import { SimulationLinkDatum } from 'd3';

type SimpleForceGraphProps = {
  data: DataObjectType;
};

interface MyNodeDatum extends SimulationNodeDatum {
  id: string | number;
}

interface MyLinkDatum extends SimulationLinkDatum<MyNodeDatum> {
  id: string | number;
  source: {
    id: string | number;
    x: number;
    y: number;
  };
  target: {
    id: string | number;
    x: number;
    y: number;
  };
  value: number;
}

const SimpleForceGraph: React.FC<SimpleForceGraphProps> = ({ data }) => {
  // Create a reference to the chart container
  const chartRef = useRef<SVGSVGElement>(null);
  // Create a reference to the tooltip container
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the chart container reference exists
    if (chartRef.current) {
      // Get the dimensions of the chart container
      let { height, width } = chartRef.current.getBoundingClientRect();

      const linksData = data['links'];
      const nodesData = data['nodes'];

      // Define the drag function
      function drag(simulation: any) {
        function dragstarted(event: any) {
          // If the event is not active, increase the simulation's alpha target
          if (!event.active) simulation.alphaTarget(0.3).restart();
          // Store the subject's initial x and y positions
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          // Update the subject's x and y positions
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event: any) {
          // If the event is not active, reset the simulation's alpha target
          if (!event.active) simulation.alphaTarget(0);
          // Reset the subject's x and y positions
          event.subject.fx = null;
          event.subject.fy = null;
        }

        // Return the d3 drag event with the drag started, dragged, and drag ended functions
        return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
      }

      // Add the tooltip element to the DOM
      const tooltip = chartRef.current;
      if (!tooltip) {
        const tooltipDiv = document.createElement('div');
        tooltipDiv.classList.add(styles.tooltip);
        tooltipDiv.style.opacity = '0';
        tooltipDiv.id = 'graph-tooltip';
        document.body.appendChild(tooltipDiv);
      }
      const div = d3.select('#graph-tooltip');

      // Create the simulation
      const simulation = d3
        .forceSimulation(nodesData as unknown as MyNodeDatum[])
        .force(
          'link',
          d3.forceLink(linksData as unknown as MyLinkDatum[]).id((d) => (d as MyLinkDatum).id)
        )
        .force('charge', d3.forceManyBody().strength(-150))
        .force('x', d3.forceX(0.1))
        .force('y', d3.forceY(0.1))
        .force('center', d3.forceCenter());

      // Select the chart container and bind an SVG to it
      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

      // Append a line for each element in the links data to the SVG
      const link = svg
        .append('g')
        .selectAll('line')
        .data(linksData)
        .join('line')
        .attr('stroke', '#ffe3d8')
        .attr('stroke-opacity', 1)
        .attr('stroke-width', 1);

      // Append a circle for each element in the nodes data to the SVG
      const node = svg
        .append('g')
        .selectAll('circle')
        .data(nodesData, (_, i) => i)
        .join('circle')
        .attr('stroke', '#ffeb7d')
        .attr('stroke-width', 2)
        .attr('r', (d) => (d.level === '2' ? +d.group * 0.2 : 2))
        .attr('fill', '#f2d974')
        .attr('fill-opacity', 1)
        .call(drag(simulation) as any);

      node
        .on('mouseover', (d) => {
          console.log('mouseover', d);
          // addTooltip((node) => `<div>${node.name}</div>`, d, d3.event.pageX, d3.event.pageY);
        })
        .on('mouseout', () => {
          console.log('mouseout');
          // removeTooltip();
        })
        .on('click', (d) => {
          console.log('clicked', d);
          console.log('target', d.target);
          // setRecipient(d);
          // showMessageContainer(getNodeInfo, d);
        });

      // Add a tick event to the simulation that updates the position of the links and nodes
      simulation.on('tick', () => {
        link
          .attr('x1', (d) => (d as unknown as MyLinkDatum).source.x)
          .attr('y1', (d) => (d as unknown as MyLinkDatum).source.y)
          .attr('x2', (d) => (d as unknown as MyLinkDatum).target.x)
          .attr('y2', (d) => (d as unknown as MyLinkDatum).target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });
    }
  }, []);

  // Render the chart container
  return (
    <div style={{ height: '100vh' }}>
      <div ref={tooltipRef}></div>
      <svg ref={chartRef} height="100%" width="100%"></svg>
    </div>
  );
};

export default SimpleForceGraph;
