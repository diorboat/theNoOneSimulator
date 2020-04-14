<template>
  <div id="app">
    <div class="rview">
      <router-view></router-view>
    </div>
    
    <div id="nav">
      <el-menu  mode="horizontal" >
        <el-menu-item index="1">
          <template slot="title"><router-link to="/">Home</router-link> |</template>
          
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/about">About</router-link>|
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/j">jjjjjj</router-link>|
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/FFFF">FFFF</router-link>
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/test">test</router-link>
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/A">AAAA</router-link>
        </el-menu-item>
        <el-menu-item index="1">
          <router-link to="/Q">QQQQ</router-link>
        </el-menu-item>
        
      </el-menu>
    </div>
    
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,body{
  padding: 0px;
  margin: 0px;
  height: 100%;
}
#nav {
  padding:0px;
  position: fixed;
  bottom: 0px;
  z-index: 999;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.rview{
  height: calc(100vh)
}
.el-menu{
  background-color: rgba(255, 255, 255, 0.1)
}
</style>
