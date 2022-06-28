/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import formatValue from '../../utils/formatValue';
import getD3DataFormatter from '../../utils/getD3DataFormatter';
import TooltipHandler from '../tooltip-handler/TooltipHandler';

function HistogramPlot({
  plotColor = '#8a8a8a',
  width = 300,
  height = 300,
  tickCount = 5,
  minTickGap = 100,
  interval = 'preserveEnd',
  xAxis = {},
  yAxis = {},
  data: lines,
  margin = PLOT_MARGIN,
  CustomHoverTooltip = undefined,
  CustomClickTooltip = undefined,
  onUpdateBrush = () => {},
}) {
  const data = [
    {
      id: 'f83be8a3-bb50-4025-9f78-1a98aac3ad30',
      type: 'default',
      rangeBottom: 46,
      rangeTop: 55.46376811594203,
      value: 2029,
    },
    {
      id: '2fe88c2d-3fb0-4c66-8155-aa3e1a2f7916',
      type: 'default',
      rangeBottom: 55.46376811594203,
      rangeTop: 64.92753623188406,
      value: 204,
    },
    {
      id: '609a955d-2b7b-440c-b704-e77cab3e9813',
      type: 'default',
      rangeBottom: 64.92753623188406,
      rangeTop: 74.3913043478261,
      value: 159,
    },
    {
      id: '2a881baa-f7a5-4afa-810f-1149e715a04f',
      type: 'default',
      rangeBottom: 74.3913043478261,
      rangeTop: 83.85507246376812,
      value: 459,
    },
    {
      id: '26af7df1-252f-4ed0-afe2-6fbd8d876901',
      type: 'default',
      rangeBottom: 83.85507246376812,
      rangeTop: 93.31884057971016,
      value: 51,
    },
    {
      id: '63434c2d-a54f-4770-ac6d-600a395d685e',
      type: 'default',
      rangeBottom: 93.31884057971016,
      rangeTop: 102.78260869565217,
      value: 52,
    },
    {
      id: '3547f20b-8faf-49f9-a191-dfb2f1bf9a53',
      type: 'default',
      rangeBottom: 102.78260869565217,
      rangeTop: 112.2463768115942,
      value: 155,
    },
    {
      id: '426f7eac-7edb-4fe3-b5d2-71f58cd73279',
      type: 'default',
      rangeBottom: 112.2463768115942,
      rangeTop: 121.71014492753623,
      value: 10,
    },
    {
      id: 'c0e09e97-d059-40e4-bd32-9bb1cf265e41',
      type: 'default',
      rangeBottom: 121.71014492753623,
      rangeTop: 131.17391304347825,
      value: 54,
    },
    {
      id: '339d316e-b67d-4260-aec3-5f286d0b7456',
      type: 'default',
      rangeBottom: 131.17391304347825,
      rangeTop: 140.6376811594203,
      value: 47,
    },
    {
      id: 'a539d179-9274-4aba-87fe-f0c0c8e71e6e',
      type: 'default',
      rangeBottom: 140.6376811594203,
      rangeTop: 150.1014492753623,
      value: 7,
    },
    {
      id: '0547ab64-cf49-44db-9443-9ce4312ed00f',
      type: 'default',
      rangeBottom: 150.1014492753623,
      rangeTop: 159.56521739130434,
      value: 22,
    },
    {
      id: '1780a1e0-09e8-46fe-b10f-472882237787',
      type: 'default',
      rangeBottom: 159.56521739130434,
      rangeTop: 169.02898550724638,
      value: 2,
    },
    {
      id: 'bdd1f3ed-601d-4e43-b72e-36ef842668d1',
      type: 'default',
      rangeBottom: 169.02898550724638,
      rangeTop: 178.4927536231884,
      value: 3,
    },
    {
      id: 'a66db01c-6a29-4b90-a3a1-e6b07c851b6e',
      type: 'default',
      rangeBottom: 178.4927536231884,
      rangeTop: 187.95652173913044,
      value: 7,
    },
    {
      id: 'b2577ce5-17d1-4c06-8405-452ce63bf856',
      type: 'default',
      rangeBottom: 187.95652173913044,
      rangeTop: 197.42028985507247,
      value: 7,
    },
    {
      id: '8b56dda0-2f53-4bfb-ac50-882cc2677fa2',
      type: 'default',
      rangeBottom: 197.42028985507247,
      rangeTop: 206.8840579710145,
      value: 0,
    },
    {
      id: '2c12cf3f-2062-4fe5-b839-b6001ffbdf5a',
      type: 'default',
      rangeBottom: 206.8840579710145,
      rangeTop: 216.34782608695653,
      value: 5,
    },
    {
      id: 'c5dc245d-e166-481b-b9f5-0ff1c20e2a5b',
      type: 'default',
      rangeBottom: 216.34782608695653,
      rangeTop: 225.81159420289856,
      value: 0,
    },
    {
      id: '61587268-04f5-422a-93d0-b204a6d155cd',
      type: 'default',
      rangeBottom: 225.81159420289856,
      rangeTop: 235.2753623188406,
      value: 548,
    },
    {
      id: '1b0b49de-1935-4d2d-9939-a3d6d3579d69',
      type: 'default',
      rangeBottom: 235.2753623188406,
      rangeTop: 244.73913043478262,
      value: 23,
    },
    {
      id: '36b0aefa-0f16-4a6e-9569-1988e1a9a338',
      type: 'default',
      rangeBottom: 244.73913043478262,
      rangeTop: 254.20289855072465,
      value: 0,
    },
    {
      id: 'dc0c4b40-4aef-4975-b514-e0cae4334084',
      type: 'default',
      rangeBottom: 254.20289855072465,
      rangeTop: 263.6666666666667,
      value: 0,
    },
    {
      id: 'ff6bafe1-fa1a-4f01-a842-1fe13e8bacf4',
      type: 'default',
      rangeBottom: 263.6666666666667,
      rangeTop: 273.1304347826087,
      value: 0,
    },
    {
      id: 'bcec0db7-2bbd-4cc5-a8cc-5e2413f2f052',
      type: 'default',
      rangeBottom: 273.1304347826087,
      rangeTop: 282.59420289855075,
      value: 15,
    },
    {
      id: '89769aea-e6f5-4e49-baac-0537eda62ba0',
      type: 'default',
      rangeBottom: 282.59420289855075,
      rangeTop: 292.05797101449275,
      value: 86,
    },
    {
      id: '8a5216ba-67ff-4a0f-a98a-16b04bb93b5b',
      type: 'default',
      rangeBottom: 292.05797101449275,
      rangeTop: 301.52173913043475,
      value: 4,
    },
    {
      id: '0a219015-e5ee-48fa-8a9b-1e578e7bf194',
      type: 'default',
      rangeBottom: 301.52173913043475,
      rangeTop: 310.9855072463768,
      value: 7,
    },
    {
      id: 'dfa8bc3b-183f-4eda-9030-ee65712e8d2e',
      type: 'default',
      rangeBottom: 310.9855072463768,
      rangeTop: 320.4492753623189,
      value: 14,
    },
    {
      id: 'e32951e2-b574-4357-aa96-90b759363e85',
      type: 'default',
      rangeBottom: 320.4492753623189,
      rangeTop: 329.9130434782609,
      value: 0,
    },
    {
      id: '0a0dcb52-7d9d-4052-814f-7576e60de2ff',
      type: 'default',
      rangeBottom: 329.9130434782609,
      rangeTop: 339.37681159420293,
      value: 9,
    },
    {
      id: '7481eaec-4779-48b0-af0d-e69a05201aa1',
      type: 'default',
      rangeBottom: 339.37681159420293,
      rangeTop: 348.84057971014494,
      value: 47,
    },
    {
      id: 'dc46e211-2fab-4b77-918e-932a48082de9',
      type: 'default',
      rangeBottom: 348.84057971014494,
      rangeTop: 358.30434782608694,
      value: 109,
    },
    {
      id: '2ee96007-ee63-475c-a9cc-2a45ab587b72',
      type: 'default',
      rangeBottom: 358.30434782608694,
      rangeTop: 367.768115942029,
      value: 8,
    },
    {
      id: '7c959d04-ea46-4444-af00-e60e9280503c',
      type: 'default',
      rangeBottom: 367.768115942029,
      rangeTop: 377.231884057971,
      value: 2,
    },
    {
      id: '6a8bfc08-26e1-4b37-b662-3335b842afef',
      type: 'default',
      rangeBottom: 377.231884057971,
      rangeTop: 386.69565217391306,
      value: 0,
    },
    {
      id: '5450ac8b-b5ff-4ca1-bcee-489ca11ef26d',
      type: 'default',
      rangeBottom: 386.69565217391306,
      rangeTop: 396.15942028985506,
      value: 0,
    },
    {
      id: '0f62a2ae-ce49-48b9-b359-ab1df8cd50eb',
      type: 'default',
      rangeBottom: 396.15942028985506,
      rangeTop: 405.6231884057971,
      value: 12,
    },
    {
      id: '77865890-85f0-4aec-80bf-765d8c6901b3',
      type: 'default',
      rangeBottom: 405.6231884057971,
      rangeTop: 415.0869565217391,
      value: 6,
    },
    {
      id: '47b89809-946f-40ef-aa2c-a1205a4ad4d8',
      type: 'default',
      rangeBottom: 415.0869565217391,
      rangeTop: 424.5507246376812,
      value: 4,
    },
    {
      id: 'ba9cb2ee-8a1f-4c82-b28d-e1925cffbd1d',
      type: 'default',
      rangeBottom: 424.5507246376812,
      rangeTop: 434.0144927536232,
      value: 5,
    },
    {
      id: 'ff711e7d-b317-43fd-b484-96bc053c2737',
      type: 'default',
      rangeBottom: 434.0144927536232,
      rangeTop: 443.47826086956525,
      value: 0,
    },
    {
      id: 'cc21738e-6f70-4f09-ad3c-29c5469ba9a1',
      type: 'default',
      rangeBottom: 443.47826086956525,
      rangeTop: 452.94202898550725,
      value: 0,
    },
    {
      id: 'a193a727-9dda-400e-a361-3bbc0980179d',
      type: 'default',
      rangeBottom: 452.94202898550725,
      rangeTop: 462.4057971014493,
      value: 0,
    },
    {
      id: '7d452efa-8766-4dd6-801a-4ae696ad0070',
      type: 'default',
      rangeBottom: 462.4057971014493,
      rangeTop: 471.8695652173913,
      value: 13,
    },
    {
      id: 'fd8fb10b-f79d-478e-8144-5c949bdc5ce1',
      type: 'default',
      rangeBottom: 471.8695652173913,
      rangeTop: 481.33333333333337,
      value: 1,
    },
    {
      id: 'cb3b838a-c9fd-41c9-9999-4e6981383c0e',
      type: 'default',
      rangeBottom: 481.33333333333337,
      rangeTop: 490.7971014492754,
      value: 1,
    },
    {
      id: '58efbf6b-1c2a-468f-9266-1bed28495a8b',
      type: 'default',
      rangeBottom: 490.7971014492754,
      rangeTop: 500.2608695652174,
      value: 0,
    },
    {
      id: '26442d06-abbf-4fe8-b222-b575df31cd08',
      type: 'default',
      rangeBottom: 500.2608695652174,
      rangeTop: 509.72463768115944,
      value: 2,
    },
    {
      id: '784ed51e-a0e4-44d1-8ce1-c06d5ea6d396',
      type: 'default',
      rangeBottom: 509.72463768115944,
      rangeTop: 519.1884057971015,
      value: 3,
    },
    {
      id: 'fc4be3c0-c982-4a4b-92bc-78b3534cdbb0',
      type: 'default',
      rangeBottom: 519.1884057971015,
      rangeTop: 528.6521739130435,
      value: 2,
    },
    {
      id: 'a2625204-92fd-457b-81fe-d7cbdbae8651',
      type: 'default',
      rangeBottom: 528.6521739130435,
      rangeTop: 538.1159420289855,
      value: 0,
    },
    {
      id: '02b2621f-e0d0-45e1-8a37-01ca26a5fe17',
      type: 'default',
      rangeBottom: 538.1159420289855,
      rangeTop: 547.5797101449275,
      value: 0,
    },
    {
      id: '9de1f20f-c227-4949-a07c-d104442f060b',
      type: 'default',
      rangeBottom: 547.5797101449275,
      rangeTop: 557.0434782608695,
      value: 0,
    },
    {
      id: '7e083e4d-d4d4-4a46-9792-c20d6d3cdcba',
      type: 'default',
      rangeBottom: 557.0434782608695,
      rangeTop: 566.5072463768116,
      value: 0,
    },
    {
      id: 'bd34126f-110f-4ccd-b8ad-56b2ad4a8ade',
      type: 'default',
      rangeBottom: 566.5072463768116,
      rangeTop: 575.9710144927536,
      value: 1,
    },
    {
      id: '522c3b7a-23a9-4876-8aea-2466f3130cf0',
      type: 'default',
      rangeBottom: 575.9710144927536,
      rangeTop: 585.4347826086956,
      value: 11,
    },
    {
      id: '8faa287c-43f1-4fbb-b8fb-722f6266c42f',
      type: 'default',
      rangeBottom: 585.4347826086956,
      rangeTop: 594.8985507246377,
      value: 0,
    },
    {
      id: 'd048d458-9cce-4a0b-9578-522f656ac344',
      type: 'default',
      rangeBottom: 594.8985507246377,
      rangeTop: 604.3623188405797,
      value: 1,
    },
    {
      id: '8506c8a8-e5df-46f1-af01-a52c243a9dab',
      type: 'default',
      rangeBottom: 604.3623188405797,
      rangeTop: 613.8260869565217,
      value: 1,
    },
    {
      id: 'e537215c-9bfa-4ac8-b7a6-4d2620c5b73f',
      type: 'default',
      rangeBottom: 613.8260869565217,
      rangeTop: 623.2898550724638,
      value: 0,
    },
    {
      id: 'fc9f040d-41fd-4cfa-8525-a55048204bd7',
      type: 'default',
      rangeBottom: 623.2898550724638,
      rangeTop: 632.7536231884059,
      value: 0,
    },
    {
      id: 'ca75d327-cbe0-4071-bbca-56df079aa306',
      type: 'default',
      rangeBottom: 632.7536231884059,
      rangeTop: 642.2173913043479,
      value: 2,
    },
    {
      id: 'b2db11c2-71ea-42bb-aaae-906bb526d573',
      type: 'default',
      rangeBottom: 642.2173913043479,
      rangeTop: 651.6811594202899,
      value: 0,
    },
    {
      id: 'ca54df11-fa00-4e67-9a6b-397b9f7ccf10',
      type: 'default',
      rangeBottom: 651.6811594202899,
      rangeTop: 661.1449275362319,
      value: 0,
    },
    {
      id: '8c4effc7-2f75-4102-a887-767c9e0d38b8',
      type: 'default',
      rangeBottom: 661.1449275362319,
      rangeTop: 670.6086956521739,
      value: 0,
    },
    {
      id: '3cc18d2c-ca00-47e4-8d59-aaf6d4e12bed',
      type: 'default',
      rangeBottom: 670.6086956521739,
      rangeTop: 680.072463768116,
      value: 0,
    },
    {
      id: 'fc464e75-dba1-4ab8-8d10-7c1f6344a376',
      type: 'default',
      rangeBottom: 680.072463768116,
      rangeTop: 689.536231884058,
      value: 0,
    },
    {
      id: 'bb7c9851-85ee-4585-90a0-e950841fb33b',
      type: 'default',
      rangeBottom: 689.536231884058,
      rangeTop: 699,
      value: 2,
    },
  ];

  const { label: xAxisLabel, format: xAxisFormat, columnIndex: xAxisKey } = xAxis;
  const { label: yAxisLabel, format: yAxisFormat, columnIndex: yAxisKey } = yAxis;

  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaValueLeft, setRefAreaValueLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [refAreaValueRight, setRefAreaValueRight] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [isClickTooltipVisible, setIsClickTooltipVisible] = useState(false);
  const [clickTooltipCoords, setClickTooltipCoords] = useState();

  const closeClickTooltip = () => {
    setRefAreaLeft('');
    setRefAreaRight('');
    setRefAreaValueLeft('');
    setRefAreaValueRight('');
    setIsClickTooltipVisible(false);
    setClickTooltipCoords(null);
  };

  const onBrushEnd = () => {
    setIsDragging(false);

    if (
      isClickTooltipVisible ||
      !refAreaLeft ||
      !refAreaValueLeft ||
      !refAreaRight ||
      !refAreaValueRight
    ) {
      return;
    }

    setIsClickTooltipVisible(true);
    if (refAreaLeft === refAreaRight || refAreaRight === '' || refAreaValueRight === '') {
      closeClickTooltip();
      return;
    }
    if (refAreaValueLeft > refAreaValueRight) {
      setRefAreaLeft(refAreaRight);
      setRefAreaValueLeft(refAreaValueRight);
      setRefAreaRight(refAreaLeft);
      setRefAreaValueRight(refAreaValueLeft);
      onUpdateBrush({ start: refAreaValueRight, end: refAreaValueLeft });
    } else {
      onUpdateBrush({ start: refAreaValueLeft, end: refAreaValueRight });
    }
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <BarChart
        height={height}
        width={width}
        data={data}
        margin={margin}
        barCategoryGap={10}
        onMouseDown={(e) => {
          if (isClickTooltipVisible) return;
          if (!e?.activeLabel) return;
          if (!e?.activePayload) return;

          if (isDragging) return;
          setIsDragging(true);
          setRefAreaLeft(e.activeLabel);
          setRefAreaValueLeft(e.activePayload[0].payload?.rangeBottom);
        }}
        onMouseMove={(e) => {
          if (refAreaLeft && isDragging && e.activeLabel && e.activeCoordinate) {
            setRefAreaRight(e.activeLabel);
            setRefAreaValueRight(e.activePayload[0].payload?.rangeTop);
            setClickTooltipCoords(e.activeCoordinate);
          }
        }}
        onMouseLeave={(e) => {
          setIsDragging(false);
          if (
            refAreaLeft &&
            refAreaValueLeft &&
            refAreaRight &&
            refAreaValueRight &&
            !isClickTooltipVisible
          ) {
            onBrushEnd();
          }
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onMouseUp={onBrushEnd}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          padding={{ left: 20, right: 20 }}
          interval="preserveStartEnd"
          dataKey={(ev) =>
            `${formatValue(
              getD3DataFormatter(xAxisFormat, ev.rangeBottom),
              ev.rangeBottom
            )} to ${formatValue(getD3DataFormatter(xAxisFormat, ev.rangeTop), ev.rangeTop)}`
          }
          type="category"
          // tickFormatter={(timeStr) =>
          //   formatValue(getD3DataFormatter(xAxisFormat, timeStr), timeStr)
          // }
        />
        <YAxis
          dataKey="value"
          tickFormatter={(timeStr) =>
            formatValue(getD3DataFormatter(yAxisFormat, timeStr), timeStr)
          }
        />
        <Tooltip
          cursor={!isClickTooltipVisible}
          wrapperStyle={{ visibility: 'visible' }}
          position={isClickTooltipVisible ? clickTooltipCoords : undefined}
          content={
            <TooltipHandler
              CustomHoverTooltip={CustomHoverTooltip}
              CustomClickTooltip={CustomClickTooltip}
              isClickTooltipVisible={isClickTooltipVisible}
              closeClickTooltip={closeClickTooltip}
            />
          }
          formatter={(value) => formatValue(getD3DataFormatter(yAxisFormat, value), value)}
          // labelFormatter={(value) => formatValue(getD3DataFormatter(xAxisFormat, value), value)}
        />
        {/* <Legend /> */}
        <Bar dataKey="value" fill="#82ca9d" />
        <ReferenceArea
          x1={refAreaRight}
          x2={refAreaLeft}
          strokeOpacity={0.3}
          isFront
          stroke="gray"
          alwaysShow
        />
      </BarChart>
    </div>
  );
}

HistogramPlot.propTypes = {};

export default HistogramPlot;
