import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input, Button, Image } from '@tarojs/components';
import { isWeixin,postIo,back } from '../../utils/index';
import './index.less';
import AddressSelector from "../../components/addressSelector/index";
import Header from "../../components/head/head"
import { connect } from '@tarojs/redux'
import { actions } from 'roronoa-zoro'
import { bindActionCreators } from 'redux'
import { namespace } from '../../models/test'

@connect(
    state => ({
        data: state[namespace],
    }),
    dispatch => bindActionCreators(actions(namespace), dispatch),
)
export default class CityList extends Component {
    constructor(){
        super(...arguments);
        this.state = {
            showHeader: isWeixin(),
            hotCity:[],
            cityList:[],
        }
    }
    back(){
      //如果是h5的就需要做这个设置
      if(!isWeixin()){
          history.back();
      }
    }
    componentDidMount(){
      //  console.log("componentDidMount");
    }
    componentWillMount (){
        let startCity =  this.props.data.startCity;
      // console.log("startCity",startCity)
       // return;0
        //初始化热门城市
        this.initStart({
            h5Url:'/api?server=tz_getTargetHotCity',
            weappUrl: '/ticket/getTargetHotCity',
            tag:'hotCity',
            data:{}
        })

        //初始化开始城市
        this.initStart({
            h5Url:'/api?server=tz_queryTargetPlace',
            weappUrl: 'ticket/getTargetPlace',
            tag:'cityList',
            data:JSON.stringify({
                startNo: startCity.cityNo ,
                startType: startCity.type
            })
        })
    }
    initStart(param){
       // console.log("initStart--------------")
        let url =  param.h5Url||'/api?server=tz_getStartHotCity'; //H5的情况
        if(isWeixin()){
            url = param.weappUrl||'/ticket/getConnStartCity';
        }
        //需要初始化，开始城市，初始化热门城市
        postIo({
            configUrl:url,
            method:'POST',
            data:param.data,
            header:{
                'Content-Type': 'application/json'
            }
        }).then((res)=>{
         //  console.log("url",url,res);
            if(param.tag == "hotCity"){
                this.setState({
                    hotCity: isWeixin()?res.data.body.data:res.data.data.body.data
                })
                return;
            }
            this.setState({
                cityList: isWeixin()?res.data.body.data:res.data.data.body.data
            })
        }).catch((err)=>{

        })
    }

    chooseItem(item,tag){
       // console.log("item",this.props);
      //  return;
        const {setEndCity} =  this.props;
        setEndCity({...item});
        //历史记录存储
        if(tag){

        }
        //起始地跳转
        back();

    }

    render(){
        //console.log("hotCity", this.state.hotCity);
        return (
            <View style='height:100%;overflow:hidden;'>
                {
                    !this.state.showHeader && <Header leftBack={this.back.bind(this)} centerTitle='选择目的城市'></Header>
                }
               <AddressSelector hotCity={this.state.hotCity} cityList={this.state.cityList} bindClick={this.chooseItem.bind(this)}></AddressSelector>
            </View>
        )
    }
}
