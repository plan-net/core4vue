<template>
  <v-layout
    row
    wrap
    class="c4-page pt-7 mx-0"
  >
    <template v-if="headerType">
      <div class="c4-sub-header">
      </div>

      <v-flex
        xs12
        class="c4-page-header"
      >
        <div class="page-header-content">
          <slot
            v-if="!!$slots['page-header-content']"
            name="page-header-content"
          ></slot>
        </div>
      </v-flex>
    </template>
    <v-flex
      xs12
      class="c4-content-container"
    >
      <slot></slot>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'c4-page',
  props: {
    /**
     * Sets small header image. Usually no content in the header
     */
    small: {
      type: [Boolean, null],
      default: false
    },
    /**
     * Sets medium header image. Used when there is a bit of content in the header. (height 90px)
     */
    medium: {
      type: [Boolean, null],
      default: false
    },
    /**
     * Sets large header image. Used when there is a lot of content in the header. (height 135px)
     */
    large: {
      type: [Boolean],
      default: false
    },
    /**
     * Currently three different background images are available with number 1,2,3
     */
    headerType: {
      type: [String],
      default: null
    }
  },
  mounted () {
    if (this.headerType != null) { // TODO render?
      const pageHC = this.$el.querySelector('.page-header-content')
      const header = this.$el.querySelector('.c4-sub-header')

      if (this.small === true || this.small === '') {
        pageHC.style.height = '36px'
        header.style.height = '106px'
      } else if (this.medium === true || this.medium === '') {
        pageHC.style.height = '100px'
        header.style.height = '170px'
      } else {
        pageHC.style.height = '170px'
        header.style.height = '240px'
      }

      if (this.headerType === '1') {
        header.style.backgroundImage = "url('//bi.plan-net.com/cdn/assets/images/serviceplan-muenchen.jpg')"
      } else if (this.headerType === '2') {
        header.style.backgroundImage = "url('//bi.plan-net.com/cdn/assets/images/serviceplan-muenchen-blau.jpg')"
      } else if (this.headerType === '3') {
        header.classList.add('gradient-1')
      } else if (this.headerType === '4') {
        header.classList.add('gradient-2')
        // header.classList.add('')
      } else {

      }
    }
  }
}
</script>

<style scoped lang="css">
.c4-content-container,
.c4-page-header {
  z-index: 1;
}

.c4-sub-header {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  /* top: 0; */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  /* z-index: 0; */
}
</style>
<style scoped lang="scss">
$perc: random(20) + 60%;

.gradient-1 {
  background: linear-gradient(
    120deg,
    darken(#3f515d, 10) 70%,
    lighten(#3f515d, 5) 70%
  );
}
.gradient-3 {
  /*   background: linear-gradient(
    130deg,
    darken(#333, 5) 60%,
    darken(#333, 2) 60%
  ); */
}
.gradient-2 {
  background: linear-gradient(110deg, #3f515d 40%, rgba(0, 0, 0, 0) 30%),
    radial-gradient(
      farthest-corner at 0% 0%,
      darken(#3f515d, 10) 70%,
      lighten(#3f515d, 10) 70%
    );
}
/* .gradient-2 {
  background: linear-gradient(
    #{random(50) + 100}deg,
    darken(#d70f14, 10) 70%,
    26 #d70f14 70%
  );
} */
</style>
