"use strict";function init(){function e(e){return e.replace(/\\/g,"/")}function t(e){return{mtime:+e.mtime,birthtime:+e.birthtime,isDir:e.isDirectory(),size:e.size}}var r=require("glob"),i=require("fs"),s=require("path"),o=require("url"),n=require("rmdir"),a=require("../../lib/react.js"),c=require("../../cssStr/cssStr.js"),p=(require("../../actions/webviewActions.js"),require("../../actions/windowActions.js")),h=require("../../stores/windowStores.js"),u=(require("../../actions/projectActions.js"),require("../../weapp/utils/tools.js")),f=require("../../weapp/utils/projectManager.js"),d=require("../../stores/projectStores.js"),l=require("../../common/log/log.js"),m={},E=!1,v=function(e){p.showTipsMsg({msg:e,type:"error"})},_=function(e,t){p.showConfirm({content:e,callback:t})},w=a.createClass({displayName:"Edit",getInitialState:function(){return{project:this.props.project}},onMessage:function(a){var c=this,p=a.command,h=a.msg,f=a.ext,l=this.state.project;switch(p){case"GET_FILE_LIST":if(E)return;E=!0;var v=h.options,_=v.ignore||["node_modules/**/*","node_modules"];r("**",{cwd:l.projectpath,ignore:_},function(e,r){E=!1;for(var o={ret:e?e.toString():0,res:{files:e?[]:r,info:{}}},n=0;n<r.length;n++){var a=r[n],p=s.join(l.projectpath,a),h=i.lstatSync(p),u=h.isDirectory();u&&(r[n]=a+"/"),o.res.info[r[n]]=t(h)}r.forEach(function(e){m[e]=!0}),c.postMessage("webframe","RETURN_RES",o,f)});break;case"GET_FILE_DATA":var w=h.path,g=s.extname(w);if(".jpg"===g||".png"===g||".jpeg"===g||"icon"===g){var S="";try{S=decodeURI(o.resolve(u.getBaseURL(l),w))}catch(R){S=o.resolve(u.getBaseURL(l),w)}this.postMessage("webframe","RETURN_RES",{ret:"0",res:{data:S}},f)}else!function(){var e=s.join(l.projectpath,w);i.readFile(e,"utf8",function(r,s){var o=i.lstatSync(e),n=t(o),a={ret:r?r.toString():0,res:{data:r?"":s,info:n}};c.postMessage("webframe","RETURN_RES",a,f)})}();break;case"SAVE_FILE_DATA":var b=s.join(l.projectpath,h.path),j=h.data,y=void 0;try{i.writeFileSync(b,j,"utf8");var N=i.lstatSync(b),T=+N.mtime;m[e(h.path)]=T,y={ret:0,res:{path:h.path,info:t(N)}}}catch(M){y={ret:M.toString(),res:""}}this.postMessage("webframe","RETURN_RES",y,f);break;case"DEL_FILE":var I=h.path,W=void 0;try{i.unlinkSync(s.join(l.projectpath,I)),I=e(I),W={ret:0,res:I},delete m[I]}catch(M){W={ret:M.toString(),res:""}}this.postMessage("webframe","RETURN_RES",W,f);break;case"RENAME_FILE":var D=s.join(l.projectpath,h.oldPath),L=s.join(l.projectpath,h.newPath),F=void 0;try{i.renameSync(D,L),delete m[e(h.oldPath)];var A=i.lstatSync(L);m[h.newPath]=!0,F={ret:0,res:{path:h.newPath,info:t(A)}}}catch(M){F={ret:M.toString(),res:""}}this.postMessage("webframe","RETURN_RES",F,f);break;case"RM_DIR":var C=function(){var t=l.projectpath,r=s.join(t,h.path);return n(r,function(r,i,o){r||(i.forEach(function(r){var i=s.relative(t,r);i=e(i),delete m[i]}),o.forEach(function(r){var i=s.relative(t,r);i=e(i),delete m[i]}));var n={ret:r?r.toString():0,res:r?"":i};c.postMessage("webframe","RETURN_RES",n,f)}),"break"}();if("break"===C)break;case"ADD_FILE":var U=s.join(l.projectpath,h.path),O=i.existsSync(U),k=void 0;if(O)k={ret:h.path+" already existed"},this.postMessage("webframe","RETURN_RES",k,f);else{try{i.writeFileSync(U,"","utf8"),m[e(h.path)]=!0;var P=i.lstatSync(U);k={ret:0,res:{path:h.path,info:t(P)}}}catch(M){k={ret:M.toString(),res:""}}this.postMessage("webframe","RETURN_RES",k,f)}break;case"MAKE_DIR":var q=s.join(l.projectpath,h.path),B=void 0;try{i.mkdirSync(q),m[e(h.path)]=!0;var x=i.lstatSync(q);B={ret:0,res:{path:q,info:t(x)}}}catch(M){B={ret:M.toString(),res:""}}this.postMessage("webframe","RETURN_RES",B,f);break;case"GET_PROJECT_INFO":this.postMessage("webframe","RETURN_RES",{ret:0,res:l},f);break;case"SET_EDIT_WEBVIEW":var G=h.editWebview;d.setProjectEditWebview(l.hash,G),this.postMessage("webframe","RETURN_RES",{ret:0,res:G},f)}},postMessage:function(e,t,r,i){var s=this,o={to:e,msg:r,command:t,ext:i};return this.port?(this.msgQuery.length&&(this.msgQuery.forEach(function(e){s.port.postMessage(e)}),this.msgQuery=[]),void this.port.postMessage(o)):void this.msgQuery.push(o)},initport:function(e){var t=this;"edit"===e.name&&(this.port=e,this.port.onMessage.addListener(this.onMessage),this.port.onDisconnect.addListener(function(){t.port.onMessage.removeListener(t.onMessage),delete t.port,delete t.portID,t.msgQuery=[]}),this.postMessage("contentscript","SHAKE_HANDS",{}))},initRuntime:function(){chrome.runtime.onConnect.addListener(this.initport)},addContentScripts:function(){this.webview.addContentScripts([{name:"contentscript",matches:["<all_urls>"],js:{files:["app/dist/contentscript/editcontent.js"]},run_at:"document_start"}])},_windowFocus:function(){var e=this;if("focus"!==this.currentStatus){var t={eventType:"focus"};this.postMessage("webframe","WINDOW_CHANGE",t,{}),setTimeout(function(){e.webview.focus()},100),this.currentStatus="focus"}},_windowBlur:function(){if("blur"!==this.currentStatus){var e={eventType:"blur"};this.postMessage("webframe","WINDOW_CHANGE",e,{}),this.currentStatus="blur"}},_editWebview:function(e,t){e.hash===this.props.project.hash&&this.postMessage("webframe","WEBVIEW_SHOW_CHANGE",{editWebview:t},{})},_openProjectFile:function(e){this.postMessage("webframe","OPEN_FILE",e,{})},componentDidMount:function(){this.msgQuery=[],this.show=this.props.show;var e=this.refs.container,t=this.webview=document.createElement("webview");t.className="simulator-bd-webview_body",t.setAttribute("partition","persist:trusted"),t.setUserAgentOverride(t.getUserAgent()+" devtoolsedit"),e.appendChild(t),this.addContentScripts(),this.initRuntime(),t.addEventListener("dialog",function(e){var t=e.messageType||"",r=e.messageText,i=e.dialog;if("alert"===t)v(r);else if("confirm"===t)e.preventDefault(),_(r,function(e){e?i.ok():i.cancel()});else if("prompt"===t){var s=prompt(r);null!==s?i.ok(s):i.cancel()}}),this.initWatcher(),t.src="app/html/edit.html",h.on("WINDOW_BLUR",this._windowFocus),h.on("WINDOW_FOCUS",this._windowBlur),d.on("PROJECT_STORES_CHANGE_EDIT_WEBVIEW",this._editWebview),h.on("OPEN_PROJECT_FILE",this._openProjectFile)},componentWillUnmount:function(){chrome.runtime.onConnect.removeListener(this.initport),h.removeListener("WINDOW_BLUR",this._windowFocus),h.removeListener("WINDOW_FOCUS",this._windowBlur),d.removeListener("PROJECT_STORES_CHANGE_EDIT_WEBVIEW",this._editWebview),h.removeListener("OPEN_PROJECT_FILE",this._openProjectFile),this.webview.remove(),m={}},initWatcher:function(){var r=this,i=f.manager;i.on("FILE_CHANGE",function(i,o,n,a){if(i.hash===r.state.project.hash){var c=a?+a.mtime:0,p=a?t(a):{},h={};n=e(n);var u=(s.join(i.projectpath,n),m[n]);if("unlinkDir"===o&&(u=m[n+"/"]),"add"!==o&&"addDir"!==o||u)if("unlink"!==o&&"unlinkDir"!==o||!u){if("change"!==o)return void l.info("edit.js watch "+o);if(m[n]===c)return;m[n]=c,h={eventType:o,fileName:n,info:p}}else h={eventType:o,fileName:n,info:p},delete m[n];else h={eventType:o,fileName:n,info:p};r.postMessage("webframe","FILE_CHANGE",h,{})}})},componentWillReceiveProps:function(e){"edit"===e.show?this._windowFocus():this._windowBlur()},render:function(){var e=this.props,t=e.show,r=(e.project,"edit"===t?{}:c.displayNone);return a.createElement("div",{className:"edit",ref:"container",style:r})}});_exports=w}var _exports;init(),module.exports=_exports;