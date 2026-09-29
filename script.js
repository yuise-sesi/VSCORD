```javascript
const wall = document.getElementById("wall");
const cracks = document.getElementById("cracks");

let drawing = false;
let points = [];

let svg = null;
let path = null;

let lastLeakX = 0;
let lastLeakY = 0;


/* =================================
   SVGを作る
================================= */

function createCrackSVG() {

    const newSvg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    newSvg.classList.add("crack-svg");

    const newPath =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

    newPath.classList.add("crack-main");

    newSvg.appendChild(newPath);

    cracks.appendChild(newSvg);

    svg = newSvg;
    path = newPath;
}


/* =================================
   亀裂を更新
================================= */

function updateCrack() {

    if (!path || points.length === 0) {
        return;
    }

    let d =
        "M " +
        points[0].x +
        " " +
        points[0].y;


    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        d +=
            " L " +
            points[i].x +
            " " +
            points[i].y;
    }


    path.setAttribute(
        "d",
        d
    );
}


/* =================================
   描画開始
================================= */

function startDrawing(x, y) {

    drawing = true;

    points = [
        {
            x: x,
            y: y
        }
    ];

    createCrackSVG();

    wall.classList.add("active");

    lastLeakX = x;
    lastLeakY = y;
}


/* =================================
   カーソル移動
================================= */

function moveDrawing(x, y) {

    if (!drawing) {
        return;
    }


    const last =
        points[points.length - 1];


    const dx =
        x - last.x;

    const dy =
        y - last.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /*
     * 3px以上動いたら
     * 軌跡を追加
     */

    if (distance < 3) {
        return;
    }


    points.push({
        x: x,
        y: y
    });


    updateCrack();


    /*
     * 一定距離進むと
     * 赤いエネルギーが漏れる
     */

    const leakDX =
        x - lastLeakX;

    const leakDY =
        y - lastLeakY;

    const leakDistance =
        Math.sqrt(
            leakDX * leakDX +
            leakDY * leakDY
        );


    if (leakDistance > 40) {

        createLeak(x, y);

        lastLeakX = x;
        lastLeakY = y;
    }
}


/* =================================
   描画終了
================================= */

function stopDrawing() {

    if (!drawing) {
        return;
    }

    drawing = false;

    wall.classList.remove("active");


    /*
     * 何も動かしていなければ削除
     */

    if (points.length < 2) {

        if (svg) {
            svg.remove();
        }

        points = [];

        svg = null;
        path = null;

        return;
    }


    /*
     * 保存
     */

    saveCrack(points);


    /*
     * 赤いフラッシュ
     */

    const flash =
        document.createElement("div");

    flash.className =
        "red-flash";

    wall.appendChild(flash);


    setTimeout(
        () => flash.remove(),
        700
    );


    points = [];

    svg = null;
    path = null;
}


/* =================================
   亀裂を保存
================================= */

function saveCrack(crackPoints) {

    const old =
        JSON.parse(
            localStorage.getItem(
                "cracks"
            ) || "[]"
        );


    old.push(crackPoints);


    localStorage.setItem(
        "cracks",
        JSON.stringify(old)
    );
}


/* =================================
   保存された亀裂を読み込む
================================= */

function loadCracks() {

    const old =
        JSON.parse(
            localStorage.getItem(
                "cracks"
            ) || "[]"
        );


    old.forEach(
        crackPoints => {

            drawOldCrack(
                crackPoints
            );

        }
    );
}


/* =================================
   過去の亀裂を描画
================================= */

function drawOldCrack(points) {

    const oldSvg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    oldSvg.classList.add(
        "crack-svg"
    );


    const oldPath =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

    oldPath.classList.add(
        "crack-main",
        "crack-old"
    );


    let d =
        "M " +
        points[0].x +
        " " +
        points[0].y;


    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        d +=
            " L " +
            points[i].x +
            " " +
            points[i].y;
    }


    oldPath.setAttribute(
        "d",
        d
    );


    oldSvg.appendChild(
        oldPath
    );

    cracks.appendChild(
        oldSvg
    );
}


/* =================================
   赤いエネルギー
================================= */

function createLeak(x, y) {

    const leak =
        document.createElement("div");

    leak.className =
        "leak";

    leak.style.left =
        x + "px";

    leak.style.top =
        y + "px";

    cracks.appendChild(
        leak
    );


    /*
     * 下方向へ流れる
     */

    if (Math.random() < 0.7) {

        setTimeout(
            () => {

                createDrip(
                    x,
                    y
                );

            },
            300
        );
    }


    setTimeout(
        () => leak.remove(),
        3500
    );
}


/* =================================
   赤い流れ
================================= */

function createDrip(x, y) {

    const drip =
        document.createElement("div");

    drip.className =
        "drip";

    drip.style.left =
        x + "px";

    drip.style.top =
        y + "px";


    const height =
        20 +
        Math.random() * 80;


    drip.style.setProperty(
        "--height",
        height + "px"
    );


    cracks.appendChild(
        drip
    );


    setTimeout(
        () => drip.remove(),
        2500
    );
}


/* =================================
   ポインター操作
   マウス・タッチ共通
================================= */

wall.addEventListener("pointerdown", event => {

    event.preventDefault();

    // このポインターを最後まで追跡する
    wall.setPointerCapture(event.pointerId);

    startDrawing(
        event.clientX,
        event.clientY
    );

});


wall.addEventListener("pointermove", event => {

    event.preventDefault();

    moveDrawing(
        event.clientX,
        event.clientY
    );

});


wall.addEventListener("pointerup", event => {

    event.preventDefault();

    stopDrawing();

    if (wall.hasPointerCapture(event.pointerId)) {
        wall.releasePointerCapture(event.pointerId);
    }

});


wall.addEventListener("pointercancel", event => {

    stopDrawing();

});

/* =================================
   PWA
================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(
                    () => {
                        console.log(
                            "PWA ready"
                        );
                    }
                )
                .catch(
                    error => {
                        console.error(
                            "Service Worker error:",
                            error
                        );
                    }
                );

        }
    );
}


/* =================================
   起動時に復元
================================= */

loadCracks();
```
