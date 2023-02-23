import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// References:
// The non-react way
// https://dev.to/gilfink/creating-a-force-graph-using-react-and-d3-76c
// The react way
// https://reactfordataviz.com/articles/force-directed-graphs-with-react-and-d3v7/#

type SimpleForceGraphProps = {
  data: Record<any, any>;
};

const SimpleForceGraph: React.FC<SimpleForceGraphProps> = ({ data }) => {
  const { links, nodes } = data;
  // console.log(nodes);
  // Create a reference to the chart container
  const chartRef = useRef(null);
  // Create a reference to the tooltip container
  const tooltipRef = useRef(null);

  // const createSimulation = (nodes, links) => {
  //   return d3
  //     .forceSimulation(nodes)
  //     .force(
  //       'link',
  //       d3.forceLink(links).id((d) => d.id)
  //     )
  //     .force('charge', d3.forceManyBody().strength(-150))
  //     .force('x', d3.forceX(0.1))
  //     .force('y', d3.forceY(0.1))
  //     .force('center', d3.forceCenter());
  // };

  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);

  // re-create animation every time nodes change
  useEffect(() => {
    // Construct the forces
    const forceNode = d3.forceManyBody().strength(-150);
    const forceLink = d3.forceLink(links).id((d) => d.id);

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', forceLink)
      .force('charge', forceNode)
      .force('x', d3.forceX(0.1))
      .force('y', d3.forceY(0.1))
      .force('center', d3.forceCenter());

    // update state on every frame
    simulation.on('tick', () => {
      console.log('sim', simulation);
      setAnimatedNodes([...simulation.nodes()]);
      // setAnimatedLinks([...simulation.links()]);
    });

    // copy nodes into simulation
    simulation.nodes([...nodes]);
    // slow down with a small alpha
    simulation.alpha(0.1).restart();

    // stop simulation on unmount
    return () => simulation.stop();
  }, [nodes, links]);

  // useEffect(() => {
  //   // Check if the chart container reference exists
  //   if (chartRef.current) {
  //     // Get the dimensions of the chart container
  //     let { height, width } = chartRef.current.getBoundingClientRect();

  //     const linksData = data['links'];
  //     const nodesData = data['nodes'];

  //     // Define the drag function
  //     function drag(simulation) {
  //       function dragstarted(event) {
  //         // If the event is not active, increase the simulation's alpha target
  //         if (!event.active) simulation.alphaTarget(0.3).restart();
  //         // Store the subject's initial x and y positions
  //         event.subject.fx = event.subject.x;
  //         event.subject.fy = event.subject.y;
  //       }

  //       function dragged(event) {
  //         // Update the subject's x and y positions
  //         event.subject.fx = event.x;
  //         event.subject.fy = event.y;
  //       }

  //       function dragended(event) {
  //         // If the event is not active, reset the simulation's alpha target
  //         if (!event.active) simulation.alphaTarget(0);
  //         // Reset the subject's x and y positions
  //         event.subject.fx = null;
  //         event.subject.fy = null;
  //       }

  //       // Return the d3 drag event with the drag started, dragged, and drag ended functions
  //       return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  //     }

  //     // Add the tooltip element to the DOM
  //     const tooltip = chartRef.current;

  //     if (tooltip) {
  //       console.log('Inside tooltip div block');
  //       const tooltipDiv = document.createElement('div');
  //       tooltipDiv.classList.add(styles.tooltip);
  //       tooltipDiv.style.opacity = '0';
  //       tooltipDiv.id = 'graph-tooltip';
  //       document.body.appendChild(tooltipDiv);
  //     }

  //     const div = d3.select('#graph-tooltip');

  //     // Style and position the tooltip on hover
  //     const addTooltip = (event, label) => {
  //       div.transition().duration(200).style('opacity', 0.9);
  //       div
  //         .html((d) => `<div>${label}</div>`)
  //         .style('left', `${event.pageX + 4}px`)
  //         .style('top', `${event.pageY - 32}px`);
  //     };

  //     // Only show the message contain when a single skill is selected
  //     const showMessageContainer = (getNodeInfo, d) => {
  //       if (skillsData.length > 1) {
  //         setActiveStyle('text-inactive');
  //       } else {
  //         setActiveStyle('text-active');
  //       }
  //       if (d.group === 'user') {
  //         getNodeInfo(d);
  //       }
  //     };

  //     const removeTooltip = () => {
  //       div.transition().duration(200).style('opacity', 0);
  //     };

  //     // Create the simulation
  //     const simulation = createSimulation(nodesData, linksData);

  //     console.log('sim', simulation);

  //     // Select the chart container and bind an SVG to it
  //     const svg = d3
  //       .select(chartRef.current)
  //       .append('svg')
  //       .attr('viewBox', [-width / 2, -height / 2, width, height]);

  //     // Append a line for each element in the links data to the SVG
  //     const link = svg
  //       .append('g')
  //       .selectAll('line')
  //       .data(linksData)
  //       .join('line')
  //       .attr('stroke', '#ffe3d8')
  //       .attr('stroke-opacity', 1)
  //       .attr('stroke-width', 1);

  //     // Append a circle for each element in the nodes data to the SVG
  //     const node = svg
  //       .append('g')
  //       .selectAll('circle')
  //       .data(nodesData, (d) => d)
  //       .join('circle')
  //       .attr('stroke', '#1e73e2')
  //       .attr('stroke-width', 2)
  //       .attr('r', (d) => (d.level === '2' ? +d.group * 0.2 : 2))
  //       .attr('fill', '#1e73e2')
  //       .attr('fill-opacity', 1)
  //       .call(drag(simulation));

  //     node
  //       .on('mouseover', (event, d) => {
  //         console.log(d);
  //         addTooltip(event, d.label);
  //       })
  //       .on('mouseout', () => {
  //         removeTooltip();
  //       })
  //       .on('click', (event, d) => {
  //         console.log('clicked', d);
  //       });

  //     // Add a tick event to the simulation that updates the position of the links and nodes
  //     simulation.on('tick', () => {
  //       link
  //         .attr('x1', (d) => d.source.x)
  //         .attr('y1', (d) => d.source.y)
  //         .attr('x2', (d) => d.target.x)
  //         .attr('y2', (d) => d.target.y);

  //       node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
  //     });
  //   }
  // }, []);

  // Render the chart container
  return (
    <div style={{ height: '100vh' }}>
      <div ref={tooltipRef}></div>
      {/* <div style={{ height: '100%' }} ref={chartRef}></div> */}
      <svg viewBox="-415,-492,830,984">
        <g>
          {animatedNodes.map((node) => (
            <circle cx={node.x} cy={node.y} r={5} key={node.id} stroke="black" fill="transparent" />
          ))}
        </g>
        <g>
          {animatedLinks.map((link) => (
            <circle
              key={link.id}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              stroke="#ffe3d8"
              strokeOpacity={1}
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SimpleForceGraph;
