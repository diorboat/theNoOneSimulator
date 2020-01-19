<template>
  <div >
    <div v-for="(i,index) in lt" :key="index" class="one_line" :num='i' >
      <div class="two_line" :style="[{width:i}]"></div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      all:24*5*60*60*1000,
      k2:0,
      k3:0,
      lt:[],
      style:[],
      style2:[],
      style3:[],
      t:0,
    }
  },
  mounted(){
    var t = setInterval(() => {
      var n = new Date()
      var d = n.getDay() - 1
      var q = n.getTime()
      var qqw = new Date(q - d*24*60*60*1000)
      
      var y = qqw.getFullYear()
      var m = qqw.getMonth()+1
      var dd = qqw.getDate()
      var one = new Date(y+'-'+m+'-'+dd).getTime()
      var k = Math.floor(((q - one)/this.all)*100000)/10
      // var k3 =Math.floor(k/100)
      // var k2 =Math.floor( (k%100)*10)/10
      var lt = []
      
      for(var i = 0;i<100;i++){
        k-=100
        if(k>100){
          lt.push('0%')
        }else if(0<k&& k<100){
          lt.push(k+'%')
        }else{
          lt.push('100%')
        }
      }
      this.lt =lt
    }, 1000);
  },
  methods:{
    // return(val){
    //   if(val<k2){
    //     return [{width:'0'}]
    //   }else if(val ==k2){
    //     return [{width:100-this.k3+'%'}]
    //   }else{
    //     return [{width:'100%'}]
    //   }
      
    // },
  }
}
</script>

<style>
.one_line{
  background-color: #9c7df4;
  height:1vh;
  position: relative;
}
.two_line{
  position: absolute;
  height:1vh;
  right: 0px;
  width: 0%;
  background: #cccccc;
  left: 0px;
}
</style>