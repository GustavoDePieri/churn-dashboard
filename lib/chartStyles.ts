// Common chart styling for dark theme
export const darkChartStyles = {
  cartesianGrid: {
    stroke: 'rgba(255, 255, 255, 0.1)',
    strokeDasharray: '3 3',
  },
  axis: {
    stroke: '#ffffff',
    tick: { fill: '#ffffff', fontSize: 12 },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1a0d2e',
      border: '1px solid #8b5cf6',
      borderRadius: '12px',
      padding: '12px',
    },
    labelStyle: { color: '#ffffff' },
    itemStyle: { color: '#ffffff' },
  },
  legend: {
    wrapperStyle: { color: '#ffffff' },
  },
};

// Brand color palette for charts
export const brandColors = [
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#fb7185', // coral-pink
  '#f43f5e', // coral
  '#fbbf24', // yellow
  '#34d399', // green
  '#60a5fa', // blue
  '#c084fc', // light purple
];

