import React from 'react';

import SankeyPlot from './SankeyPlot';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Plots/SankeyPlot',
  component: SankeyPlot,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: "color" },
  // },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <SankeyPlot {...args} />;

export const Normal = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Normal.args = {};
