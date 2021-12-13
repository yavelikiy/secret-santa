class SecretSantaMain {
  constructor(parent) {
    this.parent = parent;
    this.items = [];
    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this, (this.onCalculate = this.onCalculate.bind(this));
  }

  init() {
    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.setAttribute("autofocus", "true");
    this.input.setAttribute("id", "inputText");
    this.input.addEventListener("keypress", this.onKeyPress);

    this.addButton = document.createElement("input");
    this.addButton.setAttribute("type", "button");
    this.addButton.value = "Add";
    this.addButton.addEventListener("click", this.onAddClick);

    this.errorText = document.createElement("div");
    this.errorText.className = "error";

    const block = document.createElement("div");
    block.className = "inputs";
    block.appendChild(this.input);
    block.appendChild(this.addButton);
    block.appendChild(this.errorText);
    this.parent.appendChild(block);

    this.itemsBlock = document.createElement("div");
    this.itemsBlock.className = "items";
    this.setEmptyText();
    this.parent.appendChild(this.itemsBlock);
    this.itemsBlock.addEventListener("click", this.onDeleteClick);

    this.calculateButton = document.createElement("input");
    this.calculateButton.className = "calculate";
    this.calculateButton.value = "Show Secret Santa";
    this.calculateButton.setAttribute("type", "button");
    this.calculateButton.addEventListener("click", this.onCalculate);
    this.parent.appendChild(this.calculateButton);

    this.result = document.createElement("div");
    this.result.className = "result";
    this.parent.appendChild(this.result);
  }

  setEmptyText() {
    const text = document.createElement("div");
    text.className = "empty-text";
    text.innerText = "Add new items to proceed";
    this.itemsBlock.appendChild(text);
  }

  onAddClick() {
    const value = this.input.value.trim();
    if (this.checkItem(value)) {
      this.createItem(value);
      this.input.value = "";
      this.errorText.innerText = "";
      this.input.focus();
    }
  }

  onCalculate() {
    this.result.innerHTML = "";
    const resultItems = randomizeItems(this.items);
    resultItems.forEach(({from, to}) => {
        const item = document.createElement("div");
        item.className = "result-item";
        item.innerText = `${from} gives ${to}.`;
        this.result.appendChild(item);
    });
    this.result.scrollIntoView();
    window.print();
  }

  onKeyPress(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.addButton.click();
    }
  }

  checkItem(text) {
    if (this.items.includes(text)) {
      this.errorText.innerText = `Item '${text}' already exists.`;
      return false;
    }
    return true;
  }

  createItem(text) {
    if (this.items.length == 0) {
      const text = this.itemsBlock.querySelector(".empty-text");
      if (text) {
        text.remove();
      }
      this.calculateButton.disabled = false;
    }
    this.items.push(text);
    const count = this.items.length;
    const item = document.createElement("div");
    item.className = "item";
    const name = document.createElement("div");
    name.className = "name";
    name.innerText = text;
    const numb = document.createElement("div");
    numb.className = "number";
    numb.innerText = count;
    const deleteButton = document.createElement("input");
    deleteButton.className = "delete";
    deleteButton.setAttribute("type", "button");
    deleteButton.value = "Delete";
    item.appendChild(numb);
    item.appendChild(name);
    item.appendChild(deleteButton);
    this.itemsBlock.appendChild(item);
  }

  onDeleteClick(event) {
    this.deleteItem(event.target.parentElement);
  }

  deleteItem(item) {
    const nameText = item.querySelector(".name").innerText;
    this.items = this.items.filter((name) => name != nameText);
    item.remove();
    if (this.items.length == 0) {
      this.calculateButton.disabled = true;
      this.setEmptyText();
    } else {
      this.renumber();
    }
  }

  renumber() {
    const items = this.itemsBlock.querySelectorAll(".item");
    items.forEach((item, index) => {
      item.querySelector(".number").innerText = index + 1;
    });
  }
}

function randomizeItems(items) {
    let isValid = false;
    let itemsFrom, itemsTo;
    while (!isValid) {
      itemsFrom = JSON.parse(JSON.stringify(items));
      itemsFrom = shuffle(itemsFrom);
      itemsTo = JSON.parse(JSON.stringify(itemsFrom));
      itemsTo = shuffle(itemsTo);
      isValid = isValidRandom(itemsFrom, itemsTo);
    }
    return itemsFrom.map((text, index) => ({
      from: text,
      to: itemsTo[index],
    }));
  }

function isValidRandom(from, to) {
    for (let i = 0; i < from.length; i++) {
      if (from[i] === to[i]) return false;
    }
    return true;
  }

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

new SecretSantaMain(document.getElementById("root")).init();
