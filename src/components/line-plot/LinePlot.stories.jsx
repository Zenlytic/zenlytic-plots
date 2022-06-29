import React from 'react';

import LinePlot from './LinePlot';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Plots/LinePlot',
  component: LinePlot,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: "color" },
  // },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <LinePlot {...args} />;

export const Normal = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Normal.args = {
  height: 400,
  width: 1000,
  lines: [
    [
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-11T00:00:00',
        ORDERS_TOTAL_REVENUE: 14157.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-12T00:00:00',
        ORDERS_TOTAL_REVENUE: 13975.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-13T00:00:00',
        ORDERS_TOTAL_REVENUE: 13993,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-14T00:00:00',
        ORDERS_TOTAL_REVENUE: 14088,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-15T00:00:00',
        ORDERS_TOTAL_REVENUE: 14731.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-16T00:00:00',
        ORDERS_TOTAL_REVENUE: 15039.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-17T00:00:00',
        ORDERS_TOTAL_REVENUE: 15060,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-18T00:00:00',
        ORDERS_TOTAL_REVENUE: 16042.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-19T00:00:00',
        ORDERS_TOTAL_REVENUE: 14914.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-20T00:00:00',
        ORDERS_TOTAL_REVENUE: 15413,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-21T00:00:00',
        ORDERS_TOTAL_REVENUE: 15946.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-22T00:00:00',
        ORDERS_TOTAL_REVENUE: 12591.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-23T00:00:00',
        ORDERS_TOTAL_REVENUE: 15361,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-24T00:00:00',
        ORDERS_TOTAL_REVENUE: 16153,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-25T00:00:00',
        ORDERS_TOTAL_REVENUE: 16485.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-26T00:00:00',
        ORDERS_TOTAL_REVENUE: 13294,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-27T00:00:00',
        ORDERS_TOTAL_REVENUE: 13637.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-05-31T00:00:00',
        ORDERS_TOTAL_REVENUE: 44971,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-01T00:00:00',
        ORDERS_TOTAL_REVENUE: 13563,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-02T00:00:00',
        ORDERS_TOTAL_REVENUE: 12669,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-03T00:00:00',
        ORDERS_TOTAL_REVENUE: 41311,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-04T00:00:00',
        ORDERS_TOTAL_REVENUE: 37940,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-05T00:00:00',
        ORDERS_TOTAL_REVENUE: 39942,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-06T00:00:00',
        ORDERS_TOTAL_REVENUE: 42749,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-07T00:00:00',
        ORDERS_TOTAL_REVENUE: 38493.5,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-08T00:00:00',
        ORDERS_TOTAL_REVENUE: 43073,
      },
      {
        ORDERS_ORDER_CREATED_AT_DATE: '2022-06-09T00:00:00',
        ORDERS_TOTAL_REVENUE: 44876.5,
      },
    ],
  ],
  yAxisZenlyticFormat: '$.3~s',
  xAxisZenlyticFormat: 'date',
  backgroundColor: 'red',
  plotColor: 'blue',
  accentColor: 'lightgray',
  axisColor: '#8A8A8A',
  yAxisNumberOfTicks: 4,
  xAxisDataIndex: 'ORDERS_ORDER_CREATED_AT_DATE',
  yAxisDataIndex: 'ORDERS_TOTAL_REVENUE',
  xAxisLabel: 'Order Created At Date',
  yAxisLabel: 'Total Revenue',
  minTickGap: 100,
};
