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
  values: ["Isabel", "Rosie", "Amelia", "Anna", "Lauren", "Emily"]
});
supermaths.boilerplate("HAIRCOLOUR", {
  type: "list",
  values: ["blonde", "pink", "brown", "black"]
});

supermaths.addTopic("fractions", "Fractions");

supermaths.addQuestion("fractions", {
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
    }
  },
  header:
    "In %GIRLNAME's school, one fifth of the pupils are in Year " +
    "%SCHOOLYEAR. The ratio of girls to boys in Year %SCHOOLYEAR is " +
    "$A, and $B of the girls in Year %SCHOOLYEAR have %HAIRCOLOUR " +
    "hair.",
  parts: [
    {
      text:
        "What fraction of the pupils in the school are girls in Year " +
        "%SCHOOLYEAR with %HAIRCOLOUR hair?",
      answers: [
        {
          label: "answer:",
          value: "($$A * $$B) / 5",
          type: "fraction"
        }
      ],
      explanation: [
        "The ratio $A means that for every 5 pupils in Year %SCHOOLYEAR, " +
        "there are #{$$A * 5} girls and #{5 - ($$A * 5)} boys. Therefore, " +
        "the fraction of girls in Year %SCHOOLYEAR is #{$$A}f. To find the " +
        "number of girls in Year %SCHOOLYEAR only, multiply this by one " +
        "fifth:",

        "$$\\frac{1}{5} \\times \\frac{#{$$A*5}}{5} = " +
        "\\frac{1 \\times #{$$A*5}}{5 \\times 5} = \\frac{#{$$A*5}}{25} $$",

        "The percentage $B is equal to the fraction #{$$B}f. Multiplying " +
        "this with #{$$A / 5}f gives us the final answer #{($$A * $$B) / 5}f."
      ]
    }
  ]
});

supermaths.showTopics();
