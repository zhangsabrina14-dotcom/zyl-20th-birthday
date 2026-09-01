import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* 页面数据                                                             */
/* img 为整页切图（视觉 100% 还原），caption 为需要打字机的文字          */
/* pos: intro = 开场居中 / large = 第五页居中大框 / memory = 回忆底部    */
/* ------------------------------------------------------------------ */

type Page = {
  id: string;
  img: string;
  kind: "cover" | "card" | "ending";
  caption?: string;
  pos?: "intro" | "large" | "memory";
};

const BASE = import.meta.env.BASE_URL;
const IMG = (n: number) => `${BASE}images/photo-${n}.${n === 27 ? "png" : "webp"}`;

const PAGES: Page[] = [
  { id: "cover", img: IMG(1), kind: "cover" },

  // 开场三连（文字框在卡片正下方）
  {
    id: "c01",
    img: IMG(26),
    kind: "card",
    pos: "intro",
    caption: "Hello 张羽伦小宝宝，今天是你 20 岁生日，你开心吗？",
  },
  {
    id: "c02",
    img: IMG(25),
    kind: "card",
    pos: "intro",
    caption: "也是 2 字开头了呀，总算是“陪”你过了一个生日了，尽管是异地恋，你是不是也很想我？",
  },
  {
    id: "c03",
    img: IMG(24),
    kind: "card",
    pos: "intro",
    caption: "细数我们也在一起了九个月了，我想做这个网页作为对你生日的庆祝，并表达对你的爱意，那我们就开始吗！",
  },

  // 回忆（第五页为居中大文字框，其余为底部文字框）
  { id: "m01", img: IMG(27), kind: "card", pos: "large", caption: "第一次见面我就把手机给丢了，你好耐心的帮我找，我觉得你人真好。" },
  { id: "m02", img: IMG(28), kind: "card", pos: "memory", caption: "哈哈哈，这是我们第一次约会吃饭，谁都没想到凌晨吃 69 折。" },
  { id: "m03", img: IMG(23), kind: "card", pos: "memory", caption: "两个人点了好多，我还用那个竹荪包虾滑，好美味呀。" },
  { id: "m04", img: IMG(22), kind: "card", pos: "memory", caption: "第一次一起野餐和我的朋友们还有小 I，好可爱好治愈的一张照片。" },
  { id: "m05", img: IMG(18), kind: "card", pos: "memory", caption: "那时候给你准备的花和手写信向你表白，我忐忑不安怕你不喜欢。" },
  { id: "m06", img: IMG(17), kind: "card", pos: "memory", caption: "后来你跟我说，你很爱护那封信，我还是挺开心的。" },
  { id: "m07", img: IMG(13), kind: "card", pos: "memory", caption: "当时觉得幸好是你。" },
  { id: "m08", img: IMG(11), kind: "card", pos: "memory", caption: "老公神颜已被我发掘！" },
  { id: "m09", img: IMG(10), kind: "card", pos: "memory", caption: "看你那个萌萌的样子，当时可想你了。" },
  { id: "m10", img: IMG(8), kind: "card", pos: "memory", caption: "我们刚在一起的时候去吃这个水浒烤肉，你好可爱的一直在烤，一下蹲着一下站着，还站到我旁边来哈哈哈好萌。" },
  { id: "m11", img: IMG(7), kind: "card", pos: "memory", caption: "你一定还记得那时候住白金汉宫，我们经常骑小电驴带着小 I 去草坪玩。" },
  { id: "m12", img: IMG(6), kind: "card", pos: "memory", caption: "那是我最最最快乐的时间好怀念。" },
  { id: "m13", img: IMG(9), kind: "card", pos: "memory", caption: "寒假的时候我们两个一起看《甄嬛传》，你看的比我还起劲，还偷偷提前看，就这么忍不住！真是一个小朋友。" },
  { id: "m14", img: IMG(12), kind: "card", pos: "memory", caption: "我要你陪我做拼豆，你这个没耐心的，拼的七窍生烟哈哈哈好可爱，看你带在包上我好开心。" },
  { id: "m15", img: IMG(14), kind: "card", pos: "memory", caption: "你那时候拿着小零食教 I 趴下，我感觉你好爱我的小狗，其实我很感动。" },
  { id: "m16", img: IMG(16), kind: "card", pos: "memory", caption: "我记得我们那时候还很喜欢在家里做各种各样的美食。我们去锅圈买了一堆烤肉回来吃，好幸福 555 真的很美味。" },
  { id: "m17", img: IMG(15), kind: "card", pos: "memory", caption: "被我强迫喂我哈哈哈，我记得你还做过猪肚鸡给我吃，好吃晕了。" },
  { id: "m18", img: IMG(20), kind: "card", pos: "memory", caption: "看看我们家的“家庭煮夫”这是在做好吃的吧，小 I 眼巴巴的看着。" },
  { id: "m19", img: IMG(19), kind: "card", pos: "memory", caption: "好治愈好温馨，咋这么幸福！！！" },
  { id: "m20", img: IMG(21), kind: "card", pos: "memory", caption: "哈哈哈我还记得我们还吓 I 要把它丢下去，好可爱好可爱！" },
  { id: "m21", img: IMG(5), kind: "card", pos: "memory", caption: "记录一下我们热吻。" },
  { id: "m22", img: IMG(2), kind: "card", pos: "memory", caption: "当时笑的我肚子痛哈哈哈哈，把我的裙子都穿了一遍，真是好搞笑，幸好都拍下来了。" },

  // 结尾
  {
    id: "ending",
    img: IMG(4),
    kind: "ending",
    pos: "large",
    caption:
      "张羽伦，恭喜你20岁啦。虽然我们现在吵得很凶，甚至还在黑名单里躺着，但这个准备了很久的网页我还是决定按时上线。这不是妥协，只是因为这是早就为你准备好的20岁礼物，我不想因为一时的赌气让这份心意白费。不管现在的局面多糟糕，今天都希望你能好好过个生日，也希望我们都能在这个过程中变成更好的人。",
  },
];

/* ------------------------------------------------------------------ */
/* 动效参数                                                             */
/* ------------------------------------------------------------------ */

const EASE = [0.4, 0, 0.2, 1] as const;

/* 页面交叉淡入淡出：背景各页几乎一致，淡入淡出时背景视觉上保持固定 */
const screenVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

/* 文字框：进场淡入、退场渐隐 */
const captionVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/* ------------------------------------------------------------------ */
/* 打字机 Hook                                                          */
/* ------------------------------------------------------------------ */

function useTypewriter(text: string, speed = 46, startDelay = 460) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCount(0);
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { typed: text.slice(0, count), done };
}

/* ------------------------------------------------------------------ */
/* 文字框：三个独立类名区分，Frame 2.svg 作背景，文字透明 flex 居中      */
/* ------------------------------------------------------------------ */

function Caption({ text, pos }: { text: string; pos: "intro" | "large" | "memory" }) {
  const { typed, done } = useTypewriter(text);

  const boxClass =
    pos === "large"
      ? "text-box-large"
      : pos === "memory"
      ? "text-box-small"
      : "text-box-center";

  // 字号用 px，靠 CSS 换行控制溢出
  const sizePx =
    pos === "large"
      ? text.length > 80
        ? 9
        : 13
      : pos === "memory"
      ? 11
      : 12;

  return (
    <motion.div
      className={boxClass}
      variants={captionVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <span className="caption-text" style={{ fontSize: `${sizePx}px` }}>
        {typed}
        {!done && <span className="caret" />}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 按钮热区（透明，覆盖在原稿按钮上）                                   */
/* ------------------------------------------------------------------ */

function HitArea({
  style,
  onClick,
  label,
}: {
  style: React.CSSProperties;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="hit-area"
      style={style}
      onClick={onClick}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 主应用                                                               */
/* ------------------------------------------------------------------ */

export default function App() {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const page = PAGES[index];
  const isCover = page.kind === "cover";
  const isEnding = page.kind === "ending";

  const go = useCallback((next: number) => setIndex(next), []);
  const enter = useCallback(() => go(1), [go]);
  const next = useCallback(() => setIndex((i) => i + 1), []);
  const prev = useCallback(() => setIndex((i) => i - 1), []);
  const home = useCallback(() => go(0), [go]);
  const end = useCallback(() => setFinished(true), []);
  const restart = useCallback(() => {
    setFinished(false);
    go(0);
  }, [go]);

  /* 按钮布局（相对卡片容器的百分比，对应设计稿坐标） */
  const btnRow = useMemo(() => ({ top: "63%", height: "10%" }), []);
  const prevBtn = useMemo(() => ({ left: "4%", width: "28%" }), []);
  const nextBtn = useMemo(() => ({ right: "4%", width: "28%" }), []);
  const coverRow = useMemo(() => ({ top: "80%", height: "10%" }), []);

  return (
    <div className="stage">
      <div className="phone">
        <AnimatePresence initial={false}>
          <motion.div
            key={page.id}
            className={`screen${page.pos === "memory" ? " screen--bottom" : ""}`}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <img className="screen-img" src={page.img} alt="" draggable={false} />

            {page.caption && (
              <Caption text={page.caption} pos={page.pos ?? "memory"} />
            )}

            {isCover && (
              <>
                <HitArea
                  label="enter"
                  style={{ ...coverRow, left: "11%", width: "24%" }}
                  onClick={enter}
                />
                <HitArea
                  label="exit"
                  style={{ ...coverRow, right: "11%", width: "24%" }}
                  onClick={end}
                />
              </>
            )}

            {page.kind === "card" && (
              <>
                <HitArea
                  label="上一页"
                  style={{ ...btnRow, ...prevBtn }}
                  onClick={prev}
                />
                <HitArea
                  label="下一页"
                  style={{ ...btnRow, ...nextBtn }}
                  onClick={next}
                />
              </>
            )}

            {isEnding && (
              <>
                <HitArea
                  label="回到首页"
                  style={{ ...btnRow, ...prevBtn }}
                  onClick={home}
                />
                <HitArea
                  label="结束"
                  style={{ ...btnRow, ...nextBtn }}
                  onClick={end}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {finished && (
          <motion.div
            className="finish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={restart}
          >
            <span>— 完 —</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .stage {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #17121a;
        }
        .phone {
          position: relative;
          height: 100vh;
          width: min(100vw, calc(100vh * 2160 / 4674));
          overflow: hidden;
          background: #fdf0f1;
        }
        .screen {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .screen--bottom {
          justify-content: flex-end;
        }
        .screen-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
        }

        .text-box-center,
        .text-box-small {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1080px;
          aspect-ratio: 135 / 44;
          background-color: transparent;
          background-image: url("${BASE}images/Frame 2.webp");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text-box-large {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1007px;
          aspect-ratio: 87 / 94;
          box-sizing: border-box;
          padding: 8%;
          background-color: transparent;
          background-image: url("${BASE}images/image11.svg");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .caption-text {
          background: transparent;
          color: #bf6a6f;
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1.75;
          text-align: center;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .caret {
          display: inline-block;
          width: 0.06em;
          height: 1em;
          margin-left: 0.08em;
          background: #bf6a6f;
          vertical-align: -0.12em;
          animation: blink 0.9s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }

        .hit-area {
          position: absolute;
          border: none;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          z-index: 6;
        }

        .finish {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #17121a;
          color: #e8b7bd;
          font-size: 22px;
          letter-spacing: 0.6em;
          text-indent: 0.6em;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
