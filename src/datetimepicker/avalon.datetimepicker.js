define(["avalon","text!./avalon.datetimepicker.html","css!./avalon.datetimepicker.css","slidemenu/avalon.slidemenu","pick/avalon.pick"],function(avalon,template){
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
	var widget = avalon.ui.datetimepicker = function(element, data, vmodels){
		var options = data.datetimepickerOptions;
		var vmodel = avalon.define(data.datetimepickerId,function(vm){
			avalon.mix(vm,options);
			vm.$init = function(){
				avalon.bind(element,"click",function(){
					if(!isInit){
						var div = document.createElement("div");
						div.setAttribute("ms-widget","slidemenu,$pickSlidemenu,$slidemenuOpts");
						div.innerHTML = template;
						var now = new Date();
						var m = avalon.define({
							$id : +new Date,
							$slidemenuOpts : {
								position : 'bottom',
								onShowEnd : function(){
									avalon.each(this.querySelectorAll("div[data-widget]"),function(i,el){
										el.setAttribute("ms-widget",el.getAttribute("data-widget"));
										el.removeAttribute("data-widget");
										var mm = avalon.define({
											$id : +new Date(),
											$pickyearOpts : {
												data : getScope(now.getFullYear() - 10,now.getFullYear() + 10),
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
											}
										});
										avalon.scan(el,mm);
									});
								}
							}
						});
						document.body.appendChild(div);
						avalon.scan(div,m);
						isInit = true;
					}
					avalon.vmodels.$pickSlidemenu.show();
				});
			};
		});
		return vmodel;
	};
	widget.defaults = {
		
	};
});