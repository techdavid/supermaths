/*
  SuperMaths - the best way to revise mathematics
  Copyright (C) 2016  David Bailey <david.bailey@archlinux.net>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/* jshint esversion: 6 */

class SuperMaths {
  constructor(container) {
    this.topics = {};
    this.categories = {};
    this.globalVars = {};

    var supermaths = document.createElement("div");
    supermaths.className = "supermaths";

    var header = document.createElement("div");
    header.className = "header";

    var innerHeader = document.createElement("div");
    innerHeader.className = "inner-header";

    var title = document.createElement("a");
    title.className = "title";
    title.textContent = "SuperMaths";
    title.href = "#topics";

    this.page = document.createElement("div");
    this.page.className = "page";
    this.page.textContent = "Loading…";

    innerHeader.appendChild(title);
    innerHeader.appendChild(this.page);
    header.appendChild(innerHeader);
    supermaths.appendChild(header);

    this.topicList = document.createElement("div");
    this.topicList.className = "topics";
    supermaths.appendChild(this.topicList);

    this.topicQuestions = document.createElement("div");
    this.topicQuestions.className = "questions";
    supermaths.appendChild(this.topicQuestions);

    container.appendChild(supermaths);

    window.onhashchange = () => {
      if (location.hash === "#topics") {
        this.showTopics();
        return;
      }

      var topic = location.hash.match(/^#topic=(.+)/);
      if (topic && topic[1] &&
          Object.keys(this.topics).indexOf(topic[1]) !== -1) {
        this.page.textContent = "Loading…";
        window.setTimeout(() => {
          this.loadTopic(topic[1]);
        }, 0);
      } else {
        location.hash = "#topics";
      }
    };
    window.onload = window.onhashchange;
  }

  static template(obj) {
    if (obj.type === "int") {
      return () => {
        var num = math.randomInt(obj.min, obj.max + 1) * (obj.multiplier||1);
        return [num, num.toString()];
      };
    }
    if (obj.type === "list") {
      return () => {
        var values = obj.values;
        var random = Math.floor(Math.random() * values.length);
        return [values[random], values[random]];
      };
    }
    if (obj.type === "percentage") {
      return () => {
        var min = obj.min || 0;
        var max = obj.max || 1;

        var num = math.random(min, max);
        num = math.round(num, obj.dp);

        return [num, (num * 100).toString() + "%"];
      };
    }
    if (obj.type === "ratio") {
      return () => {
        var left = math.randomInt(obj.min, obj.max + 1);
        var right = obj.addto - left;
        return [
          left / (left + right),
          "\\(" + left + ":" + right + "\\)"
        ];
      };
    }
  }

  static gen(values, text) {
    for (let i in values.globalVars) {
      text = text.replace(new RegExp("%%" + i, "g"), values.globalVars[i][0]);
      text = text.replace(new RegExp("%" + i, "g"), values.globalVars[i][1]);
    }
    for (let i in values.templates) {
      text =
        text.replace(new RegExp("\\$\\$" + i, "g"), values.templates[i][0]);
      text = text.replace(new RegExp("\\$" + i, "g"), values.templates[i][1]);
    }

    var evaltostring = (exp) => math.eval(exp).toString();
    var evaltofract = (exp) => {
      let fraction = math.create({number: "Fraction"}).eval(exp);

      let top = fraction.n.toString();
      let bottom = fraction.d.toString();
      return "\\(\\frac{" + top + "}{" + bottom + "}\\)";
    };

    var expression = /\?<\((.+?)\)><{(.+?)}>/;
    var match = expression.exec(text);
    while (match) {
      let condition = math.eval(match[1]);
      if (condition) {
        text = text.replace(expression, match[2]);
      } else {
        text = text.replace(expression, "");
      }

      match = expression.exec(text);
    }

    expression = /#{(.+?)}(f?)/;
    match = expression.exec(text);
    while (match) {
      let matheval;
      if (match[2]) {
        matheval = evaltofract;
      } else {
        matheval = evaltostring;
      }

      text = text.replace(expression, matheval(match[1]).toString());
      match = expression.exec(text);
    }

    return text;
  }

  static genExp(values, explanation) {
    var generated = [];
    for (let i = 0; i < explanation.length; i += 1) {
      generated[i] = SuperMaths.gen(values, explanation[i]);
    }
    return generated;
  }

  static randomize(globalVars, templates) {
    var values = {globalVars: {}, templates: {}};
    for (let i in globalVars) {
      values.globalVars[i] = globalVars[i]();
    }
    for (let i in templates) {
      values.templates[i] = templates[i]();
    }
    return values;
  }

  boilerplate(id, obj) {
    this.globalVars[id] = SuperMaths.template(obj);
  }

  addTopic(id, name, category) {
    this.topics[id] = {
      name: name,
      category: category,
      questions: []
    };

    var topic = document.createElement("a");
    topic.className = "topic";
    topic.textContent = name;
    topic.href = `#topic=${id}`;

    if (Object.keys(this.categories).indexOf(category) === -1) {
      this.categories[category] = document.createElement("div");
      this.categories[category].className = "category";
      this.categories[category].textContent = category;
      this.topicList.appendChild(this.categories[category]);
    }

    this.categories[category].appendChild(topic);
  }

  addQuestion(id, obj) {
    var templates = {};
    for (let i in obj.boilerplate) {
      templates[i] = SuperMaths.template(obj.boilerplate[i]);
    }

    var generate = () => {
      var question = {};
      var templateValues = SuperMaths.randomize(this.globalVars, templates);
      question.header = SuperMaths.gen(templateValues, obj.header);

      var parts = [];
      for (let part of obj.parts) {
        let text = SuperMaths.gen(templateValues, part.text);
        let answers = [];
        let explanation = SuperMaths.genExp(templateValues, part.explanation);

        for (let a of part.answers) {
          if (a.type === "fraction") {
            let value = SuperMaths.gen(templateValues, a.value);
            value = math.create({number: "Fraction"}).eval(value);

            answers.push({
              label: a.label,
              value: value,
              type: "fraction"
            });
          }
          if (a.type === "int") {
            let value = SuperMaths.gen(templateValues, a.value);
            answers.push({
              label: a.label,
              value: math.eval(value),
              type: "int"
            });
          }
        }
        parts.push({text: text, answers: answers, explanation: explanation});
      }
      question.parts = parts;

      return question;
    };
    this.topics[id].questions.push(generate);
  }

  showTopics() {
    this.topicList.classList.add("show");
    this.topicQuestions.classList.remove("show");

    this.page.textContent = "Topics";
    document.title = "SuperMaths – Topics";
  }

  loadTopic(id) {
    this.topicList.classList.remove("show");
    this.topicQuestions.classList.add("show");

    this.topicQuestions.innerHTML = "";
    this.topicQuestions.setAttribute("data-id", id);

    this.page.textContent =
      this.topics[id].category + " › " + this.topics[id].name;
    document.title =
      `SuperMaths – ${this.topics[id].category} › ${this.topics[id].name}`;

    var answers = [];

    for (let i = 0; i < this.topics[id].questions.length; i += 1) {
      let question = this.topics[id].questions[i]();
      answers[i] = [];

      let q = document.createElement("div");
      q.className = "question";

      let n = document.createElement("div");
      n.className = "number";
      n.textContent = i + 1;
      q.appendChild(n);

      let h = document.createElement("p");
      h.className = "question-header";
      h.textContent = question.header;
      q.appendChild(h);

      let p = document.createElement("div");
      p.className = "parts";
      q.appendChild(p);
      for (let j = 0; j < question.parts.length; j += 1) {
        let part = question.parts[j];
        answers[i][j] = part.answers;

        let el = document.createElement("div");
        el.className = "part";

        let text = document.createElement("p");
        text.className = "text";
        text.textContent = part.text;
        el.appendChild(text);

        for (let answer of part.answers) {
          let answerbox = document.createElement("div");
          answerbox.className = "answer";

          let label = document.createElement("div");
          label.className = "label";
          label.textContent = answer.label;
          answerbox.appendChild(label);

          if (answer.type === "fraction") {
            answerbox.classList.add("fraction");

            let top = document.createElement("input");
            top.className = "top";
            top.type = "number";
            top.placeholder = "?";

            let bottom = document.createElement("input");
            bottom.className = "bottom";
            bottom.type = "number";
            bottom.placeholder = "?";

            let divider = document.createElement("div");
            divider.className = "divider";
            divider.textContent = "/";

            answerbox.appendChild(top);
            answerbox.appendChild(divider);
            answerbox.appendChild(bottom);
          } else if (answer.type === "int") {
            answerbox.classList.add("int");

            let input = document.createElement("input");
            input.type = "number";
            input.placeholder = "?";
            answerbox.appendChild(input);
          }

          el.appendChild(answerbox);
        }

        let explanation = document.createElement("div");
        explanation.className = "explanation";

        for (let exp of part.explanation) {
          let paragraph = document.createElement("p");
          paragraph.className = "explanation-paragraph";
          paragraph.textContent = exp;
          explanation.appendChild(paragraph);
        }

        el.appendChild(explanation);
        p.appendChild(el);
      }

      this.topicQuestions.appendChild(q);
    }

    var validate = document.createElement("div");
    validate.className = "validate";
    validate.textContent = "Check answers";

    validate.onclick = () => this.validate(answers);
    this.topicQuestions.appendChild(validate);

    this.score = document.createElement("div");
    this.score.className = "score";
    this.topicQuestions.appendChild(this.score);

    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  validate(answers) {
    var allDone = true;
    var score = {my: 0, max: 0};

    for (let i = 0; i < answers.length; i += 1) {
      let question = answers[i];
      let questionEl = this.topicQuestions.querySelectorAll(".question")[i];

      for (let j = 0; j < question.length; j += 1) {
        let part = question[j];
        let partEl = questionEl.querySelectorAll(".part")[j];

        for (let k = 0; k < part.length; k += 1) {
          let answer = part[k];
          let answerEl = partEl.querySelectorAll(".answer")[k];

          if (answer.type === "fraction") {
            score.max += 2;

            let fmath = math.create({number: "Fraction"});

            let top = answerEl.querySelector(".top").value;
            let bottom = answerEl.querySelector(".bottom").value;

            if (!top || !bottom) {
              answerEl.setAttribute("data-state", "empty");
              allDone = false;

              continue;
            }

            if (math.equal(fmath.eval(top + "/" + bottom), answer.value)) {
              answerEl.setAttribute("data-state", "correct");
              score.my += 2;
            } else {
              answerEl.setAttribute("data-state", "incorrect");
            }
          } else if (answer.type === "int") {
            score.max += 1;

            let givenAnswer = answerEl.querySelector("input").value;
            if (!givenAnswer) {
              answerEl.setAttribute("data-state", "empty");
              allDone = false;

              continue;
            }

            if (math.equal(answer.value, parseInt(givenAnswer))) {
              answerEl.setAttribute("data-state", "correct");
              score.my += 1;
            } else {
              answerEl.setAttribute("data-state", "incorrect");
            }
          }

          answerEl.classList.add("disabled");
          partEl.querySelector(".explanation").classList.add("show");
        }
      }
    }

    if (allDone) {
      this.topicQuestions.classList.add("all-done");
      this.score.textContent = score.my + " / " + score.max;
    }
  }
}
