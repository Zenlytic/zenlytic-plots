import colors from './colors';

export const SCALE_TYPES = {
  UTC: 'UTC',
};

export const PLOT_MARGIN = {
  top: 10,
  left: 65,
  bottom: 40,
  right: 30,
};

export const DEFAULT_PLOT_MARGIN = {
  top: 40,
  left: 32,
  bottom: 40,
  right: 48,
};

export const DEFAULT_NO_X_AXIS_PLOT_MARGIN = {
  top: 40,
  left: 32,
  bottom: 0,
  right: 48,
};

export const DEFAULT_Y_AXIS_WIDTH = 80;
export const DEFAULT_RIGHT_Y_AXIS_WIDTH = 40;

export const DEFAULT_X_AXIS_HEIGHT = 40;

export const DEFAULT_BAR_Y_AXIS_WIDTH = 120;
export const DEFAULT_FUNNEL_X_AXIS_HEIGHT = 10;
export const DEFAULT_WATERFALL_X_AXIS_HEIGHT = 10;

export const DEFAULT_LABEL_PROPS = {
  style: { textAnchor: 'middle' },
  fill: '#595959',
  fontWeight: 500,
  fontSize: '0.75rem',
};

export const DEFAULT_TICK_PROPS = {
  fill: '#8C8C8C',
  fontWeight: 300,
  fontSize: '0.75rem',
};

export const DEFAULT_CARTESIAN_GRID_COLOR = '#F0F0F0';

export const DEFAULT_AXIS_PROPS = {
  stroke: colors.gray[50],
  tickSize: 5,
  tickMargin: 4,
};

export const DEFAULT_TICK_LINE = {
  stroke: colors.gray[300],
};

export const PLOT_TYPES = {
  AREA: 'area',
  BAR: 'bar',
  FUNNEL_BAR: 'funnel_bar',
  FUNNEL: 'funnel',
  GROUPED_BAR: 'grouped_bar',
  HORIZONTAL_BAR: 'horizontal_bar',
  LINE_COHORT: 'line_cohort',
  LINE: 'line',
  MULTI_LINE: 'multi_line',
  SCATTER: 'scatter',
  STAT: 'stat_plot',
  TABLE_ONLY: 'table_only',
  WATERFALL: 'waterfall',
  DONUT: 'donut',
  PIE: 'pie',
};

export const COLOR_SUCCESS = colors.green[600];
export const COLOR_FAIL = colors.red[600];

export const PLOT_COLOR_PALETTE = {
  RED_MARK: 'red',
  GREEN_MARK: 'green',
  YELLOW_MARK: 'yellow',
  DARK_BLUE_MARK: 'blue',
  ORANGE_MARK: 'orange',
  PINK_MARK: 'pink',
  LIGHT_BLUE_MARK: 'lightblue',
};

export const PLOT_COLORS = [
  colors.dark_blue[300],
  colors.mint[300],
  colors.red[300],
  colors.green[300],
  colors.orange[300],
  colors.pink[300],
  colors.light_blue[300],
  colors.yellow[300],
];

export const PLOT_SECONDARY_COLORS = [
  colors.dark_blue[50],
  colors.mint[50],
  colors.red[50],
  colors.green[50],
  colors.orange[50],
  colors.pink[50],
  colors.light_blue[50],
  colors.yellow[50],
];

export const AXIS_COLOR = '#A6A6A6';
export const GRID_COLOR = '#F0F0F0';
export const LABEL_COLOR = '#737373';

export const HIGHLIGHT_BAR_COLOR = colors.gray[30];

export const BRUSH_COLOR = colors.gray[50];
export const BRUSH_BORDER_COLOR = colors.gray[100];

export const AXIS_TYPES = {
  TIME: 'time',
  NUMBER: 'number',
  CATEGORY: 'category',
};

export const DATA_TYPES = {
  TIME: 'time',
  NUMBER: 'number',
  CATEGORY: 'category',
};

// This is what is inside the series object that signifies which dataKey goes in which axis.
// Example: xDataKey: 'ORDERS_ORDER_CREATED_AT_DATE'
export const AXIS_DATA_KEY_KEYS = {
  X_AXIS_DATA_KEY_KEY: 'xDataKey',
  Y_AXIS_DATA_KEY_KEY: 'yDataKey',
  SECOND_Y_AXIS_DATA_KEY_KEY: 'secondYDataKey',
  Z_AXIS_DATA_KEY_KEY: 'zDataKey',
  CATEGORY_AXIS_DATA_KEY_KEY: 'categoryDataKey',
  CATEGORY_VALUE_DATA_KEYS_KEY: 'categoryValueDataKeys',
};

export const DEFAULT_STROKE_WIDTH = 1;

export const DATA_CHANGE_TYPES = {
  ABSOLUTE: 'ABSOLUTE',
  PERCENT: 'PERCENT',
};

export const DATA_CHANGE_TYPE_TO_STACK_OFFSET_MAPPING = {
  [DATA_CHANGE_TYPES.ABSOLUTE]: 'none',
  [DATA_CHANGE_TYPES.PERCENT]: 'expand',
};

export const GROUPED_BAR_DISPLAY_TYPES = {
  GROUPED: 'GROUPED',
  STACKED: 'STACKED',
};

export const TEXT_SIZE_TYPES = {
  DYNAMIC: 'DYNAMIC',
  SMALL: 'SMALL',
  LARGE: 'LARGE',
};

export const DATA_CHANGE_DIRECTION = '__DATA_CHANGE_DIRECTION';

export const DATA_CHANGE_DIRECTIONS = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  NO_CHANGE: 'NO_CHANGE',
};

export const RADIAL_PLOT_DISPLAY_TYPES = {
  CONDENSED: 'CONDENSED',
  EXPANDED: 'EXPANDED',
};
