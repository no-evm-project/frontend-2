import React, { PureComponent, useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import {useContext} from 'react';
import { DataContext } from '@/contexts/DataProvider';
import { Image } from '@chakra-ui/react';

const TOKEN_COLORS: any = {
  'WBTC': '#F5B300',
  'USDC': '#005DB2',
  'ETH': '#FFF',
  'SWEAT': '#D40CA8',
  'REF': '#292929',
  'WOO': '#606060',
  'AURORA': '#00953C',
  'NEAR': '#08E086'
}

export default function PortfolioPie ({tokenBalances}: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const {tokenList} = useContext(DataContext);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };



    return (
      <ResponsiveContainer width="60%" height="100%" maxHeight={300}>
        <PieChart width={300} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={tokenBalances.map((bal: number, index: number) => ({
              name: tokenList[index],
              value: bal,
            }))}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={60}
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    );
}


const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    const fill = TOKEN_COLORS[payload.name] ?? '#000';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}
        style={{fontWeight: 'bold'}}
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill}>{`$ ${Number(value).toFixed(2)}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };