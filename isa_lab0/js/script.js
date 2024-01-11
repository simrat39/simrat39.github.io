let last_clicked_id = -1;

class GameButton {
  /**
   * Constructor
   * @param {number} id
   * @param {Element} container
   * @param {string} color
   * @param {string} width
   * @param {string} height
   * @param {GameManager} gameManager
   */
  constructor(id, container, color, width, height, gameManager) {
    this.id = id;
    this.color = color;
    this.gameManager = gameManager;

    /**
     * @type HTMLButtonElement _element
     */
    this._element = document.createElement("button");
    this._element.classList.add("game-button")
    this.showNumber();
    this._element.style.backgroundColor = color;
    this._element.style.height = height;
    this._element.style.width = width;

    this._container = container;
    this._container.appendChild(this._element);

    this.setClickable(false);

    this._element.addEventListener("click", () => {
      if (last_clicked_id == id - 1) {
        this.showNumber();
        last_clicked_id = id;

        if (id == gameManager.N - 1) {
          gameManager.finish(true);
        }
      } else {
        gameManager.finish(false);
      }
    });
  }

  /**
   * Sets the css value position of the element
   * @param {string} pos
   */
  setPosition(pos) {
    this._element.style.position = pos;
  }

  /**
   * Sets the css values top and left of the element
   * @param {number} top
   * @param {number} left
   */
  moveTo(top, left) {
    this._element.style.top = top + "px";
    this._element.style.left = left + "px";
  }

  showNumber() {
    this._element.innerText = this.id;
  }

  hideNumber() {
    this._element.innerText = "";
  }

  setClickable(status) {
    this._element.disabled = !status;
  }
}

class GameManager {
  constructor() {
    this.N = -1;
    this.container = document.getElementById("game");
    this.msg_element = document.getElementById("msg");
    /**
     * @type Array<GameButton>
     */
    this.buttons = [];

    document.getElementById("game-form").addEventListener("submit", (e) => {
      e.preventDefault();

      this.reset();
      this.start();
    });
  }

  /**
   *
   * @param {number} to
   * @returns
   */
  static getRandomInt(to) {
    return Math.floor(Math.random() * to);
  }

  // Generated with ChatGPT
  static async wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Waited for ${seconds} seconds.`);
      }, seconds * 1000); // Convert seconds to milliseconds
    });
  }

  // https://stackoverflow.com/a/25873123
  static randomHsl() {
    return `hsla(${Math.random() * 360}, 80%, 40%, 1)`;
  }

  /**
   *
   * @param {boolean} won whether we won or not
   */
  finish(won) {
    for (const btn of this.buttons) {
      btn.setClickable(false);
    }

    if (won) {
      this.msg_element.innerText = "You Won!";
    } else {
      this.msg_element.innerText = "You Lost!";
    }
  }

  reset() {
    this.container.replaceChildren();
    this.container.style.display = "flex";
    this.N = -1;
    this.msg_element.innerText = "";
    last_clicked_id = -1;
  }

  async start() {
    this.N = Number(document.getElementById("box-count").value);

    for (let i = 0; i < this.N; ++i) {
      this.buttons.push(
        new GameButton(
          i,
          this.container,
          GameManager.randomHsl(),
          "10em",
          "5em",
          this
        )
      );
    }

    await GameManager.wait(this.N);

    this.container.style.display = "block";
    for (const btn of this.buttons) {
      btn.setPosition("absolute");
    }

    const boundingRect = this.container.getBoundingClientRect();
    const eheight = boundingRect.height;
    const eWidth = boundingRect.width;

    for (let i = 0; i < this.N; ++i) {
      for (const btn of this.buttons) {
        const fsize = parseFloat(getComputedStyle(btn._element).fontSize);

        const top = GameManager.getRandomInt(eheight + fsize * 5);
        const left = GameManager.getRandomInt(eWidth - fsize * 10);

        btn.moveTo(top, left);
      }

      await GameManager.wait(2);
    }

    for (const btn of this.buttons) {
      btn.hideNumber();
      btn.setClickable(true);
    }
  }
}

const mgr = new GameManager();
