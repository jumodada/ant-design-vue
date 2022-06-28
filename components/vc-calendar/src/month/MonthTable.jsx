import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function noop() {}

const MonthTable = {
  name: 'MonthTable',
  mixins: [BaseMixin],
  props: {
    cellRender: PropTypes.func,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    realValue: PropTypes.object,
    locale: PropTypes.any,
    contentRender: PropTypes.any,
    disabledDate: PropTypes.func,
    selectedValue: PropTypes.array,
    hoverValue: PropTypes.array,
  },
  data() {
    return {
      sValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
  },
  methods: {
    setAndSelectValue(value) {
      this.setState({
        sValue: value,
      });
      this.__emit('select', value);
    },
    chooseMonth(month) {
      const next = this.sValue.clone();
      next.month(month);
      this.setAndSelectValue(next);
    },
    months() {
      const value = this.sValue;
      const current = value.clone();
      const months = [];
      let index = 0;
      for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
        months[rowIndex] = [];
        for (let colIndex = 0; colIndex < COL; colIndex++) {
          current.month(index);
          const content = getMonthName(current);
          months[rowIndex][colIndex] = {
            value: index,
            content,
            title: content,
          };
          index++;
        }
      }
      return months;
    },
  },

  render() {
    const props = this.$props;
    const value = this.sValue;
    const today = getTodayTime(value);
    const months = this.months();
    const { prefixCls, locale, contentRender, cellRender, disabledDate } = props;

    const monthsEls = months.map((month, index) => {
      const tds = month.map(monthData => {
        let disabled = false;
        const currentCellDateValue = value.clone();
        currentCellDateValue.month(monthData.value);
        if (disabledDate) {
          disabled = disabledDate(currentCellDateValue);
        }

        const [startHoverValue, endHoverValue] = this.hoverValue || [];
        const [startSelectedValue, endSelectedValue] = this.selectedValue || [];
        const xValue = !this.hoverValue && !this.selectedValue ? this.realValue : null;
        let isHovering = !!(startHoverValue && endHoverValue);
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: isHovering ? false : currentCellDateValue.isSame(xValue),
          [`${prefixCls}-start-selected-cell`]: isHovering
            ? currentCellDateValue.isSame(startHoverValue)
            : currentCellDateValue.isSame(startSelectedValue),
          [`${prefixCls}-end-selected-cell`]: isHovering
            ? currentCellDateValue.isSame(endHoverValue)
            : currentCellDateValue.isSame(endSelectedValue),
          [`${prefixCls}-current-cell`]:
            today.year() === value.year() && monthData.value === today.month(),
          [`${prefixCls}-in-range-cell`]: isHovering
            ? currentCellDateValue.isAfter(startHoverValue) &&
              currentCellDateValue.isBefore(endHoverValue)
            : currentCellDateValue.isAfter(startSelectedValue) &&
              currentCellDateValue.isBefore(endSelectedValue),
        };
        let cellEl;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = <a class={`${prefixCls}-month`}>{content}</a>;
        }
        return (
          <td
            style={{ padding: 0 }}
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? noop : () => this.chooseMonth(monthData.value)}
            title={monthData.title}
            onMouseenter={() => {
              this.$listeners.monthHover && this.$listeners.monthHover(currentCellDateValue);
            }}
          >
            <div class={classNameMap}>{cellEl}</div>
          </td>
        );
      });
      return (
        <tr key={index} role="row">
          {tds}
        </tr>
      );
    });

    return (
      <table class={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody class={`${prefixCls}-tbody`}>{monthsEls}</tbody>
      </table>
    );
  },
};

export default MonthTable;
