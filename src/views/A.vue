<template>
  <div id='projectrisk' style=""> 
    <el-form :inline="true" :model="dataForm" >
      <el-form-item>
        <el-input v-model="dataForm.searchWords" placeholder="项目编号/名称133333" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-row :gutter="10" style="width:100%">
      <el-col :span="18">
        <el-table
          id="printMe"
          :data="data"
          highlight-current-row
          ref="singleTable"
          @selection-change='handleSelectChange'
          @current-change="handleCurrentChange"
         >
        
          <el-table-column
            prop="supplyName"
            label="supplyName"
            min-width="70mm">
          </el-table-column>
          <el-table-column
            prop="WBS"
            label="WBS"
            width="width">
          </el-table-column>
          <el-table-column
            prop="projectLocation"
            label="项目地点"
            width="width">
          </el-table-column>
          <el-table-column
            prop="planStartTime"
            label="计划开工时间"
            width="width">
          </el-table-column>
          <el-table-column
            prop="supplyWarnLevel"
            label="物资供应风险指数"
            width="width">
          </el-table-column>
          <el-table-column
            prop="warnLevel"
            label="预警"
            width="width">
          </el-table-column>
        </el-table>
       
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[100, 200, 500, 1000]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
      <el-col :span="6" style="height:100vh - 200px">
        <el-card :body-style="{padding:'10px',height:'60%'}">
          <!-- <div class="healthy-card">
            <div>物资健康🐴</div>
            <div>物资名称：{{chosen.supplyName}}</div>
            <div>物资编码：{{chosen.supplyCode}}</div>
          </div> -->
          <div style="line-height:30px;font-size:12px;color:#ccc;text-align:left;color:#aaa">21212121221121</div>
          <!-- <div class='imgUpload'>
            <div>
              +
            </div>
            <img v-if="chosen.url" :src="'/proxyApi/image/'+chosen.url" alt="暂无图片" :onerror="errorImg01">
              
            <input type="file" @change="upload" accept="image/*" title="暂无图片,是否要添加">
          </div> -->
          
          <div style="font-size:12px;color:#aaa">物资供应风险指数为53.27,达到黄色预警存在一定风险</div>
        </el-card>
          
        <el-card style='margin-top:10px' :body-style="{padding:'10px',height:'25vh'}">
          <div ref='k' style="width:100%;height:100%" class="chart-box"></div>
        </el-card>
        <el-card>
          <el-button type="primary" style='width:100%' @click="addOrUpdateHandle">所选项目风险测算</el-button>
          <el-button v-print="printMe" type="primary">打 印</el-button>    
        </el-card>
      </el-col>
    </el-row>
    <div v-for="(item,index) in data" :key="index">{{item+index}}</div>
    <!-- <div ref='k2' style="width:100%;float:left;background-color:#ccc;height:500px" class="chart-box"></div> -->
    <add-or-update :tableData='selectList' :levelSumList='levelSumList' ref="addOrUpdate"  :v-if='crsVisible'></add-or-update>
  </div>
    
</template>

<script>
// import 'echarts/lib/chart/bar'
import AddOrUpdate from './catRiskSum'
export default {
  components:{
    AddOrUpdate
  },
  data(){
    return{
      active: false,
      pageIndex: 1,
      pageSize: 200,
      totalPage: 0,
      crsVisible:false,
      markColor:['没有','red','yellow','green'],
      ak: 'jCp9AXG6GceZO2UAiN7zY2TUtVrYZc9f',
      selectList:[],
      levelSumList:[0,0,0],//风险统计，安全，隐患，危险，
      dataForm:{searchWords:''},
      data:[
        {
          riskId:'',// ID
          supplyCode:'',// 物资编码
          supplyName:'',// 物料名称
          supplyNeedCount:'',// 物资需求量
          supplyComeBack:'',// 供应商复产情况
          supplyAdjustability:'',// 物资可调性
          riskIndex:'',// 风险指数
          warnLevel:'',// 预警等级
          warnCount:'',// 物资供应风险统计数量
          url:'',// 图片存放URL
          coo:{lng: 120.45744048529967, lat: 30.49771311230842}
        }
      ],
      center: {lng: 120.19926175379778, lat: 30.18449676862417},
      zoom: 12,
      makerLng:[
        {name:'dddddeade', lng: 120.45744048529967, lat: 30.49771311230842},
        {name:'ddddeade', lng: 120.35744048529967, lat: 30.49771311230842},
        {name:'dddeade', lng: 120.25744048529967, lat: 30.49771311230842},
        {name:'ddeade', lng: 120.15744048529967, lat: 30.49771311230842}
      ],
      show:true,
      chosen:{
        orgCode:'123',
        name:'123',
        need:'123',
        support:'123',
        moveNumber:'123',
        riskNumber:'4564',
        risk:'',
      },
      char1: null,
      char2: null,
      chosen2: -1,
      list:[0,1,2,3,4,5,6],
      printMe: {
        id: "printMe",
        popTitle: '物资风险测算',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    }
  },
  activated () {
    if (this.char1) {
      this.char1.resize()
    }
    // if (this.char2) {
    //   this.char2.resize()
    // }
  },
  mounted () {
   
    this.getDataList()
    // this.initchartmap()
  },
  methods:{
    addOrUpdateHandle (id) {
      console.log(id)
      this.crsVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    getDataList(){
      this.data = [
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        {supplyName:'ta撒大苏打倒萨大苏打实打实大苏打skt',WBS:'taskt',  projectLocation:'taskt',  planStartTime:'taskt',  supplyWarnLevel:'taskt',  warnLevel:'3'},
        ]
      console.log(this.data)
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    //选中动作
    handleCurrentChange(val) {
      this.currentRow = val
      console.log(val)
      this.chosen = val
      
      
    },
    //select动作
    handleSelectChange(a){
      this.selectList = a
    },
    // upload(e){
    //   var formData = new FormData()
    //   formData.append('file', e.target.files[0]);
    //   this.$http({
    //     url:this.$http.adornUrl('/supply/supplyRisk/uploadPicture'+'?pictureUrl='+this.chosen.url+'&riskId='+this.chosen.riskId+'&supplyName='+this.chosen.supplyName),
    //     method:'post',
    //     data:formData
    //   }).then((data)=>{
    //     if(data.data&&data.code == 0||data.data.code == 0){
    //       this.$message('图片上传成功')
    //       this.getDataList()
    //     }else{
    //       this.$message('图片上传失败')
    //     }
    //   })
    // }
    
  },
  watch:{
    selectList(val){
      //但是目前风险等级是要获取的，我这定死了
      let arr = [{warnLevel:1,sum:0},{warnLevel:3,sum:0},{warnLevel:2,sum:0}]
      val.forEach((item)=>{
        arr.forEach((ite)=>{
          if(item.warnLevel==ite.warnLevel){
            ite.sum+=1
          }
        })
      })
      this.levelSumList = arr.map((item)=>item.sum)
      this.ininchartbar()
    }
  }
}
</script>

<style>
.healthy-card{
  line-height: 24px;
  text-align: left;
  background-image: linear-gradient(45deg, #1f70ff, #2a97fe);
  color: rgb(255, 255, 255);
  border-radius: 5px;
  padding: 10px;
  font-size: 12px;
}
.healthy-card :nth-child(1){
  font-size:15px;
}
.imgUpload{
  display: inline-block;
  position: relative;
  width: 100%;
  height:20vh
}
.imgUpload >img{
  position: absolute;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);
  max-height: 100%;
  max-width: 100%;
}
.imgUpload >div{
  text-align: center;
  position: absolute;
  width: 100%;
  height:100%;
  line-height: 100%;
  font-size: 18vh;
  color:#ccc
  
}
.imgUpload >input{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height:30vh;
  line-height: 30vh;
  opacity: 0;
}
.marker_ani{
  animation:jump 1s infinite ease-in;
}
#projectrisk .el-form-item{
  margin-bottom:0px
}
#printMe{
  z-index: -1;
  position: absolute;
  opacity: 0;
  width:210mm;
}
@media print{
 #printMe{
    z-index: 999;
    position: absolute;
    opacity: 1;
  } 
}
</style>