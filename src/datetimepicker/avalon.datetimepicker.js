define([
	"avalon","text!./avalon.datetimepicker.html?ff",
	"css!./avalon.datetimepicker.css?eee",
	"pick/avalon.pick.js?ddd"],function(avalon,template){
	/*
		占用如下vmodel id
		$datetimepicker [datetimepickerId]
		$pickyear $pickmonth $pickday $pickhour $pickminute $picksecond
	*/
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
	function toggleDtp(isShow){
		if(isShow){
			mask.style.display = 'block';
			dtp.style.display = 'block';
		}else{
			mask.style.display = 'none';
			dtp.style.display = 'none';
		}
	}
	var mask;
	var dtp;
	var widget = avalon.ui.datetimepicker = function(element, data, vmodels){
		var options = data.datetimepickerOptions;
		function afterShow(){
			var $datetimepicker = avalon.vmodels.$datetimepicker;
			$datetimepicker.$curVmodel = vmodel;
			avalon.each(["showClearBtn","showTodayBtn","format"],function(i,v){
				$datetimepicker[v] = vmodel[v];
			});
			var val = vmodel.value;
			var date = new Date(val.replace(/\-/g,"/"));
			if(date.toString() === "Invalid Date"){
				date = new Date();
			}
			setPickerTime(date);
		}
		var vmodel = avalon.define(data.datetimepickerId,function(vm){
			avalon.mix(vm,options,{
				$init : function(){
					element.innerHTML = "{{value === '' ? emptyMes : value}}<input type='hidden' ms-duplex='value'>";
					avalon.bind(element,"tap",function(){
						if(!mask){
							mask = document.createElement("div");
							mask.className = "dtp-mask";
							dtp = document.createElement("div");
							dtp.className = "dtp";
							dtp.setAttribute("ms-skip","");
							dtp.innerHTML = template;
							document.body.appendChild(dtp);
							document.body.appendChild(mask);
							avalon.bind(mask,"tap",function(){
								toggleDtp(false);
							});
						}
						toggleDtp(true);
						if(dtp.getAttribute("ms-skip") !== null){
							dtp.removeAttribute("ms-skip");
							var mm = avalon.define(avalon.mix({
								$id : "$datetimepicker",
								$curVmodel : null
							},pickOptions));
							setTimeout(function(){
								avalon.scan(dtp,mm);
								afterShow();
								var mes = dtp.querySelector(".dtp-loading");
								mes.parentNode.removeChild(mes);
							},100);
						}else{
							setTimeout(function(){
								afterShow();
							},100);
						}
					});
					avalon.scan(element,vmodel);
				},
				widgeElement : element,
				$skipArray : ["widgeElement"],
				clear : function(){
					vmodel.value = '';
					toggleDtp(false);
				},
				ok : function(){
					var time = getPickerTime(vmodel);
					vmodel.value = time;
					toggleDtp(false);
				}
			});
		});
		return vmodel;
	};
	widget.defaults = {
		showClearBtn : true,
		showTodayBtn : true,
		$curYear : new Date().getFullYear(),
		format : "yyyy-MM-dd hh:mm:ss",
		value : "",
		emptyMes : "请点击选择时间"
	};
	var pickOptions = avalon.mix({
		$pickyearOpts : {
			data : getScope(widget.defaults.$curYear - 10,widget.defaults.$curYear + 10),
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
			toggleDtp(false);
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