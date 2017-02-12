/*
* @Author: Hamid Raza
* @Date:   2017-02-12 20:56:29
* @Last Modified by:   HamidR
* @Last Modified time: 2017-02-13 00:00:19
*/

'use strict';
const _APP = new Vue({
  el: '#app',
  data: {
    colorLimit    : 8,
    matchLimit    : 2,
    colors        : [],
    selectedIndex : [],
    activeColors  : [],
    loading       : false,
    timeSpent     : 0,
    scores        : [],
    timerId       : null,
    hueColor      : null,
    showSettings  : false
  },
  watch: {
    colorLimit() {
      if(typeof this.matchLimit != 'number') {
        this.matchLimit = parseInt(this.matchLimit);
      }
      this.reset();
      localStorage.setItem('colorLimit', this.colorLimit);
    },
    matchLimit() {
      if(typeof this.matchLimit != 'number') {
        this.matchLimit = parseInt(this.matchLimit);
      }
      this.reset();
      localStorage.setItem('matchLimit', this.matchLimit);
    }
  },
  computed: {
    yourBest() {
      return this.scores.length ? Math.min(...this.scores) : false
    }
  },
  methods: {
    handleClick(idx) {
      const color = this.colors[idx];
      const firstSelectedColor = this.colors[this.selectedIndex[0]];
      if(!this.selectedIndex.length) {
        this.selectedIndex.push(idx);
        return;
      }
      if(this.selectedIndex.length < this.matchLimit) {
        if(firstSelectedColor == color) {
          this.selectedIndex.push(idx);
          if(this.selectedIndex.length == this.matchLimit) {
            this.activeColors.push(color);
            this.selectedIndex = [];
          }
        } else {
          this.selectedIndex.push(idx);
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.selectedIndex = [];
          }, 500);
        }
      }
      if(this.activeColors.length * this.matchLimit == this.colors.length) {
        this.scores.push(this.timeSpent);
        if(this.timerId) clearInterval(this.timerId);

        const key = `color-box-${this.colorLimit}-${this.matchLimit}`;
        localStorage.setItem(key, JSON.stringify(this.scores));
      }
    },
    reset() {
      const colors = randomColor({count: this.colorLimit, luminosity: 'light'});
      this.colors = [...Array(this.matchLimit)].map(v => colors)
        .reduce((r, v) => [...r, ...v], [])
        .sort(e => .5-Math.random());

      this.selectedIndex = [];
      this.activeColors = [];
      this.timeSpent = 0;

      const scores = localStorage.getItem(`color-box-${this.colorLimit}-${this.matchLimit}`) || '[]';
      try {
        this.scores = JSON.parse(scores);
      } catch(e) {
        this.scores = [];
      }

      if(this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => ++this.timeSpent, 1000);
    }
  },
  mounted() {
    const colorLimit = localStorage.getItem('colorLimit');
    const matchLimit = localStorage.getItem('matchLimit');

    if(colorLimit) this.colorLimit = parseInt(colorLimit);
    if(matchLimit) this.matchLimit = parseInt(matchLimit);

    this.reset();
  }
});
