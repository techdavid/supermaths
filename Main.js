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

var supermaths = new SuperMaths(document.body);

supermaths.boilerplate("SCHOOLYEAR", {
  type: "int",
  min: 7,
  max: 11
});
supermaths.boilerplate("GIRLNAME", {
  type: "list",
  values: ["Isabel", "Rosie", "Amelia", "Anna", "Lauren", "Emily", "Katie"]
});
supermaths.boilerplate("HAIRCOLOUR", {
  type: "list",
  values: ["blonde", "pink", "brown", "black", "chestnut"]
});

supermaths.addTopic("gcse-fractions", "Fractions", "GCSE");

supermaths.addQuestion("gcse-fractions", {
  boilerplate: {
    "A": {
      type: "ratio",
      min: 2,
      max: 4,
      addto: 5
    },
    "B": {
      type: "percentage",
      min: 0.1,
      max: 0.6,
      dp: 1
    },
    "C": {
      type: "int",
      min: 4,
      max: 8
    }
  },
  header:
    "In %GIRLNAME's school, #{1 / $$C}f of the pupils are in Year " +
    "%SCHOOLYEAR. The ratio of girls to boys in Year %SCHOOLYEAR is " +
    "$A, and $B of the girls in Year %SCHOOLYEAR have %HAIRCOLOUR " +
    "hair.",
  parts: [
    {
      text:
        "What fraction of the pupils in the school are girls in Year " +
        "%SCHOOLYEAR with %HAIRCOLOUR hair? [2 marks]",
      answers: [
        {
          label: "answer:",
          value: "($$A * $$B) / $$C",
          type: "fraction"
        }
      ],
      explanation: [
        "The ratio $A means that for every 5 pupils in Year %SCHOOLYEAR, " +
        "there are #{$$A * 5} girls and #{5 - ($$A * 5)} boys. Therefore, " +
        "the fraction of girls in Year %SCHOOLYEAR is #{$$A}f. To find the " +
        "number of girls in Year %SCHOOLYEAR only, multiply this by " +
        "#{1 / $$C}f:",

        "$$\\frac{1}{$$C} \\times \\frac{#{$$A*5}}{5} = " +
        "\\frac{1 \\times #{$$A*5}}{$$C \\times 5} = " +
        "\\frac{#{$$A*5}}{#{$$C*5}} ?<(gcd($$A*5,$$C*5)>1)><{= " +
        "\\frac{#{$$A*5/gcd($$A*5,$$C*5)}}{#{$$C*5/gcd($$A*5,$$C*5)}}}> $$",

        "The percentage $B is equal to the fraction #{$$B}f. Multiplying " +
        "this with #{$$A / $$C}f gives us the final answer #{($$A*$$B) / $$C}f."
      ]
    }
  ]
});

supermaths.addQuestion("gcse-fractions", {
  header:
    "Look at the following fraction sum: \\(\\frac{a}{11} + \\frac{b}{6} = " +
    "\\frac{25}{33}\\)",
  parts: [
    {
      text:
        "Work out the values of \\(a\\) and \\(b\\), given that they are " +
        "positive integers. [2 marks]",
      answers: [
        {
          label: "a =",
          value: "1",
          type: "int"
        },
        {
          label: "b =",
          value: "4",
          type: "int"
        }
      ],
      explanation: ["no"]
    }
  ]
});
