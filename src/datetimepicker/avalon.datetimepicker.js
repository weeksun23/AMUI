define(["avalon","text!./avalon.datetimepicker.html","css!./avalon.datetimepicker.css","slidemenu/avalon.slidemenu","pick/avalon.pick"],function(avalon,template){
	/*
		占用如下vmodel id
		$datetimepicker $pickslidemenu
		$pickyear $pickmonth $pickday $pickhour $pickminute $picksecond
	*/
	var isInit;
	function getScope(min,max){
		var re = [];
		for(var i=min;i<=max;i++){
			re.push({
				value : i,
				text : i
			});
		}
		return re;
	}
	function setValue(element,value){
		var tagName = element.tagName.toLowerCase();
		if(tagName === "input"){
			element.value = value;
		}else{
			element.innerHTML = "";
		}
	}
	function getValue(element){
		var tagName = element.tagName.toLowerCase();
		if(tagName === "input"){
			return element.value;
		}else{
			return element.innerHTML;
		}
	}
	function setPickerTime(date){
		if(typeof date == 'string'){
			date = new Date(date.replace(/\-/g,"/"));
		}else if(typeof date == 'number'){
			date = new Date(date);
		}
		var vmodels = avalon.vmodels;
		avalon.each({
			$pickyear : date.getFullYear(),
			$pickmonth : date.getMonth() + 1,
			$pickday : date.getDate(),
			$pickhour : date.getHours(),
			$pickminute : date.getMinutes(),
			$picksecond : date.getSeconds()
		},function(k,v){
			vmodels[k].setValue(v);
		});
	}
	function paddingZero(str,len){
    	len = len || 2;
    	str = str + "";
    	var strLen = str.length;
    	if(strLen >= len) return str;
    	return new Array(len - strLen + 1).join('0') + str;
    }
	function getPickerTime(vmodel){
		var vmodels = avalon.vmodels;
		var format = vmodel.format;
		avalon.each({
			$pickyear : "yyyy",
			$pickmonth : "MM",
			$pickday : "dd",
			$pickhour : "hh",
			$pickminute : "mm",
			$picksecond : "ss"
		},function(k,v){
			var val = vmodels[k].getValue();
			format = format.replace(v,paddingZero(val,v.length));
		});
		return format;
	}
	var widget = avalon.ui.datetimepicker = function(element, data, vmodels){
		var options = data.datetimepickerOptions;
		var vmodel = avalon.define(data.datetimepickerId,function(vm){
			avalon.mix(vm,options,{
				widgeElement : element,
				$skipArray : ["widgeElement"],
				clear : function(){
					setValue(vmodel.widgeElement,"");
					avalon.vmodels.$pickslidemenu.hide();
				},
				ok : function(){
					var time = getPickerTime(vmodel);
					setValue(vmodel.widgeElement,time);
					avalon.vmodels.$pickslidemenu.hide();
				}
			});
		});
		//datetimepickerId
		avalon.bind(element,"tap",function(){
			if(!isInit){
				var div = document.createElement("div");
				div.setAttribute("ms-widget","slidemenu,$pickslidemenu,$slidemenuOpts");
				div.innerHTML = template;
				var m = avalon.define({
					$id : +new Date,
					$curVmodel : null,
					$slidemenuOpts : {
						position : 'bottom',
						onShowEnd : function(){
							var dtp = this.querySelector("div.dtp");
							if(dtp.getAttribute("ms-skip") !== null){
								dtp.removeAttribute("ms-skip");
								var mm = avalon.define(avalon.mix({
									$id : "$datetimepicker",
									$curVmodel : null
								},pickOptions));
								avalon.scan(dtp,mm);
							}
							var $datetimepicker = avalon.vmodels.$datetimepicker;
							var $curVmodel = avalon.vmodels.$pickslidemenu.$curVmodel;
							$datetimepicker.$curVmodel = $curVmodel;
							avalon.each(["showClearBtn","showTodayBtn","format"],function(i,v){
								$datetimepicker[v] = $curVmodel[v];
							});
							var val = getValue($curVmodel.widgeElement);
							var date = new Date(val.replace(/\-/g,"/"));
							if(date.toString() === "Invalid Date"){
								date = new Date();
							}
							setPickerTime(date);
						}
					}
				});
				document.body.appendChild(div);
				avalon.scan(div,m);
				isInit = true;
			}
			avalon.vmodels.$pickslidemenu.$curVmodel = vmodel;
			avalon.vmodels.$pickslidemenu.show();
		});
		return vmodel;
	};
	widget.defaults = {
		showClearBtn : true,
		showTodayBtn : true,
		curYear : new Date().getFullYear(),
		format : "yyyy-MM-dd hh:mm:ss"
	};
	var pickOptions = avalon.mix({
		$pickyearOpts : {
			data : getScope(widget.defaults.curYear - 10,widget.defaults.curYear + 10),
			unit : "年"
		},
		$pickmonthOpts : {
			data : getScope(1,12),
			unit : "月"
		},
		$pickdayOpts : {
			data : getScope(1,31),
			unit : "日"
		},
		$pickhourOpts : {
			data : getScope(0,23),
			unit : "时"
		},
		$pickminuteOpts : {
			data : getScope(0,59),
			unit : "分"
		},
		$picksecondOpts : {
			data : getScope(0,59),
			unit : "秒"
		},
		cancel : function(){
			avalon.vmodels.$pickslidemenu.hide();
		},
		clear : function(){
			avalon.vmodels.$datetimepicker.$curVmodel.clear();
		},
		today : function(){
			setPickerTime(new Date());
		},
		ok : function(){
			avalon.vmodels.$datetimepicker.$curVmodel.ok();
		}
	},widget.defaults);
});