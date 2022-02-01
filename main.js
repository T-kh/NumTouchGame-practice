'use strict';

{

  class Panel {
    constructor(game) {   //Boardクラス内のPanel苦らｓのインスタンスに渡して、Gemeクラスのインスタンスを仮引数gameで受け取る
      this.game = game;   //Gameクラスのインスタンスをthis.gameで取得する。Gameクラスのインスタンスを取得したことで、そのインスタンスのプロパティを使用するころができる。
      this.el = document.createElement('li');
      this.el.classList.add('pressed');
      this.el.addEventListener('click', () => {
        this.check();
      });
    }
    
    getEl() {
      return this.el;
    }

    activate(num) {
      this.el.classList.remove('pressed');
      this.el.textContent = num;
    }

    check() {
      if(this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add('pressed');
        this.game.addCurrentNum();

        if(this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }

  }


  class Board {
    constructor(game) {  //constructorにGameクラスのインスタンスを渡すため仮引数をかく。
      this.game = game;   //仮引数をthis.gameで取得
     this.panels = [];
     for(let i = 0; i < this.game.getLevel() ** 2; i++) {
       this.panels.push(new Panel(this.game));   //this.game（Gameクラスのインスタンス）をPanelクラス丹羽津・
     }

     this.setup();
    }

    setup() {
      const board = document.getElementById('board');
      this.panels.forEach(panel => {
        board.appendChild(panel.getEl());
      });
    }

    activate() {
      const nums = [];
      for(let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }

      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
        panel.activate(num);
      });
    }
  }


  class Game {
    constructor(level) {
      this.level = level;
      this.board = new Board(this);   //thisはそのクラスのインスタンスを指す。ここでのthisはnew Game()を指す。new Game()をBoardクラスに渡す。

      this.currentNum = undefined;  //ボタンを押すたびに0にされるので、変数の宣言だけでよい。
      this.startTime = undefined;
      this.timeoutId = undefined;
    
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {    
        this.start();
      });

      this.setup();   //ページを出したときからcontainerを呼び出したいのconstructorにメソッドをかく
    }

    setup() {
      const container = document.getElementById('container');
      const PANEL_WIDTH = 50;
      const BOARD_PADDING = 10;
        /* 50px * 2 + 10px * 2 */
        container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
      }

    start() {
      if(typeof this.timeoutId !== 'undefined') {    //変数timeoutIdに何かしらの値が返っている時  返り値のない変数を調べるとundefinedが返る。typeofはその後に指定した変数の型を「文字列」で返すので、'undefined'と書いた。
        clearTimeout(this.timeoutId);                //cliearTimeout(timeoutId)にすることで、複数回押したら起こる不具合を直せる
      }
  
      this.currentNum = 0;  //ボタンを押すたびにcurrentNumを0にする。そうするとその都度リセットされるので、0から押せるようになる
      this.board.activate();
      
      this.startTime = Date.now();
      this.runTimer();

    }

    runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);
  
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }
  
    //Pabelクラスで、Gameクラスのインスタンスをthis.gameで取得できたが、Panelクラスで外部のクラスGameクラスのプロパティを使うのはよろしくないので、メソッドでアクセスできるようにする

    addCurrentNum() {  
      this.currentNum++;  //returnを入れない理由は、返り値を必要としないから
    }

    getCurrentNum() {    //返り値があるので、returnする
      return this.currentNum;
    }

    getTimeoutId() {     //返り値があるので、returnする
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }
  }

  new Game(5); //引数に数字を渡し、Gameクラス内のthis.level = levelで取得するとsetup()でcontainerの幅を動的に変える

}