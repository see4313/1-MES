import{b as o,f as d}from"./index-C6cMUqqj.js";import{at as p,c as t,o as r,i as l,s as i,aa as u,d as b,t as m}from"./index-BkcQ_3tW.js";var g=`
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`,c={root:function(s){var a=s.instance;return["p-progressbar p-component",{"p-progressbar-determinate":a.determinate,"p-progressbar-indeterminate":a.indeterminate}]},value:"p-progressbar-value",label:"p-progressbar-label"},v=p.extend({name:"progressbar",style:g,classes:c}),h={name:"BaseProgressBar",extends:o,props:{value:{type:Number,default:null},mode:{type:String,default:"determinate"},showValue:{type:Boolean,default:!0}},style:v,provide:function(){return{$pcProgressBar:this,$parentInstance:this}}},f={name:"ProgressBar",extends:h,inheritAttrs:!1,computed:{progressStyle:function(){return{width:this.value+"%",display:"flex"}},indeterminate:function(){return this.mode==="indeterminate"},determinate:function(){return this.mode==="determinate"},dataP:function(){return d({determinate:this.determinate,indeterminate:this.indeterminate})}}},y=["aria-valuenow","data-p"],k=["data-p"],w=["data-p"],P=["data-p"];function B(e,s,a,S,z,n){return r(),t("div",i({role:"progressbar",class:e.cx("root"),"aria-valuemin":"0","aria-valuenow":e.value,"aria-valuemax":"100","data-p":n.dataP},e.ptmi("root")),[n.determinate?(r(),t("div",i({key:0,class:e.cx("value"),style:n.progressStyle,"data-p":n.dataP},e.ptm("value")),[e.value!=null&&e.value!==0&&e.showValue?(r(),t("div",i({key:0,class:e.cx("label"),"data-p":n.dataP},e.ptm("label")),[u(e.$slots,"default",{},function(){return[b(m(e.value+"%"),1)]})],16,w)):l("",!0)],16,k)):n.indeterminate?(r(),t("div",i({key:1,class:e.cx("value"),"data-p":n.dataP},e.ptm("value")),null,16,P)):l("",!0)],16,y)}f.render=B;export{f as s};
