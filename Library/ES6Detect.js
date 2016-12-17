/*
 * SuperMaths - the best way to revise mathematics
 * Copyright (C) 2016  David Bailey <david.bailey@archlinux.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
  try {
    // test for class, let, arrow functions, template strings
    eval("class X { constructor() { let x = () => `#{x}` } }");
  } catch (e) {
    var prompt = window.confirm(
      "Sorry – your browser doesn't support ES6, which is required by " +
      "SuperMaths. Please use another browser, such as Chrome or Firefox.\n\n" +

      "Press OK to visit the download page for Google Chrome."
    );
    if (prompt) {
      window.location.href = "https://www.google.com/chrome/";
    }
  }
})();
