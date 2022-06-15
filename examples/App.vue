<template>
  <div>
    <a-card
      title="测试"
      :tab-props="{ size: 'small' }"
      :tab-list="[
        { key: 'tab1', tab: 'tab1' },
        { key: 'tab2', tab: 'tab2' },
      ]"
    />
    <a-range-picker format="YYYY-MM" :mode="['month', 'month']"> </a-range-picker>
    <a-range-picker> </a-range-picker>
    <a-month-picker> </a-month-picker>
    <a-range-picker :mode="['year', 'year']"> </a-range-picker>
    <a-date-picker mode="year"> </a-date-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
    };
  },
};
</script>
