new Vue({
  el:"#app",
  data:{
    // i:0,
    // LIWIDTH:62,
    // ulStyle:{
    //   width:0,
    //   marginLeft:0
    // },
    a:{},
    b:[],
    c:[]
  },
  // methods: {
  //   changei(index){
  //     this.i=index;
  //   }
  // },
  created(){
   axios.get(
      "http://127.0.0.1:3000/details",
      {
        params:{
          lid:location.search.split("=")[1]
        }
      }
    ).then(result=>{
      console.log(result.data);
     this.a=result.data.product[0];
     console.log(this.a);
     this.b=result.data.pics;
     this.c=result.data.specs;
    })
  },

})