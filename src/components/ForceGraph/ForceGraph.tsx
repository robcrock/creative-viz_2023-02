import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './forceGraph.module.css';

type SimpleForceGraphProps = {
  data: Record<any, any>;
};

const SimpleForceGraph: React.FC<SimpleForceGraphProps> = ({ data }) => {
  // Create a reference to the chart container
  const chartRef = useRef(null);
  // Create a reference to the tooltip container
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Check if the chart container reference exists
    if (chartRef.current) {
      // Get the dimensions of the chart container
      let { height, width } = chartRef.current.getBoundingClientRect();

      const linksData = data['links'];
      const nodesData = data['nodes'];

      // Define the drag function
      function drag(simulation) {
        function dragstarted(event) {
          // If the event is not active, increase the simulation's alpha target
          if (!event.active) simulation.alphaTarget(0.3).restart();
          // Store the subject's initial x and y positions
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          // Update the subject's x and y positions
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
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

      // Style and position the tooltip on hover
      const addTooltip = (hoverTooltip, d, x, y) => {
        div.transition().duration(200).style('opacity', 0.9);
        div
          .html(hoverTooltip(d))
          .style('left', `${x}px`)
          .style('top', `${y - 28}px`);
      };

      // Only show the message contain when a single skill is selected
      const showMessageContainer = (getNodeInfo, d) => {
        if (skillsData.length > 1) {
          setActiveStyle('text-inactive');
        } else {
          setActiveStyle('text-active');
        }
        if (d.group === 'user') {
          getNodeInfo(d);
        }
      };

      const removeTooltip = () => {
        div.transition().duration(200).style('opacity', 0);
      };

      // Create the simulation
      const simulation = d3
        .forceSimulation(nodesData)
        .force(
          'link',
          d3.forceLink(linksData).id((d) => d.id)
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
        .data(nodesData, (d) => d)
        .join('circle')
        .attr('stroke', '#ffeb7d')
        .attr('stroke-width', 2)
        .attr('r', (d) => (d.level === '2' ? +d.group * 0.2 : 2))
        .attr('fill', '#f2d974')
        .attr('fill-opacity', 1)
        .call(drag(simulation));

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
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });
    }
  }, []);

  // Render the chart container
  return (
    <div style={{ height: '100vh' }}>
      <div ref={tooltipRef}></div>
      <div style={{ height: '100%' }} ref={chartRef}></div>
    </div>
  );
};

export default SimpleForceGraph;
