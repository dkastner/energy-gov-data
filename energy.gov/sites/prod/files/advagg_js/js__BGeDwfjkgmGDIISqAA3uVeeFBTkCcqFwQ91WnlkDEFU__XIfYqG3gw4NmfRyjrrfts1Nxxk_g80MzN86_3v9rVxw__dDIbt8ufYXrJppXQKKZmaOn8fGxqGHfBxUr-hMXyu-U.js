/*
	Papa Parse
	v4.0.7
	https://github.com/mholt/PapaParse
*/
;(function(e){"use strict";function u(r,i){var s=t?i:g(i);var o=s.worker&&Papa.WORKERS_SUPPORTED&&n;if(o){var u=d();u.userStep=s.step;u.userChunk=s.chunk;u.userComplete=s.complete;u.userError=s.error;s.step=b(s.step);s.chunk=b(s.chunk);s.complete=b(s.complete);s.error=b(s.error);delete s.worker;u.postMessage({input:r,config:s,workerId:u.id})}else{if(typeof r==="string"){if(s.download){var a=new f(s);a.stream(r)}else{var h=new c(s);var p=h.parse(r);return p}}else if(e.File&&r instanceof File||r instanceof Object){if(s.step||s.chunk){var a=new l(s);a.stream(r)}else{var h=new c(s);if(t){var v=new FileReaderSync;var m=v.readAsText(r,s.encoding);return h.parse(m)}else{v=new FileReader;v.onload=function(e){var t=new c(s);var n=t.parse(e.target.result)};v.onerror=function(){if(b(s.error))s.error(v.error,r)};v.readAsText(r,s.encoding)}}}}}function a(t,n){function a(){if(typeof n!=="object")return;if(typeof n.delimiter==="string"&&n.delimiter.length==1&&e.Papa.BAD_DELIMITERS.indexOf(n.delimiter)==-1){o=n.delimiter}if(typeof n.quotes==="boolean"||n.quotes instanceof Array)s=n.quotes;if(typeof n.newline==="string")u=n.newline}function f(e){if(typeof e!=="object")return[];var t=[];for(var n in e)t.push(n);return t}function l(e,t){var n="";if(typeof e==="string")e=JSON.parse(e);if(typeof t==="string")t=JSON.parse(t);var r=e instanceof Array&&e.length>0;var i=!(t[0]instanceof Array);if(r){for(var s=0;s<e.length;s++){if(s>0)n+=o;n+=c(e[s],s)}if(t.length>0)n+=u}for(var a=0;a<t.length;a++){var f=r?e.length:t[a].length;for(var l=0;l<f;l++){if(l>0)n+=o;var h=r&&i?e[l]:l;n+=c(t[a][h],l)}if(a<t.length-1)n+=u}return n}function c(t,n){if(typeof t==="undefined"||t===null)return"";t=t.toString().replace(/"/g,'""');var r=typeof s==="boolean"&&s||s instanceof Array&&s[n]||h(t,e.Papa.BAD_DELIMITERS)||t.indexOf(o)>-1||t.charAt(0)==" "||t.charAt(t.length-1)==" ";return r?'"'+t+'"':t}function h(e,t){for(var n=0;n<t.length;n++)if(e.indexOf(t[n])>-1)return true;return false}var r="";var i=[];var s=false;var o=",";var u="\r\n";a();if(typeof t==="string")t=JSON.parse(t);if(t instanceof Array){if(!t.length||t[0]instanceof Array)return l(null,t);else if(typeof t[0]==="object")return l(f(t[0]),t)}else if(typeof t==="object"){if(typeof t.data==="string")t.data=JSON.parse(t.data);if(t.data instanceof Array){if(!t.fields)t.fields=t.data[0]instanceof Array?t.fields:f(t.data[0]);if(!(t.data[0]instanceof Array)&&typeof t.data[0]!=="object")t.data=[t.data]}return l(t.fields||[],t.data||[])}throw"exception: Unable to serialize unrecognized input"}function f(n){function m(){if(h){g();return}a=new XMLHttpRequest;if(!t){a.onload=g;a.onerror=w}a.open("GET",f,!t);if(n.step||n.chunk){var e=r+v.chunkSize-1;if(i&&e>i)e=i;a.setRequestHeader("Range","bytes="+r+"-"+e)}try{a.send()}catch(s){w(s.message)}if(t&&a.status==0)w();else r+=v.chunkSize}function g(){if(a.readyState!=4)return;if(a.status<200||a.status>=400){w();return}o+=u+a.responseText;u="";h=!n.step&&!n.chunk||r>E(a);if(!h){var i=o.lastIndexOf("\r");if(i==-1)i=o.lastIndexOf("\n");if(i!=-1){u=o.substring(i+1);o=o.substring(0,i)}else{l();return}}var f=d.parse(o);o="";if(f&&f.data)s+=f.data.length;var c=h||v.preview&&s>=v.preview;if(t){e.postMessage({results:f,workerId:Papa.WORKER_ID,finished:c})}else if(b(n.chunk)){n.chunk(f,d);f=undefined}if(b(p)&&c)p(f);if(!c&&(!f||!f.meta.paused))l()}function w(r){var i=a.statusText||r;if(b(n.error))n.error(i);else if(t&&n.error){e.postMessage({workerId:Papa.WORKER_ID,error:i,finished:false})}}function E(e){var t=e.getResponseHeader("Content-Range");return parseInt(t.substr(t.lastIndexOf("/")+1))}function S(e){v=y(e);p=v.complete;v.complete=undefined;v.chunkSize=parseInt(v.chunkSize);d=new c(v);d.streamer=this}n=n||{};if(!n.chunkSize)n.chunkSize=Papa.RemoteChunkSize;var r=0,i=0,s=0;var o="";var u="";var a,f,l,h;var p,d,v;S(n);this.resume=function(){paused=false;l()};this.finished=function(){return h};this.pause=function(){paused=true};this.abort=function(){h=true;if(b(p))p({data:[],errors:[],meta:{aborted:true}})};this.stream=function(e){f=e;if(t){l=function(){m();g()}}else{l=function(){m()}}l()}}function l(n){function p(){if(!d&&(!g.preview||a<g.preview))E()}function E(){var e=Math.min(r+g.chunkSize,i.size);var t=h.readAsText(s.call(i,r,e),n.encoding);if(!w)S({target:{result:t}})}function S(s){r+=g.chunkSize;o+=u+s.target.result;u="";d=r>=i.size;if(!d){var c=o.lastIndexOf("\r");if(c==-1)c=o.lastIndexOf("\n");if(c!=-1){u=o.substring(c+1);o=o.substring(0,c)}else{p();return}}var h=m.parse(o);o="";if(h&&h.data)a+=h.data.length;var y=d||g.preview&&a>=g.preview;if(t){e.postMessage({results:h,workerId:Papa.WORKER_ID,finished:y})}else if(b(n.chunk)){n.chunk(h,l,i);if(f)return;h=undefined}if(b(v)&&y)v(h);if(!y&&(!h||!h.meta.paused))p()}function x(){if(b(n.error))n.error(h.error,i);else if(t&&n.error){e.postMessage({workerId:Papa.WORKER_ID,error:h.error,file:i,finished:false})}}function T(e){g=y(e);v=g.complete;g.complete=undefined;g.chunkSize=parseInt(g.chunkSize);m=new c(g);m.streamer=this}n=n||{};if(!n.chunkSize)n.chunkSize=Papa.LocalChunkSize;var r=0;var i;var s;var o="";var u="";var a=0;var f=false;var l=this;var h,p,s,d;var v,m,g;T(n);var w=typeof FileReader!=="undefined";this.stream=function(e){i=e;s=i.slice||i.webkitSlice||i.mozSlice;if(w){h=new FileReader;h.onload=S;h.onerror=x}else h=new FileReaderSync;p()};this.finished=function(){return d};this.pause=function(){f=true};this.resume=function(){f=false;p()};this.abort=function(){d=true;if(b(v))v({data:[],errors:[],meta:{aborted:true}})}}function c(e){function c(){if(f&&u){E("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+Papa.DefaultDelimiter+"'");u=false}if(e.skipEmptyLines){for(var t=0;t<f.data.length;t++)if(f.data[t].length==1&&f.data[t][0]=="")f.data.splice(t--,1)}if(p())d();return v()}function p(){return e.header&&a.length==0}function d(){if(!f)return;for(var e=0;p()&&e<f.data.length;e++)for(var t=0;t<f.data[e].length;t++)a.push(f.data[e][t]);f.data.splice(0,1)}function v(){if(!f||!e.header&&!e.dynamicTyping)return f;for(var t=0;t<f.data.length;t++){var n={};for(var r=0;r<f.data[t].length;r++){if(e.dynamicTyping){var i=f.data[t][r];if(i=="true")f.data[t][r]=true;else if(i=="false")f.data[t][r]=false;else f.data[t][r]=w(i)}if(e.header){if(r>=a.length){if(!n["__parsed_extra"])n["__parsed_extra"]=[];n["__parsed_extra"].push(f.data[t][r])}else n[a[r]]=f.data[t][r]}}if(e.header){f.data[t]=n;if(r>a.length)E("FieldMismatch","TooManyFields","Too many fields: expected "+a.length+" fields but parsed "+r,t);else if(r<a.length)E("FieldMismatch","TooFewFields","Too few fields: expected "+a.length+" fields but parsed "+r,t)}}if(e.header&&f.meta)f.meta.fields=a;return f}function m(t){var n=[",","	","|",";",Papa.RECORD_SEP,Papa.UNIT_SEP];var r,i,s;for(var o=0;o<n.length;o++){var u=n[o];var a=0,f=0;s=undefined;var l=(new h({delimiter:u,preview:10})).parse(t);for(var c=0;c<l.data.length;c++){var p=l.data[c].length;f+=p;if(typeof s==="undefined"){s=p;continue}else if(p>1){a+=Math.abs(p-s);s=p}}f/=l.data.length;if((typeof i==="undefined"||a<i)&&f>1.99){i=a;r=u}}e.delimiter=r;return{successful:!!r,bestDelimiter:r}}function g(e){e=e.substr(0,1024*1024);var t=e.split("\r");if(t.length==1)return"\n";var n=0;for(var r=0;r<t.length;r++){if(t[r][0]=="\n")n++}return n>=t.length/2?"\r\n":"\r"}function w(e){var n=t.test(e);return n?parseFloat(e):e}function E(e,t,n,r){f.errors.push({type:e,code:t,message:n,row:r})}var t=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;var n=this;var r=0;var i;var s;var o=false;var u;var a=[];var f={data:[],errors:[],meta:{}};if(b(e.step)){var l=e.step;e.step=function(t){f=t;if(p())c();else{c();if(f.data.length==0)return;r+=t.data.length;if(e.preview&&r>e.preview)s.abort();else l(f,n)}}}this.parse=function(t){if(!e.newline)e.newline=g(t);u=false;if(!e.delimiter){var r=m(t);if(r.successful)e.delimiter=r.bestDelimiter;else{u=true;e.delimiter=Papa.DefaultDelimiter}f.meta.delimiter=e.delimiter}var a=y(e);if(e.preview&&e.header)a.preview++;i=t;s=new h(a);f=s.parse(i);c();if(b(e.complete)&&!o&&(!n.streamer||n.streamer.finished()))e.complete(f);return o?{meta:{paused:true}}:f||{meta:{paused:false}}};this.pause=function(){o=true;s.abort();i=i.substr(s.getCharIndex())};this.resume=function(){o=false;s=new h(e);s.parse(i);if(!o){if(n.streamer&&!n.streamer.finished())n.streamer.resume();else if(b(e.complete))e.complete(f)}};this.abort=function(){s.abort();if(b(e.complete))e.complete(f);i=""}}function h(e){e=e||{};var t=e.delimiter;var n=e.newline;var r=e.comments;var i=e.step;var s=e.preview;var o=e.fastMode;if(typeof t!=="string"||t.length!=1||Papa.BAD_DELIMITERS.indexOf(t)>-1)t=",";if(r===t)throw"Comment character same as delimiter";else if(r===true)r="#";else if(typeof r!=="string"||Papa.BAD_DELIMITERS.indexOf(r)>-1)r=false;if(n!="\n"&&n!="\r"&&n!="\r\n")n="\n";var u=0;var a=false;this.parse=function(e){function S(){m.push(e.substr(u));d.push(m);u=f;if(p)N();return T()}function x(t){d.push(m);m=[];u=t;w=e.indexOf(n,u)}function T(e){return{data:d,errors:v,meta:{delimiter:t,linebreak:n,aborted:a,truncated:!!e}}}function N(){i(T());d=[],v=[]}if(typeof e!=="string")throw"Input must be a string";var f=e.length,l=t.length,c=n.length,h=r.length;var p=typeof i==="function";u=0;var d=[],v=[],m=[];if(!e)return T();if(o){var g=e.split(n);for(var y=0;y<g.length;y++){if(r&&g[y].substr(0,h)==r)continue;if(p){d=[g[y].split(t)];N();if(a)return T()}else d.push(g[y].split(t));if(s&&y>=s){d=d.slice(0,s);return T(true)}}return T()}var b=e.indexOf(t,u);var w=e.indexOf(n,u);for(;;){if(e[u]=='"'){var E=u;u++;for(;;){var E=e.indexOf('"',E+1);if(E==-1){v.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:d.length,index:u});return S()}if(E==f-1){m.push(e.substring(u,E).replace(/""/g,'"'));d.push(m);if(p)N();return T()}if(e[E+1]=='"'){E++;continue}if(e[E+1]==t){m.push(e.substring(u,E).replace(/""/g,'"'));u=E+1+l;b=e.indexOf(t,u);w=e.indexOf(n,u);break}if(e.substr(E+1,c)==n){m.push(e.substring(u,E).replace(/""/g,'"'));x(E+1+c);b=e.indexOf(t,u);if(p){N();if(a)return T()}if(s&&d.length>=s)return T(true);break}}continue}if(r&&m.length==0&&e.substr(u,h)==r){if(w==-1)return T();u=w+c;w=e.indexOf(n,u);b=e.indexOf(t,u);continue}if(b!=-1&&(b<w||w==-1)){m.push(e.substring(u,b));u=b+l;b=e.indexOf(t,u);continue}if(w!=-1){m.push(e.substring(u,w));x(w+c);if(p){N();if(a)return T()}if(s&&d.length>=s)return T(true);continue}break}return S()};this.abort=function(){a=true};this.getCharIndex=function(){return u}}function p(){var e="worker"+String(Math.random()).substr(2);document.write('<script id="'+e+'"></script>');return document.getElementById(e).previousSibling.src}function d(){if(!Papa.WORKERS_SUPPORTED)return false;var t=new e.Worker(n);t.onmessage=v;t.id=i++;r[t.id]=t;return t}function v(e){var t=e.data;var n=r[t.workerId];if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){if(b(n.userStep)){for(var i=0;i<t.results.data.length;i++){n.userStep({data:[t.results.data[i]],errors:t.results.errors,meta:t.results.meta})}delete t.results}else if(b(n.userChunk)){n.userChunk(t.results,t.file);delete t.results}}if(t.finished){if(b(r[t.workerId].userComplete))r[t.workerId].userComplete(t.results);r[t.workerId].terminate();delete r[t.workerId]}}function m(t){var n=t.data;if(typeof Papa.WORKER_ID==="undefined"&&n)Papa.WORKER_ID=n.workerId;if(typeof n.input==="string"){e.postMessage({workerId:Papa.WORKER_ID,results:Papa.parse(n.input,n.config),finished:true})}else if(e.File&&n.input instanceof File||n.input instanceof Object){var r=Papa.parse(n.input,n.config);if(r)e.postMessage({workerId:Papa.WORKER_ID,results:r,finished:true})}}function g(e){if(typeof e!=="object")e={};var t=y(e);if(typeof t.delimiter!=="string"||t.delimiter.length!=1||Papa.BAD_DELIMITERS.indexOf(t.delimiter)>-1)t.delimiter=s.delimiter;if(t.newline!="\n"&&t.newline!="\r"&&t.newline!="\r\n")t.newline=s.newline;if(typeof t.header!=="boolean")t.header=s.header;if(typeof t.dynamicTyping!=="boolean")t.dynamicTyping=s.dynamicTyping;if(typeof t.preview!=="number")t.preview=s.preview;if(typeof t.step!=="function")t.step=s.step;if(typeof t.complete!=="function")t.complete=s.complete;if(typeof t.error!=="function")t.error=s.error;if(typeof t.encoding!=="string")t.encoding=s.encoding;if(typeof t.worker!=="boolean")t.worker=s.worker;if(typeof t.download!=="boolean")t.download=s.download;if(typeof t.skipEmptyLines!=="boolean")t.skipEmptyLines=s.skipEmptyLines;if(typeof t.fastMode!=="boolean")t.fastMode=s.fastMode;return t}function y(e){if(typeof e!=="object")return e;var t=e instanceof Array?[]:{};for(var n in e)t[n]=y(e[n]);return t}function b(e){return typeof e==="function"}var t=!e.document,n;var r={},i=0;var s={delimiter:"",newline:"",header:false,dynamicTyping:false,preview:0,step:undefined,encoding:"",worker:false,comments:false,complete:undefined,error:undefined,download:false,chunk:undefined,skipEmptyLines:false,fastMode:false};e.Papa={};e.Papa.parse=u;e.Papa.unparse=a;e.Papa.RECORD_SEP=String.fromCharCode(30);e.Papa.UNIT_SEP=String.fromCharCode(31);e.Papa.BYTE_ORDER_MARK="﻿";e.Papa.BAD_DELIMITERS=["\r","\n",'"',e.Papa.BYTE_ORDER_MARK];e.Papa.WORKERS_SUPPORTED=!!e.Worker;e.Papa.LocalChunkSize=1024*1024*10;e.Papa.RemoteChunkSize=1024*1024*5;e.Papa.DefaultDelimiter=",";e.Papa.Parser=h;e.Papa.ParserHandle=c;e.Papa.NetworkStreamer=f;e.Papa.FileStreamer=l;if(e.jQuery){var o=e.jQuery;o.fn.parse=function(t){function i(){if(r.length==0){if(b(t.complete))t.complete();return}var e=r[0];if(b(t.before)){var n=t.before(e.file,e.inputElem);if(typeof n==="object"){if(n.action=="abort"){s("AbortError",e.file,e.inputElem,n.reason);return}else if(n.action=="skip"){u();return}else if(typeof n.config==="object")e.instanceConfig=o.extend(e.instanceConfig,n.config)}else if(n=="skip"){u();return}}var i=e.instanceConfig.complete;e.instanceConfig.complete=function(t){if(b(i))i(t,e.file,e.inputElem);u()};Papa.parse(e.file,e.instanceConfig)}function s(e,n,r,i){if(b(t.error))t.error({name:e},n,r,i)}function u(){r.splice(0,1);i()}var n=t.config||{};var r=[];this.each(function(t){var i=o(this).prop("tagName").toUpperCase()=="INPUT"&&o(this).attr("type").toLowerCase()=="file"&&e.FileReader;if(!i||!this.files||this.files.length==0)return true;for(var s=0;s<this.files.length;s++){r.push({file:this.files[s],inputElem:this,instanceConfig:o.extend({},n)})}});i();return this}}if(t)e.onmessage=m;else if(Papa.WORKERS_SUPPORTED)n=p()})(this);;/**/
