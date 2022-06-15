import PropTypes from '../../../_util/vue-types';
import BaseMixin from '../../../_util/BaseMixin';
import { hasProp, getListeners } from '../../../_util/props-util';
import MonthTable from './MonthTable';

function goYear(direction) {
  this.changeYear(direction);
}

function noop() {}

const MonthPanel = {
  name: 'MonthPanel',
  mixins: [BaseMixin],
  props: {
    value: PropTypes.any,
    startValue: PropTypes.any,
    endValue: PropTypes.any,
    direction: PropTypes.string,
    defaultValue: PropTypes.any,
    cellRender: PropTypes.any,
    contentRender: PropTypes.any,
    locale: PropTypes.any,
    rootPrefixCls: PropTypes.string,
    // onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    // onSelect: PropTypes.func,
    renderFooter: PropTypes.func,
    changeYear: PropTypes.func.def(noop),
    selectedValue: PropTypes.array,
    hoverValue: PropTypes.array,
  },

  data() {
    const { value, defaultValue } = this;
    // bind methods
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {
      sValue: value || defaultValue,
    };
  },
  watch: {
    value(val) {
      this.setState({
        sValue: val,
      });
    },
  },
  computed: {
    isClosedTo() {
      if (this.startValue && this.endValue) {
        return this.startValue.year() + 1 === this.endValue.year();
      } else {
        return false;
      }
    },
  },
  methods: {
    setAndSelectValue(value) {
      this.setValue(value);
      this.__emit('select', value);
    },

    setValue(value) {
      if (hasProp(this, 'value')) {
        this.setState({
          sValue: value,
        });
      }
    },
  },

  render() {
    const {
      sValue,
      cellRender,
      contentRender,
      locale,
      rootPrefixCls,
      disabledDate,
      renderFooter,
      selectedValue,
      hoverValue,
    } = this;
    const year = sValue.year();
    const prefixCls = `${rootPrefixCls}-month-panel`;
    const footer = renderFooter && renderFooter('month');
    return (
      <div class={prefixCls}>
        <div>
          <div class={`${prefixCls}-header`}>
            {this.direction === 'right' && this.isClosedTo ? null : (
              <a
                class={`${prefixCls}-prev-year-btn`}
                role="button"
                onClick={this.previousYear}
                title={locale.previousYear}
              />
            )}

            <a
              class={`${prefixCls}-year-select`}
              role="button"
              onClick={getListeners(this).yearPanelShow || noop}
              title={locale.yearSelect}
            >
              <span class={`${prefixCls}-year-select-content`}>{year}</span>
              <span class={`${prefixCls}-year-select-arrow`}>x</span>
            </a>

            {this.direction === 'left' && this.isClosedTo ? null : (
              <a
                class={`${prefixCls}-next-year-btn`}
                role="button"
                onClick={this.nextYear}
                title={locale.nextYear}
              />
            )}
          </div>
          <div class={`${prefixCls}-body`}>
            <MonthTable
              disabledDate={disabledDate}
              onSelect={this.setAndSelectValue}
              locale={locale}
              value={sValue}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
              selectedValue={selectedValue}
              hoverValue={hoverValue}
              onMonthHover={getListeners(this).monthHover}
            />
          </div>
          {footer && <div class={`${prefixCls}-footer`}>{footer}</div>}
        </div>
      </div>
    );
  },
};

export default MonthPanel;
