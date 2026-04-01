const pptxgen = require("/Users/yiyi/.nvm/versions/node/v22.12.0/lib/node_modules/pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "小明与小花的森林冒险";

const FOREST   = "2C5F2D";
const MOSS     = "97BC62";
const CREAM    = "FFF5E6";
const GOLD_TXT = "F5E6C8";
const GOLDEN   = "E8A045";
const BROWN    = "4A3728";

// ── Slide 1: 封面 ────────────────────────────────────────────
const s1 = pres.addSlide();
s1.background = { color: FOREST };

// 顶部金色装饰条
s1.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.12, fill:{color:GOLDEN}, line:{color:GOLDEN} });
// 底部金色装饰条
s1.addShape(pres.shapes.RECTANGLE, { x:0, y:5.505, w:10, h:0.12, fill:{color:GOLDEN}, line:{color:GOLDEN} });

// 半透明内容框
s1.addShape(pres.shapes.RECTANGLE, {
  x:0.8, y:0.7, w:8.4, h:4.2,
  fill:{ color:"FFFFFF", transparency:88 },
  line:{ color:GOLDEN, width:2 }
});

// 主标题
s1.addText("小明与小花的森林冒险", {
  x:0.8, y:1.1, w:8.4, h:1.3,
  fontSize:40, fontFace:"Georgia",
  color:GOLD_TXT, bold:true, align:"center", valign:"middle", margin:0
});

// 分隔线
s1.addShape(pres.shapes.LINE, { x:3, y:2.55, w:4, h:0, line:{color:GOLDEN, width:1.5} });

// 开篇正文
s1.addText(
  "有一天，小明的阿姨发现炉火渐渐变弱。\n于是她叫小明去附近的森林里捡些枯树枝回来。\n小明才踏上路，就遇见了小花，小花也想要同行。",
  {
    x:1.2, y:2.7, w:7.6, h:1.9,
    fontSize:17, fontFace:"Calibri",
    color:GOLD_TXT, align:"center", valign:"middle"
  }
);

// 底部小标签
s1.addText("一个关于勇气与成长的童话故事", {
  x:0, y:5.1, w:10, h:0.4,
  fontSize:12, fontFace:"Calibri",
  color:MOSS, align:"center", valign:"middle", italic:true
});

// ── Slide 2: 勇敢的小花 ──────────────────────────────────────
const s2 = pres.addSlide();
s2.background = { color:CREAM };

// 顶部绿色标题栏
s2.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.9, fill:{color:FOREST}, line:{color:FOREST} });
s2.addText("勇敢的小花", {
  x:0.6, y:0, w:8.8, h:0.9,
  fontSize:30, fontFace:"Georgia",
  color:GOLD_TXT, bold:true, align:"center", valign:"middle", margin:0
});
// 左侧黄点装饰
s2.addShape(pres.shapes.OVAL, { x:0.25, y:0.28, w:0.34, h:0.34, fill:{color:GOLDEN}, line:{color:GOLDEN} });

// 内容白框
s2.addShape(pres.shapes.RECTANGLE, {
  x:0.4, y:1.05, w:9.2, h:4.35,
  fill:{ color:"FFFFFF", transparency:25 },
  line:{ color:MOSS, width:1.5 }
});
// 左侧绿色竖条
s2.addShape(pres.shapes.RECTANGLE, { x:0.4, y:1.05, w:0.12, h:4.35, fill:{color:MOSS}, line:{color:MOSS} });

// 正文
s2.addText(
  "小花平时总是安安静静的，很少主动跟人说话。今天她鼓起勇气提出要一起去，小明很高兴地答应了。两人走进森林，阳光透过树叶洒下斑驳的光影。走着走着，他们听到了细微的鸣叫声。循声望去，一只小鸟掉在地上，翅膀似乎受了伤。小明想要靠近，小鸟却惊慌地扑腾着。这时，小花轻轻蹲下，用温柔的声音安抚着小鸟，慢慢伸出手。小鸟竟然安静下来，让她小心地捧起。小明惊讶地看着小花，发现她眼中闪烁着从未见过的光芒。",
  {
    x:0.65, y:1.2, w:8.9, h:4.1,
    fontSize:15.5, fontFace:"Calibri",
    color:BROWN, align:"left", valign:"top",
    paraSpaceAfter:6
  }
);

// ── Slide 3: 森林深处的勇气 ──────────────────────────────────
const s3 = pres.addSlide();
s3.background = { color:CREAM };

// 顶部绿色标题栏
s3.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.9, fill:{color:FOREST}, line:{color:FOREST} });
s3.addText("森林深处的勇气", {
  x:0.6, y:0, w:8.8, h:0.9,
  fontSize:30, fontFace:"Georgia",
  color:GOLD_TXT, bold:true, align:"center", valign:"middle", margin:0
});
// 左侧金点装饰
s3.addShape(pres.shapes.OVAL, { x:0.25, y:0.28, w:0.34, h:0.34, fill:{color:GOLDEN}, line:{color:GOLDEN} });

// 内容白框
s3.addShape(pres.shapes.RECTANGLE, {
  x:0.4, y:1.05, w:9.2, h:4.35,
  fill:{ color:"FFFFFF", transparency:25 },
  line:{ color:GOLDEN, width:1.5 }
});
// 左侧金色竖条
s3.addShape(pres.shapes.RECTANGLE, { x:0.4, y:1.05, w:0.12, h:4.35, fill:{color:GOLDEN}, line:{color:GOLDEN} });

// 正文
s3.addText(
  "他们将小鸟安置在树洞里后，继续往森林深处走去。奇怪的是，平日里热闹的森林今天格外安静，连虫鸣声都听不见。小明有些不安，想要回头。就在这时，前方传来低沉的吼声，一只受伤的小鹿被荆棘缠住了腿，正痛苦地挣扎。小明吓得往后退，但小花却主动走上前。她想起刚才安抚小鸟的经验，深吸一口气，轻声对小鹿说着安慰的话。她的手虽然在发抖，但还是坚定地解开了荆棘。小鹿获救后，用鼻子轻轻蹭了蹭小花的手，然后跳跃着消失在林间。小花转过身，脸上露出了自信的笑容。小明竖起大拇指：\u201c小花，你真勇敢！\u201d那一刻，小花感觉自己心中有什么东西悄悄改变了。",
  {
    x:0.65, y:1.2, w:8.9, h:4.1,
    fontSize:14.5, fontFace:"Calibri",
    color:BROWN, align:"left", valign:"top",
    paraSpaceAfter:5
  }
);

pres.writeFile({ fileName: "/Users/yiyi/Desktop/ClaudeCodeActualCombat/01_CC 核心概念速通/小明与小花的森林冒险.pptx" })
  .then(() => console.log("✅ PPT 已生成"))
  .catch(e => { console.error("❌", e); process.exit(1); });
