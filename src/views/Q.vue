<template>
  <div class="blakboad" @mousedown='mousedown' @mouseup='mouseup' @mouseout="mouseout"  @mousemove="mousemove" >
    <div style="user-select:none;">{{SP}}</div>
    <div class="blakboad2">
      <el-form ref="form" :model="config" label-width="80px" style="width:150px;backgroundColor:#ccc">
        <el-row :gutter="1">
          <el-col :span="8">
            点转
            <el-input-number size="mini" :controls="false" v-model="config.clickR" :min="0" :max="10" label="点转"></el-input-number>
          </el-col>  
          <el-col :span="8">
            滑转
            <el-input-number size="mini" :controls="false" v-model="config.moveR" :min="0" :max="10" label="滑转"></el-input-number>
          </el-col>
          <el-col :span="8">
            速度
            <el-input-number size="mini" :controls="false" v-model="config.moveR" :min="0" :max="10" label="滑转"></el-input-number>
          </el-col>
        </el-row>
        
      </el-form>
    </div>
    <img class="nonDraggableImage" v-for="(sword,index) in 无名" :key="sword" :src="require('@/assets/img/sword.png')" alt="" :style="SP[index]">

  </div>
</template>

<script>
export default {
  data(){
    return{
      clickP:{
        x:0,
        y:0,
      },
      swordP:{
        x:0,
        y:0,
        r:0,
        tx:0,
      },
      swordPList:[],
      SCS:{
        x:0,
        y:0,
        tx:0,
      },
      config:{
        clickR:5,
        moveR:0,
      },
      down:false,
      t:null,
      rolSpeed:0,
      stop:false,
      overzhen:8,
      overzhenStart:0,
      startToRound:100,
      powerover:100,
      roundlength:150,
      inpower:0,
      无名:[1,2,3,4,5,6,7,8,9],
      moveSecends:0,
    }
  },
  mounted(){
    console.log('尼格',new Date())
    const that = this
    if(window.t){clearInterval(t)}
    this.run()
  },
  methods:{
    mousedown(e){
      this.down = true
      this.moveSecends = 0
      console.log('down')
      if(!t){
        this.run()
      }
      this.clickP.x = e.pageX
      this.clickP.y = e.pageY
      this.SCS.x = this.clickP.x - this.swordP.x
      this.SCS.y = this.clickP.y - this.swordP.y
      
      this.SCS.yx = 0
      this.rolSpeed = this.config.clickR
    },
    mouseup(){
      this.down = false
      this.moveSecends = 0
      this.SCS.tx = -1
    },
    mouseout(){

      this.down = false
    },
    mousemove(e){
      if(!this.down){return}
      this.clickP.x = e.pageX
      this.clickP.y = e.pageY
      this.SCS.x = this.clickP.x - this.swordP.x
      this.SCS.y = this.clickP.y - this.swordP.y
      this.SCS.yx = 0
      if(this.moveSecends == 5){this.rolSpeed = this.config.moveR}
    },
    run(){
      window.t = setInterval(() => {
        let swordP = JSON.parse(JSON.stringify(this.swordP))
        swordP.x = swordP.x + parseInt((this.SCS.x/60).toFixed(1))
        swordP.y = swordP.y + parseInt((this.SCS.y/60).toFixed(1))
        
        if(swordP.tx == 0 && this.SCS.tx == -1){
          this.SCS.tx = 0
        }else if(swordP.tx == this.roundlength && this.down == true){
          this.SCS.tx = 0
        }else{
          swordP.tx = swordP.tx + this.SCS.tx
        }

        swordP.r += this.rolSpeed
        this.swordP = swordP
        if( this.swordPList.length != this.无名.length*this.overzhen){
          this.swordPList.unshift(swordP)
        }else{
         
          this.swordPList.pop()
          this.swordPList.unshift(swordP)
        }
      
      }, 17);
    },
    doNothing(){}
    
  },
  computed:{
    SP(){
      let p = this.无名.map((s,index)=>{
        if(this.swordPList[index*this.overzhen]){
          // let transltate = ''
          // if(this.swordPList[index*this.overzhen].tx){
          //   transltate = 'translate('+this.swordPList[index*this.overzhen].tx+'px)'
          // }
          let transformOrigin = ''
          let translate = ''
          let rx = this.swordPList[index*this.overzhen].tx*Math.round(Math.cos((this.swordPList[index*this.overzhen].r*1.1 * Math.PI/180)) * 1000000) / 1000000;
          let ry = this.swordPList[index*this.overzhen].tx*Math.round(Math.sin((this.swordPList[index*this.overzhen].r*1.1* Math.PI/180)) * 1000000) / 1000000;
          if(this.swordPList[index*this.overzhen].tx){
            //transformOrigin = this.swordPList[index*this.overzhen].tx+'px'+' 30%'
            translate = 'translate(-'+this.swordPList[index*this.overzhen].tx+'px) '
          }
          return {'position':'absolute',
          'left':this.swordPList[index*this.overzhen].x+rx+'px',
          'top':this.swordPList[index*this.overzhen].y+ry+'px',
          'transform':'rotate('+this.swordPList[index*this.overzhen].r+'deg)',
          }
        }else{
          return {}
        }
        
        
        //return {'position':'absolute','left':(this.swordP.x -s)+'px','top':this.swordP.y+'px','transform':'rotate('+this.swordP.r+'deg)'}
      })
      return p
    },
    
  },
  watch:{
    'swordP':{
      handler(val,oval){
        if(val.x == this.clickP.x || (this.clickP.x-val.x)*(this.clickP.x-oval.x) <0){this.SCS.x = 0;this.stop = true}
        if(val.y == this.clickP.y || (this.clickP.y-val.y)*(this.clickP.y-oval.y) <0){this.SCS.y = 0;this.stop = true}
        if(!this.down  && val.r%360 > 132 && val.r%360 < 138){this.rolSpeed =0}
        if(val.y-oval.y==0 &&  val.x-oval.x==0 && this.down ==true){
          console.log(this.SCS.tx)
          if(this.inpower == this.powerover){
            this.SCS.tx = 1
            this.inpower = 0
          }else{
            this.inpower++
          }
        }else if(this.down == false){
          this.inpower=0
        }
        // if((this.clickP.x-val.x)*(this.clickP.x-oval.x) <0 && (this.clickP.y-val.y)*(this.clickP.y-oval.y)){
        //   clearInterval(t);t=null
        // }
        //  if( this.SP[this.SP.length-1] == this.SP[0]){
        //    clearInterval(t);t=null
        //  }
      },
      deep:true
    },
  }
}
</script>

<style>
.blakboad{
  background: #2b2a2d;
  width: 100%;
  height: 100%;
}
.nonDraggableImage{
  -webkit-user-drag: none;
  /* transform-origin: 70% 30%;  */
}
.blakboad2{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
}
.inputnumber{
  width: 35px;
}
.el-input-number--mini{
  width: 100%;
}
</style>