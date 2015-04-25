/*
	侧边区域滑动插件，目前只支持由下向上的滑动
	依赖base.js中的Util对象
*/
define(["avalon","css!./avalon.slidemenu.css"],function(avalon){
	//所有滑动区域共享的遮罩
	var slideMask;
	function hideMask(){
		//点击遮罩 隐藏当前显示的slidemenu
		var menu;
		if(menu = slideMask.curMenu){
			slideMask.className = 'slidemask slidemask-hide-animate';
			menu.querySelector("div.slidemenu-inner").className = "slidemenu-inner slidemenu-bottom-hide-animate";
		}
	}
	var widget = avalon.ui.slidemenu = function(element, data, vmodels){
		if(!slideMask){
			slideMask = document.createElement("div");
			slideMask.className = 'slidemask';
			//tap mask 隐藏
			avalon.bind(slideMask,"tap",hideMask);
			//Util.onTap(slideMask,hideMask);
			avalon.bind(slideMask,'animationend',function(){
				if(avalon(this).hasClass("slidemask-hide-animate")){
					this.style.display = 'none';
				}
			});
			document.body.appendChild(slideMask);
		}
		var options = data.slidemenuOptions;
		var showed = false;
		var vmodel = avalon.define(data.slidemenuId,function(vm){
			avalon.mix(vm,options);
			vm.$skipArray = ['show','hide'];
			vm.$init = function(){
				avalon(element).addClass("slidemenu slidemenu-bottom");
				element.innerHTML = "<div class='slidemenu-inner'>" + element.innerHTML + "</div>"
				//为inner绑定动画结束事件
				avalon.bind(element.querySelector("div.slidemenu-inner"),'animationend',function(){
					if(avalon(this).hasClass("slidemenu-bottom-hide-animate")){
						this.parentNode.style.display = 'none';
					}
				});
				avalon.scan(element,[vmodel].concat(vmodels));
			};
			vm.show = function(){
				var inner = element.querySelector("div.slidemenu-inner");
				element.style.display = 'block';
				if(!showed){
					var $el = avalon(inner);
					var h = $el.height();
					element.style.height = h + 'px';
				}
				inner.className = 'slidemenu-inner slidemenu-bottom-animate';
				slideMask.style.display = 'block';
				slideMask.className = 'slidemask slidemask-animate';
				slideMask.curMenu = element;
			};
			vm.hide = hideMask;
		});
		return vmodel;
	};
	widget.version = 1.0;
	widget.defaults = {};
});