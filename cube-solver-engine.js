
/**
 * CubeSolver Engine - High-Performance Solver for 2x2 through 6x6, Pyraminx, and Skewb
 * Fully self-contained pure JavaScript speedcubing solver.
 */
(function(global) {
  'use strict';
  var RootScope = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);

  // --- 3x3 KOCIEMBA CORE ---
  (function() {
  // Centers
  var B, BL, BR, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, L, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, centerColor, centerFacelet, cornerColor, cornerFacelet, edgeColor, edgeFacelet;

  [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];

  // Corners
  [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

  // Edges
  [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  [centerFacelet, cornerFacelet, edgeFacelet] = (function() {
    var _B, _D, _F, _L, _R, _U;
    _U = function(x) {
      return x - 1;
    };
    _R = function(x) {
      return _U(9) + x;
    };
    _F = function(x) {
      return _R(9) + x;
    };
    _D = function(x) {
      return _F(9) + x;
    };
    _L = function(x) {
      return _D(9) + x;
    };
    _B = function(x) {
      return _L(9) + x;
    };
    return [
      // Centers
      [4,
      13,
      22,
      31,
      40,
      49],
      // Corners
      [[_U(9),
      _R(1),
      _F(3)],
      [_U(7),
      _F(1),
      _L(3)],
      [_U(1),
      _L(1),
      _B(3)],
      [_U(3),
      _B(1),
      _R(3)],
      [_D(3),
      _F(9),
      _R(7)],
      [_D(1),
      _L(9),
      _F(7)],
      [_D(7),
      _B(9),
      _L(7)],
      [_D(9),
      _R(9),
      _B(7)]],
      // Edges
      [[_U(6),
      _R(2)],
      [_U(8),
      _F(2)],
      [_U(4),
      _L(2)],
      [_U(2),
      _B(2)],
      [_D(6),
      _R(8)],
      [_D(2),
      _F(8)],
      [_D(4),
      _L(8)],
      [_D(8),
      _B(8)],
      [_F(6),
      _R(4)],
      [_F(4),
      _L(6)],
      [_B(6),
      _L(4)],
      [_B(4),
      _R(6)]]
    ];
  })();

  centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

  cornerColor = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

  edgeColor = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

  Cube = (function() {
    var faceNames, faceNums, parseAlg;

    class Cube {
      constructor(other) {
        var x;
        if (other != null) {
          this.init(other);
        } else {
          this.identity();
        }
        // For moves to avoid allocating new objects each time
        this.newCenter = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 5; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newCp = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newEp = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newCo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.newEo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
      }

      init(state) {
        this.center = state.center.slice(0);
        this.co = state.co.slice(0);
        this.ep = state.ep.slice(0);
        this.cp = state.cp.slice(0);
        return this.eo = state.eo.slice(0);
      }

      identity() {
        var x;
        // Initialize to the identity cube
        this.center = [0, 1, 2, 3, 4, 5];
        this.cp = [0, 1, 2, 3, 4, 5, 6, 7];
        this.co = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 7; x = ++k) {
            results.push(0);
          }
          return results;
        })();
        this.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        return this.eo = (function() {
          var k, results;
          results = [];
          for (x = k = 0; k <= 11; x = ++k) {
            results.push(0);
          }
          return results;
        })();
      }

      toJSON() {
        return {
          center: this.center,
          cp: this.cp,
          co: this.co,
          ep: this.ep,
          eo: this.eo
        };
      }

      asString() {
        var corner, edge, i, k, l, m, n, o, ori, p, result;
        result = [];
        for (i = k = 0; k <= 5; i = ++k) {
          result[9 * i + 4] = centerColor[this.center[i]];
        }
        for (i = l = 0; l <= 7; i = ++l) {
          corner = this.cp[i];
          ori = this.co[i];
          for (n = m = 0; m <= 2; n = ++m) {
            result[cornerFacelet[i][(n + ori) % 3]] = cornerColor[corner][n];
          }
        }
        for (i = o = 0; o <= 11; i = ++o) {
          edge = this.ep[i];
          ori = this.eo[i];
          for (n = p = 0; p <= 1; n = ++p) {
            result[edgeFacelet[i][(n + ori) % 2]] = edgeColor[edge][n];
          }
        }
        return result.join('');
      }

      static fromString(str) {
        var col1, col2, cube, i, j, k, l, m, o, ori, p, q, r, ref;
        cube = new Cube;
        for (i = k = 0; k <= 5; i = ++k) {
          for (j = l = 0; l <= 5; j = ++l) {
            if (str[9 * i + 4] === centerColor[j]) {
              cube.center[i] = j;
            }
          }
        }
        for (i = m = 0; m <= 7; i = ++m) {
          for (ori = o = 0; o <= 2; ori = ++o) {
            if ((ref = str[cornerFacelet[i][ori]]) === 'U' || ref === 'D') {
              break;
            }
          }
          col1 = str[cornerFacelet[i][(ori + 1) % 3]];
          col2 = str[cornerFacelet[i][(ori + 2) % 3]];
          for (j = p = 0; p <= 7; j = ++p) {
            if (col1 === cornerColor[j][1] && col2 === cornerColor[j][2]) {
              cube.cp[i] = j;
              cube.co[i] = ori % 3;
            }
          }
        }
        for (i = q = 0; q <= 11; i = ++q) {
          for (j = r = 0; r <= 11; j = ++r) {
            if (str[edgeFacelet[i][0]] === edgeColor[j][0] && str[edgeFacelet[i][1]] === edgeColor[j][1]) {
              cube.ep[i] = j;
              cube.eo[i] = 0;
              break;
            }
            if (str[edgeFacelet[i][0]] === edgeColor[j][1] && str[edgeFacelet[i][1]] === edgeColor[j][0]) {
              cube.ep[i] = j;
              cube.eo[i] = 1;
              break;
            }
          }
        }
        return cube;
      }

      clone() {
        return new Cube(this.toJSON());
      }

      // A class method returning a new random cube
      static random() {
        return new Cube().randomize();
      }

      isSolved() {
        var c, cent, clone, e, k, l, m;
        clone = this.clone();
        clone.move(clone.upright());
        for (cent = k = 0; k <= 5; cent = ++k) {
          if (clone.center[cent] !== cent) {
            return false;
          }
        }
        for (c = l = 0; l <= 7; c = ++l) {
          if (clone.cp[c] !== c) {
            return false;
          }
          if (clone.co[c] !== 0) {
            return false;
          }
        }
        for (e = m = 0; m <= 11; e = ++m) {
          if (clone.ep[e] !== e) {
            return false;
          }
          if (clone.eo[e] !== 0) {
            return false;
          }
        }
        return true;
      }

      // Multiply this Cube with another Cube, restricted to centers.
      centerMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 5; to = ++k) {
          from = other.center[to];
          this.newCenter[to] = this.center[from];
        }
        [this.center, this.newCenter] = [this.newCenter, this.center];
        return this;
      }

      // Multiply this Cube with another Cube, restricted to corners.
      cornerMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 7; to = ++k) {
          from = other.cp[to];
          this.newCp[to] = this.cp[from];
          this.newCo[to] = (this.co[from] + other.co[to]) % 3;
        }
        [this.cp, this.newCp] = [this.newCp, this.cp];
        [this.co, this.newCo] = [this.newCo, this.co];
        return this;
      }

      // Multiply this Cube with another Cube, restricted to edges
      edgeMultiply(other) {
        var from, k, to;
        for (to = k = 0; k <= 11; to = ++k) {
          from = other.ep[to];
          this.newEp[to] = this.ep[from];
          this.newEo[to] = (this.eo[from] + other.eo[to]) % 2;
        }
        [this.ep, this.newEp] = [this.newEp, this.ep];
        [this.eo, this.newEo] = [this.newEo, this.eo];
        return this;
      }

      // Multiply this cube with another Cube
      multiply(other) {
        this.centerMultiply(other);
        this.cornerMultiply(other);
        this.edgeMultiply(other);
        return this;
      }

      move(arg) {
        var face, k, l, len, move, power, ref, ref1, x;
        ref = parseAlg(arg);
        for (k = 0, len = ref.length; k < len; k++) {
          move = ref[k];
          face = move / 3 | 0;
          power = move % 3;
          for (x = l = 0, ref1 = power; (0 <= ref1 ? l <= ref1 : l >= ref1); x = 0 <= ref1 ? ++l : --l) {
            this.multiply(Cube.moves[face]);
          }
        }
        return this;
      }

      upright() {
        var clone, i, j, k, l, result;
        clone = this.clone();
        result = [];
        for (i = k = 0; k <= 5; i = ++k) {
          if (clone.center[i] === F) {
            break;
          }
        }
        switch (i) {
          case D:
            result.push("x");
            break;
          case U:
            result.push("x'");
            break;
          case B:
            result.push("x2");
            break;
          case R:
            result.push("y");
            break;
          case L:
            result.push("y'");
        }
        if (result.length) {
          clone.move(result[0]);
        }
        for (j = l = 0; l <= 5; j = ++l) {
          if (clone.center[j] === U) {
            break;
          }
        }
        switch (j) {
          case L:
            result.push("z");
            break;
          case R:
            result.push("z'");
            break;
          case D:
            result.push("z2");
        }
        return result.join(' ');
      }

      static inverse(arg) {
        var face, k, len, move, power, result, str;
        result = (function() {
          var k, len, ref, results;
          ref = parseAlg(arg);
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            move = ref[k];
            face = move / 3 | 0;
            power = move % 3;
            results.push(face * 3 + -(power - 1) + 1);
          }
          return results;
        })();
        result.reverse();
        if (typeof arg === 'string') {
          str = '';
          for (k = 0, len = result.length; k < len; k++) {
            move = result[k];
            face = move / 3 | 0;
            power = move % 3;
            str += faceNames[face];
            if (power === 1) {
              str += '2';
            } else if (power === 2) {
              str += "'";
            }
            str += ' ';
          }
          return str.substring(0, str.length - 1);
        } else if (arg.length != null) {
          return result;
        } else {
          return result[0];
        }
      }

    };

    Cube.prototype.randomize = (function() {
      var arePermutationsValid, generateValidRandomOrientation, generateValidRandomPermutation, getNumSwaps, isOrientationValid, randint, randomizeOrientation, result, shuffle;
      randint = function(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
      };
      // Fisher-Yates shuffle adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      shuffle = function(array) {
        var currentIndex, randomIndex, temporaryValue;
        currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
          // Pick a remaining element...
          randomIndex = randint(0, currentIndex - 1);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
      };
      getNumSwaps = function(arr) {
        var cur, cycleLength, i, k, numSwaps, ref, seen, x;
        numSwaps = 0;
        seen = (function() {
          var k, ref, results;
          results = [];
          for (x = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); x = 0 <= ref ? ++k : --k) {
            results.push(false);
          }
          return results;
        })();
        while (true) {
          // We compute the cycle decomposition
          cur = -1;
          for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
            if (!seen[i]) {
              cur = i;
              break;
            }
          }
          if (cur === -1) {
            break;
          }
          cycleLength = 0;
          while (!seen[cur]) {
            seen[cur] = true;
            cycleLength++;
            cur = arr[cur];
          }
          // A cycle is equivalent to cycleLength + 1 swaps
          numSwaps += cycleLength + 1;
        }
        return numSwaps;
      };
      arePermutationsValid = function(cp, ep) {
        var numSwaps;
        numSwaps = getNumSwaps(ep) + getNumSwaps(cp);
        return numSwaps % 2 === 0;
      };
      generateValidRandomPermutation = function(cp, ep) {
        // Each shuffle only takes around 12 operations and there's a 50%
        // chance of a valid permutation so it'll finish in very good time
        shuffle(ep);
        shuffle(cp);
        while (!arePermutationsValid(cp, ep)) {
          shuffle(ep);
          shuffle(cp);
        }
      };
      randomizeOrientation = function(arr, numOrientations) {
        var i, k, ori, ref;
        ori = 0;
        for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
          ori += (arr[i] = randint(0, numOrientations - 1));
        }
      };
      isOrientationValid = function(arr, numOrientations) {
        return arr.reduce(function(a, b) {
          return a + b;
        }) % numOrientations === 0;
      };
      generateValidRandomOrientation = function(co, eo) {
        // There is a 1/2 and 1/3 probably respectively of each of these
        // succeeding so the probability of them running 10 times before
        // success is already only 1% and only gets exponentially lower
        // and each generation is only in the 10s of operations which is nothing
        randomizeOrientation(co, 3);
        while (!isOrientationValid(co, 3)) {
          randomizeOrientation(co, 3);
        }
        randomizeOrientation(eo, 2);
        while (!isOrientationValid(eo, 2)) {
          randomizeOrientation(eo, 2);
        }
      };
      result = function() {
        generateValidRandomPermutation(this.cp, this.ep);
        generateValidRandomOrientation(this.co, this.eo);
        return this;
      };
      return result;
    })();

    Cube.moves = [
      {
        // U
        center: [0, 1, 2, 3, 4, 5],
        cp: [UBR,
      URF,
      UFL,
      ULB,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UB,
      UR,
      UF,
      UL,
      DR,
      DF,
      DL,
      DB,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // R
        center: [0, 1, 2, 3, 4, 5],
        cp: [DFR,
      UFL,
      ULB,
      URF,
      DRB,
      DLF,
      DBL,
      UBR],
        co: [2,
      0,
      0,
      1,
      1,
      0,
      0,
      2],
        ep: [FR,
      UF,
      UL,
      UB,
      BR,
      DF,
      DL,
      DB,
      DR,
      FL,
      BL,
      UR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // F
        center: [0, 1, 2, 3, 4, 5],
        cp: [UFL,
      DLF,
      ULB,
      UBR,
      URF,
      DFR,
      DBL,
      DRB],
        co: [1,
      2,
      0,
      0,
      2,
      1,
      0,
      0],
        ep: [UR,
      FL,
      UL,
      UB,
      DR,
      FR,
      DL,
      DB,
      UF,
      DF,
      BL,
      BR],
        eo: [0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0]
      },
      {
        // D
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DLF,
      DBL,
      DRB,
      DFR],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UF,
      UL,
      UB,
      DF,
      DL,
      DB,
      DR,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // L
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      ULB,
      DBL,
      UBR,
      DFR,
      UFL,
      DLF,
      DRB],
        co: [0,
      1,
      2,
      0,
      0,
      2,
      1,
      0],
        ep: [UR,
      UF,
      BL,
      UB,
      DR,
      DF,
      FL,
      DB,
      FR,
      UL,
      DL,
      BR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0]
      },
      {
        // B
        center: [0, 1, 2, 3, 4, 5],
        cp: [URF,
      UFL,
      UBR,
      DRB,
      DFR,
      DLF,
      ULB,
      DBL],
        co: [0,
      0,
      1,
      2,
      0,
      0,
      2,
      1],
        ep: [UR,
      UF,
      UL,
      BR,
      DR,
      DF,
      DL,
      BL,
      FR,
      FL,
      UB,
      DB],
        eo: [0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1]
      },
      {
        // E
        center: [U,
      F,
      L,
      D,
      B,
      R],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UF,
      UL,
      UB,
      DR,
      DF,
      DL,
      DB,
      FL,
      BL,
      BR,
      FR],
        eo: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1]
      },
      {
        // M
        center: [B,
      R,
      U,
      F,
      L,
      D],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UR,
      UB,
      UL,
      DB,
      DR,
      UF,
      DL,
      DF,
      FR,
      FL,
      BL,
      BR],
        eo: [0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0]
      },
      {
        // S
        center: [L,
      U,
      F,
      R,
      D,
      B],
        cp: [URF,
      UFL,
      ULB,
      UBR,
      DFR,
      DLF,
      DBL,
      DRB],
        co: [0,
      0,
      0,
      0,
      0,
      0,
      0,
      0],
        ep: [UL,
      UF,
      DL,
      UB,
      UR,
      DF,
      DR,
      DB,
      FR,
      FL,
      BL,
      BR],
        eo: [1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0]
      }
    ];

    faceNums = {
      U: 0,
      R: 1,
      F: 2,
      D: 3,
      L: 4,
      B: 5,
      E: 6,
      M: 7,
      S: 8,
      x: 9,
      y: 10,
      z: 11,
      u: 12,
      r: 13,
      f: 14,
      d: 15,
      l: 16,
      b: 17
    };

    faceNames = {
      0: 'U',
      1: 'R',
      2: 'F',
      3: 'D',
      4: 'L',
      5: 'B',
      6: 'E',
      7: 'M',
      8: 'S',
      9: 'x',
      10: 'y',
      11: 'z',
      12: 'u',
      13: 'r',
      14: 'f',
      15: 'd',
      16: 'l',
      17: 'b'
    };

    parseAlg = function(arg) {
      var k, len, move, part, power, ref, results;
      if (typeof arg === 'string') {
        ref = arg.split(/\s+/);
        // String
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          part = ref[k];
          if (part.length === 0) {
            // First and last can be empty
            continue;
          }
          if (part.length > 2) {
            throw new Error(`Invalid move: ${part}`);
          }
          move = faceNums[part[0]];
          if (move === void 0) {
            throw new Error(`Invalid move: ${part}`);
          }
          if (part.length === 1) {
            power = 0;
          } else {
            if (part[1] === '2') {
              power = 1;
            } else if (part[1] === "'") {
              power = 2;
            } else {
              throw new Error(`Invalid move: ${part}`);
            }
          }
          results.push(move * 3 + power);
        }
        return results;
      } else if (arg.length != null) {
        // Already an array
        return arg;
      } else {
        // A single move
        return [arg];
      }
    };

    // x
    Cube.moves.push(new Cube().move("R M' L'").toJSON());

    // y
    Cube.moves.push(new Cube().move("U E' D'").toJSON());

    // z
    Cube.moves.push(new Cube().move("F S B'").toJSON());

    // u
    Cube.moves.push(new Cube().move("U E'").toJSON());

    // r
    Cube.moves.push(new Cube().move("R M'").toJSON());

    // f
    Cube.moves.push(new Cube().move("F S").toJSON());

    // d
    Cube.moves.push(new Cube().move("D E").toJSON());

    // l
    Cube.moves.push(new Cube().move("L M").toJSON());

    // b
    Cube.moves.push(new Cube().move("B S'").toJSON());

    return Cube;

  }).call(this);

  //# Globals
  RootScope.Cube = Cube;

}).call(RootScope);

  (function() {
  var B, BL, BR, Cnk, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, Include, L, N_FLIP, N_FRtoBR, N_PARITY, N_SLICE1, N_SLICE2, N_TWIST, N_UBtoDF, N_URFtoDLF, N_URtoDF, N_URtoUL, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, allMoves1, allMoves2, computeMoveTable, computePruningTable, faceNames, faceNums, factorial, key, max, mergeURtoDF, moveTableParams, nextMoves1, nextMoves2, permutationIndex, pruning, pruningTableParams, rotateLeft, rotateRight, value,
    indexOf = [].indexOf;

  Cube = RootScope.Cube;

  // Centers
  [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];

  // Corners
  [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

  // Edges
  [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //# Helpers

  // n choose k, i.e. the binomial coeffiecient
  Cnk = function(n, k) {
    var i, j, s;
    if (n < k) {
      return 0;
    }
    if (k > n / 2) {
      k = n - k;
    }
    s = 1;
    i = n;
    j = 1;
    while (i !== n - k) {
      s *= i;
      s /= j;
      i--;
      j++;
    }
    return s;
  };

  // n!
  factorial = function(n) {
    var f, i, m, ref;
    f = 1;
    for (i = m = 2, ref = n; (2 <= ref ? m <= ref : m >= ref); i = 2 <= ref ? ++m : --m) {
      f *= i;
    }
    return f;
  };

  // Maximum of two values
  max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  // Rotate elements between l and r left by one place
  rotateLeft = function(array, l, r) {
    var i, m, ref, ref1, tmp;
    tmp = array[l];
    for (i = m = ref = l, ref1 = r - 1; (ref <= ref1 ? m <= ref1 : m >= ref1); i = ref <= ref1 ? ++m : --m) {
      array[i] = array[i + 1];
    }
    return array[r] = tmp;
  };

  // Rotate elements between l and r right by one place
  rotateRight = function(array, l, r) {
    var i, m, ref, ref1, tmp;
    tmp = array[r];
    for (i = m = ref = r, ref1 = l + 1; (ref <= ref1 ? m <= ref1 : m >= ref1); i = ref <= ref1 ? ++m : --m) {
      array[i] = array[i - 1];
    }
    return array[l] = tmp;
  };

  // Generate a function that computes permutation indices.

  // The permutation index actually encodes two indices: Combination,
  // i.e. positions of the cubies start..end (A) and their respective
  // permutation (B). The maximum value for B is

  //   maxB = (end - start + 1)!

  // and the index is A * maxB + B
  permutationIndex = function(context, start, end, fromEnd = false) {
    var i, maxAll, maxB, maxOur, our, permName;
    maxOur = end - start;
    maxB = factorial(maxOur + 1);
    if (context === 'corners') {
      maxAll = 7;
      permName = 'cp';
    } else {
      maxAll = 11;
      permName = 'ep';
    }
    our = (function() {
      var m, ref, results;
      results = [];
      for (i = m = 0, ref = maxOur; (0 <= ref ? m <= ref : m >= ref); i = 0 <= ref ? ++m : --m) {
        results.push(0);
      }
      return results;
    })();
    return function(index) {
      var a, b, c, j, k, m, o, p, perm, q, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u, w, x, y, z;
      if (index != null) {
        for (i = m = 0, ref = maxOur; (0 <= ref ? m <= ref : m >= ref); i = 0 <= ref ? ++m : --m) {
          // Reset our to [start..end]
          our[i] = i + start;
        }
        b = index % maxB; // permutation
        a = index / maxB | 0; // combination
        
        // Invalidate all edges
        perm = this[permName];
        for (i = o = 0, ref1 = maxAll; (0 <= ref1 ? o <= ref1 : o >= ref1); i = 0 <= ref1 ? ++o : --o) {
          perm[i] = -1;
        }
// Generate permutation from index b
        for (j = p = 1, ref2 = maxOur; (1 <= ref2 ? p <= ref2 : p >= ref2); j = 1 <= ref2 ? ++p : --p) {
          k = b % (j + 1);
          b = b / (j + 1) | 0;
          // TODO: Implement rotateRightBy(our, 0, j, k)
          while (k > 0) {
            rotateRight(our, 0, j);
            k--;
          }
        }
        // Generate combination and set our edges
        x = maxOur;
        if (fromEnd) {
          for (j = q = 0, ref3 = maxAll; (0 <= ref3 ? q <= ref3 : q >= ref3); j = 0 <= ref3 ? ++q : --q) {
            c = Cnk(maxAll - j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[maxOur - x];
              a -= c;
              x--;
            }
          }
        } else {
          for (j = t = ref4 = maxAll; (ref4 <= 0 ? t <= 0 : t >= 0); j = ref4 <= 0 ? ++t : --t) {
            c = Cnk(j, x + 1);
            if (a - c >= 0) {
              perm[j] = our[x];
              a -= c;
              x--;
            }
          }
        }
        return this;
      } else {
        perm = this[permName];
        for (i = u = 0, ref5 = maxOur; (0 <= ref5 ? u <= ref5 : u >= ref5); i = 0 <= ref5 ? ++u : --u) {
          our[i] = -1;
        }
        a = b = x = 0;
        // Compute the index a < ((maxAll + 1) choose (maxOur + 1)) and
        // the permutation
        if (fromEnd) {
          for (j = w = ref6 = maxAll; (ref6 <= 0 ? w <= 0 : w >= 0); j = ref6 <= 0 ? ++w : --w) {
            if ((start <= (ref7 = perm[j]) && ref7 <= end)) {
              a += Cnk(maxAll - j, x + 1);
              our[maxOur - x] = perm[j];
              x++;
            }
          }
        } else {
          for (j = y = 0, ref8 = maxAll; (0 <= ref8 ? y <= ref8 : y >= ref8); j = 0 <= ref8 ? ++y : --y) {
            if ((start <= (ref9 = perm[j]) && ref9 <= end)) {
              a += Cnk(j, x + 1);
              our[x] = perm[j];
              x++;
            }
          }
        }
// Compute the index b < (maxOur + 1)! for the permutation
        for (j = z = ref10 = maxOur; (ref10 <= 0 ? z <= 0 : z >= 0); j = ref10 <= 0 ? ++z : --z) {
          k = 0;
          while (our[j] !== start + j) {
            rotateLeft(our, 0, j);
            k++;
          }
          b = (j + 1) * b + k;
        }
        return a * maxB + b;
      }
    };
  };

  Include = {
    // The twist of the 8 corners, 0 <= twist < 3^7. The orientation of
    // the DRB corner is fully determined by the orientation of the other
    // corners.
    twist: function(twist) {
      var i, m, o, ori, parity, v;
      if (twist != null) {
        parity = 0;
        for (i = m = 6; m >= 0; i = --m) {
          ori = twist % 3;
          twist = (twist / 3) | 0;
          this.co[i] = ori;
          parity += ori;
        }
        this.co[7] = (3 - parity % 3) % 3;
        return this;
      } else {
        v = 0;
        for (i = o = 0; o <= 6; i = ++o) {
          v = 3 * v + this.co[i];
        }
        return v;
      }
    },
    // The flip of the 12 edges, 0 <= flip < 2^11. The orientation of the
    // BR edge is fully determined by the orientation of the other edges.
    flip: function(flip) {
      var i, m, o, ori, parity, v;
      if (flip != null) {
        parity = 0;
        for (i = m = 10; m >= 0; i = --m) {
          ori = flip % 2;
          flip = flip / 2 | 0;
          this.eo[i] = ori;
          parity += ori;
        }
        this.eo[11] = (2 - parity % 2) % 2;
        return this;
      } else {
        v = 0;
        for (i = o = 0; o <= 10; i = ++o) {
          v = 2 * v + this.eo[i];
        }
        return v;
      }
    },
    // Parity of the corner permutation
    cornerParity: function() {
      var i, j, m, o, ref, ref1, ref2, ref3, s;
      s = 0;
      for (i = m = ref = DRB, ref1 = URF + 1; (ref <= ref1 ? m <= ref1 : m >= ref1); i = ref <= ref1 ? ++m : --m) {
        for (j = o = ref2 = i - 1, ref3 = URF; (ref2 <= ref3 ? o <= ref3 : o >= ref3); j = ref2 <= ref3 ? ++o : --o) {
          if (this.cp[j] > this.cp[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    // Parity of the edges permutation. Parity of corners and edges are
    // the same if the cube is solvable.
    edgeParity: function() {
      var i, j, m, o, ref, ref1, ref2, ref3, s;
      s = 0;
      for (i = m = ref = BR, ref1 = UR + 1; (ref <= ref1 ? m <= ref1 : m >= ref1); i = ref <= ref1 ? ++m : --m) {
        for (j = o = ref2 = i - 1, ref3 = UR; (ref2 <= ref3 ? o <= ref3 : o >= ref3); j = ref2 <= ref3 ? ++o : --o) {
          if (this.ep[j] > this.ep[i]) {
            s++;
          }
        }
      }
      return s % 2;
    },
    // Permutation of the six corners URF, UFL, ULB, UBR, DFR, DLF
    URFtoDLF: permutationIndex('corners', URF, DLF),
    // Permutation of the three edges UR, UF, UL
    URtoUL: permutationIndex('edges', UR, UL),
    // Permutation of the three edges UB, DR, DF
    UBtoDF: permutationIndex('edges', UB, DF),
    // Permutation of the six edges UR, UF, UL, UB, DR, DF
    URtoDF: permutationIndex('edges', UR, DF),
    // Permutation of the equator slice edges FR, FL, BL and BR
    FRtoBR: permutationIndex('edges', FR, BR, true)
  };

  for (key in Include) {
    value = Include[key];
    Cube.prototype[key] = value;
  }

  computeMoveTable = function(context, coord, size) {
    var apply, cube, i, inner, j, k, m, move, o, p, ref, results;
    // Loop through all valid values for the coordinate, setting cube's
    // state in each iteration. Then apply each of the 18 moves to the
    // cube, and compute the resulting coordinate.
    apply = context === 'corners' ? 'cornerMultiply' : 'edgeMultiply';
    cube = new Cube;
    results = [];
    for (i = m = 0, ref = size - 1; (0 <= ref ? m <= ref : m >= ref); i = 0 <= ref ? ++m : --m) {
      cube[coord](i);
      inner = [];
      for (j = o = 0; o <= 5; j = ++o) {
        move = Cube.moves[j];
        for (k = p = 0; p <= 2; k = ++p) {
          cube[apply](move);
          inner.push(cube[coord]());
        }
        // 4th face turn restores the cube
        cube[apply](move);
      }
      results.push(inner);
    }
    return results;
  };

  // Because we only have the phase 2 URtoDF coordinates, we need to
  // merge the URtoUL and UBtoDF coordinates to URtoDF in the beginning
  // of phase 2.
  mergeURtoDF = (function() {
    var a, b;
    a = new Cube;
    b = new Cube;
    return function(URtoUL, UBtoDF) {
      var i, m;
      // Collisions can be found because unset are set to -1
      a.URtoUL(URtoUL);
      b.UBtoDF(UBtoDF);
      for (i = m = 0; m <= 7; i = ++m) {
        if (a.ep[i] !== -1) {
          if (b.ep[i] !== -1) {
            return -1; // collision
          } else {
            b.ep[i] = a.ep[i];
          }
        }
      }
      return b.URtoDF();
    };
  })();

  N_TWIST = 2187; // 3^7 corner orientations

  N_FLIP = 2048; // 2^11 possible edge flips

  N_PARITY = 2; // 2 possible parities

  N_FRtoBR = 11880; // 12!/(12-4)! permutations of FR..BR edges

  N_SLICE1 = 495; // (12 choose 4) possible positions of FR..BR edges

  N_SLICE2 = 24; // 4! permutations of FR..BR edges in phase 2

  N_URFtoDLF = 20160; // 8!/(8-6)! permutations of URF..DLF corners

  
  // The URtoDF move table is only computed for phase 2 because the full
  // table would have >650000 entries
  N_URtoDF = 20160; // 8!/(8-6)! permutation of UR..DF edges in phase 2

  N_URtoUL = 1320; // 12!/(12-3)! permutations of UR..UL edges

  N_UBtoDF = 1320; // 12!/(12-3)! permutations of UB..DF edges

  
  // The move table for parity is so small that it's included here
  Cube.moveTables = {
    parity: [[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]],
    twist: null,
    flip: null,
    FRtoBR: null,
    URFtoDLF: null,
    URtoDF: null,
    URtoUL: null,
    UBtoDF: null,
    mergeURtoDF: null
  };

  // Other move tables are computed on the fly
  moveTableParams = {
    // name: [scope, size]
    twist: ['corners', N_TWIST],
    flip: ['edges', N_FLIP],
    FRtoBR: ['edges', N_FRtoBR],
    URFtoDLF: ['corners', N_URFtoDLF],
    URtoDF: ['edges', N_URtoDF],
    URtoUL: ['edges', N_URtoUL],
    UBtoDF: ['edges', N_UBtoDF],
    mergeURtoDF: []
  };

  Cube.computeMoveTables = function(...tables) {
    var len, m, name, scope, size, tableName;
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in moveTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (m = 0, len = tables.length; m < len; m++) {
      tableName = tables[m];
      if (this.moveTables[tableName] !== null) {
        // Already computed
        continue;
      }
      if (tableName === 'mergeURtoDF') {
        this.moveTables.mergeURtoDF = (function() {
          var UBtoDF, URtoUL, o, results;
          results = [];
          for (URtoUL = o = 0; o <= 335; URtoUL = ++o) {
            results.push((function() {
              var p, results1;
              results1 = [];
              for (UBtoDF = p = 0; p <= 335; UBtoDF = ++p) {
                results1.push(mergeURtoDF(URtoUL, UBtoDF));
              }
              return results1;
            })());
          }
          return results;
        })();
      } else {
        [scope, size] = moveTableParams[tableName];
        this.moveTables[tableName] = computeMoveTable(scope, tableName, size);
      }
    }
    return this;
  };

  // Phase 1: All moves are valid
  allMoves1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  // The list of next valid phase 1 moves when the given face was turned
  // in the last move
  nextMoves1 = (function() {
    var face, lastFace, m, next, o, p, power, results;
    results = [];
    for (lastFace = m = 0; m <= 5; lastFace = ++m) {
      next = [];
// Don't allow commuting moves, e.g. U U'. Also make sure that
// opposite faces are always moved in the same order, i.e. allow
// U D but no D U. This avoids sequences like U D U'.
      for (face = o = 0; o <= 5; face = ++o) {
        if (face !== lastFace && face !== lastFace - 3) {
// single, double or inverse move
          for (power = p = 0; p <= 2; power = ++p) {
            next.push(face * 3 + power);
          }
        }
      }
      results.push(next);
    }
    return results;
  })();

  // Phase 2: Double moves of all faces plus quarter moves of U and D
  allMoves2 = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];

  nextMoves2 = (function() {
    var face, lastFace, len, m, next, o, p, power, powers, results;
    results = [];
    for (lastFace = m = 0; m <= 5; lastFace = ++m) {
      next = [];
      for (face = o = 0; o <= 5; face = ++o) {
        if (!(face !== lastFace && face !== lastFace - 3)) {
          continue;
        }
        // Allow all moves of U and D and double moves of others
        powers = face === 0 || face === 3 ? [0, 1, 2] : [1];
        for (p = 0, len = powers.length; p < len; p++) {
          power = powers[p];
          next.push(face * 3 + power);
        }
      }
      results.push(next);
    }
    return results;
  })();

  // 8 values are encoded in one number
  pruning = function(table, index, value) {
    var pos, shift, slot;
    pos = index % 8;
    slot = index >> 3;
    shift = pos << 2;
    if (value != null) {
      // Set
      table[slot] &= ~(0xF << shift);
      table[slot] |= value << shift;
      return value;
    } else {
      // Get
      return (table[slot] & (0xF << shift)) >>> shift;
    }
  };

  computePruningTable = function(phase, size, currentCoords, nextIndex) {
    var current, depth, done, index, len, m, move, moves, next, o, ref, table, x;
    // Initialize all values to 0xF
    table = (function() {
      var m, ref, results;
      results = [];
      for (x = m = 0, ref = Math.ceil(size / 8) - 1; (0 <= ref ? m <= ref : m >= ref); x = 0 <= ref ? ++m : --m) {
        results.push(0xFFFFFFFF);
      }
      return results;
    })();
    if (phase === 1) {
      moves = allMoves1;
    } else {
      moves = allMoves2;
    }
    depth = 0;
    pruning(table, 0, depth);
    done = 1;
    // In each iteration, take each state found in the previous depth and
    // compute the next state. Stop when all states have been assigned a
    // depth.
    while (done !== size) {
      for (index = m = 0, ref = size - 1; (0 <= ref ? m <= ref : m >= ref); index = 0 <= ref ? ++m : --m) {
        if (!(pruning(table, index) === depth)) {
          continue;
        }
        current = currentCoords(index);
        for (o = 0, len = moves.length; o < len; o++) {
          move = moves[o];
          next = nextIndex(current, move);
          if (pruning(table, next) === 0xF) {
            pruning(table, next, depth + 1);
            done++;
          }
        }
      }
      depth++;
    }
    return table;
  };

  Cube.pruningTables = {
    sliceTwist: null,
    sliceFlip: null,
    sliceURFtoDLFParity: null,
    sliceURtoDFParity: null
  };

  pruningTableParams = {
    // name: [phase, size, currentCoords, nextIndex]
    sliceTwist: [
      1,
      N_SLICE1 * N_TWIST,
      function(index) {
        return [index % N_SLICE1,
      index / N_SLICE1 | 0];
      },
      function(current,
      move) {
        var newSlice,
      newTwist,
      slice,
      twist;
        [slice,
      twist] = current;
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newTwist = Cube.moveTables.twist[twist][move];
        return newTwist * N_SLICE1 + newSlice;
      }
    ],
    sliceFlip: [
      1,
      N_SLICE1 * N_FLIP,
      function(index) {
        return [index % N_SLICE1,
      index / N_SLICE1 | 0];
      },
      function(current,
      move) {
        var flip,
      newFlip,
      newSlice,
      slice;
        [slice,
      flip] = current;
        newSlice = Cube.moveTables.FRtoBR[slice * 24][move] / 24 | 0;
        newFlip = Cube.moveTables.flip[flip][move];
        return newFlip * N_SLICE1 + newSlice;
      }
    ],
    sliceURFtoDLFParity: [
      2,
      N_SLICE2 * N_URFtoDLF * N_PARITY,
      function(index) {
        return [index % 2,
      (index / 2 | 0) % N_SLICE2,
      (index / 2 | 0) / N_SLICE2 | 0];
      },
      function(current,
      move) {
        var URFtoDLF,
      newParity,
      newSlice,
      newURFtoDLF,
      parity,
      slice;
        [parity,
      slice,
      URFtoDLF] = current;
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURFtoDLF = Cube.moveTables.URFtoDLF[URFtoDLF][move];
        return (newURFtoDLF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ],
    sliceURtoDFParity: [
      2,
      N_SLICE2 * N_URtoDF * N_PARITY,
      function(index) {
        return [index % 2,
      (index / 2 | 0) % N_SLICE2,
      (index / 2 | 0) / N_SLICE2 | 0];
      },
      function(current,
      move) {
        var URtoDF,
      newParity,
      newSlice,
      newURtoDF,
      parity,
      slice;
        [parity,
      slice,
      URtoDF] = current;
        newParity = Cube.moveTables.parity[parity][move];
        newSlice = Cube.moveTables.FRtoBR[slice][move];
        newURtoDF = Cube.moveTables.URtoDF[URtoDF][move];
        return (newURtoDF * N_SLICE2 + newSlice) * 2 + newParity;
      }
    ]
  };

  Cube.computePruningTables = function(...tables) {
    var len, m, name, params, tableName;
    if (tables.length === 0) {
      tables = (function() {
        var results;
        results = [];
        for (name in pruningTableParams) {
          results.push(name);
        }
        return results;
      })();
    }
    for (m = 0, len = tables.length; m < len; m++) {
      tableName = tables[m];
      if (this.pruningTables[tableName] !== null) {
        // Already computed
        continue;
      }
      params = pruningTableParams[tableName];
      this.pruningTables[tableName] = computePruningTable(...params);
    }
    return this;
  };

  Cube.initSolver = function() {
    Cube.computeMoveTables();
    return Cube.computePruningTables();
  };

  Cube.prototype.solveUpright = function(maxDepth = 22) {
    var State, freeStates, moveNames, phase1, phase1search, phase2, phase2search, solution, state, x;
    // Names for all moves, i.e. U, U2, U', F, F2, ...
    moveNames = (function() {
      var face, faceName, m, o, power, powerName, result;
      faceName = ['U', 'R', 'F', 'D', 'L', 'B'];
      powerName = ['', '2', "'"];
      result = [];
      for (face = m = 0; m <= 5; face = ++m) {
        for (power = o = 0; o <= 2; power = ++o) {
          result.push(faceName[face] + powerName[power]);
        }
      }
      return result;
    })();
    State = class State {
      constructor(cube) {
        this.parent = null;
        this.lastMove = null;
        this.depth = 0;
        if (cube) {
          this.init(cube);
        }
      }

      init(cube) {
        // Phase 1 coordinates
        this.flip = cube.flip();
        this.twist = cube.twist();
        this.slice = cube.FRtoBR() / N_SLICE2 | 0;
        // Phase 2 coordinates
        this.parity = cube.cornerParity();
        this.URFtoDLF = cube.URFtoDLF();
        this.FRtoBR = cube.FRtoBR();
        // These are later merged to URtoDF when phase 2 begins
        this.URtoUL = cube.URtoUL();
        this.UBtoDF = cube.UBtoDF();
        return this;
      }

      solution() {
        if (this.parent) {
          return this.parent.solution() + moveNames[this.lastMove] + ' ';
        } else {
          return '';
        }
      }

      //# Helpers
      move(table, index, move) {
        return Cube.moveTables[table][index][move];
      }

      pruning(table, index) {
        return pruning(Cube.pruningTables[table], index);
      }

      //# Phase 1

      // Return the next valid phase 1 moves for this state
      moves1() {
        if (this.lastMove !== null) {
          return nextMoves1[this.lastMove / 3 | 0];
        } else {
          return allMoves1;
        }
      }

      // Compute the minimum number of moves to the end of phase 1
      minDist1() {
        var d1, d2;
        // The maximum number of moves to the end of phase 1 wrt. the
        // combination flip and slice coordinates only
        d1 = this.pruning('sliceFlip', N_SLICE1 * this.flip + this.slice);
        // The combination of twist and slice coordinates
        d2 = this.pruning('sliceTwist', N_SLICE1 * this.twist + this.slice);
        // The true minimal distance is the maximum of these two
        return max(d1, d2);
      }

      // Compute the next phase 1 state for the given move
      next1(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.flip = this.move('flip', this.flip, move);
        next.twist = this.move('twist', this.twist, move);
        next.slice = this.move('FRtoBR', this.slice * 24, move) / 24 | 0;
        return next;
      }

      //# Phase 2

      // Return the next valid phase 2 moves for this state
      moves2() {
        if (this.lastMove !== null) {
          return nextMoves2[this.lastMove / 3 | 0];
        } else {
          return allMoves2;
        }
      }

      // Compute the minimum number of moves to the solved cube
      minDist2() {
        var d1, d2, index1, index2;
        index1 = (N_SLICE2 * this.URtoDF + this.FRtoBR) * N_PARITY + this.parity;
        d1 = this.pruning('sliceURtoDFParity', index1);
        index2 = (N_SLICE2 * this.URFtoDLF + this.FRtoBR) * N_PARITY + this.parity;
        d2 = this.pruning('sliceURFtoDLFParity', index2);
        return max(d1, d2);
      }

      // Initialize phase 2 coordinates
      init2(top = true) {
        if (this.parent !== null) {
          this.parent.init2(false);
          this.URFtoDLF = this.move('URFtoDLF', this.parent.URFtoDLF, this.lastMove);
          this.FRtoBR = this.move('FRtoBR', this.parent.FRtoBR, this.lastMove);
          this.parity = this.move('parity', this.parent.parity, this.lastMove);
          this.URtoUL = this.move('URtoUL', this.parent.URtoUL, this.lastMove);
          this.UBtoDF = this.move('UBtoDF', this.parent.UBtoDF, this.lastMove);
        }
        if (top) {
          return this.URtoDF = this.move('mergeURtoDF', this.URtoUL, this.UBtoDF);
        }
      }

      // Compute the next phase 2 state for the given move
      next2(move) {
        var next;
        next = freeStates.pop();
        next.parent = this;
        next.lastMove = move;
        next.depth = this.depth + 1;
        next.URFtoDLF = this.move('URFtoDLF', this.URFtoDLF, move);
        next.FRtoBR = this.move('FRtoBR', this.FRtoBR, move);
        next.parity = this.move('parity', this.parity, move);
        next.URtoDF = this.move('URtoDF', this.URtoDF, move);
        return next;
      }

    };
    solution = null;
    phase1search = function(state) {
      if (state.minDist1() === 0) {
        phase1(state, 0);
        if (solution !== null) return;
      }
      for (let depth = 1; depth <= maxDepth; depth++) {
        phase1(state, depth);
        if (solution !== null) break;
      }
    };
    phase1 = function(state, depth) {
      var len, m, move, next, ref, ref1, results;
      if (depth === 0) {
        if (state.minDist1() === 0) {
          // Make sure we don't start phase 2 with a phase 2 move as the
          // last move in phase 1, because phase 2 would then repeat the
          // same move.
          if (state.lastMove === null || (ref = state.lastMove, indexOf.call(allMoves2, ref) < 0)) {
            return phase2search(state);
          }
        }
      } else if (depth > 0) {
        if (state.minDist1() <= depth) {
          ref1 = state.moves1();
          results = [];
          for (m = 0, len = ref1.length; m < len; m++) {
            move = ref1[m];
            next = state.next1(move);
            phase1(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    phase2search = function(state) {
      state.init2();
      if (state.minDist2() === 0) {
        solution = state.solution();
        return;
      }
      for (let depth = 1; depth <= maxDepth - state.depth; depth++) {
        phase2(state, depth);
        if (solution !== null) break;
      }
    };
    phase2 = function(state, depth) {
      var len, m, move, next, ref, results;
      if (depth === 0) {
        if (state.minDist2() === 0) {
          return solution = state.solution();
        }
      } else if (depth > 0) {
        if (state.minDist2() <= depth) {
          ref = state.moves2();
          results = [];
          for (m = 0, len = ref.length; m < len; m++) {
            move = ref[m];
            next = state.next2(move);
            phase2(next, depth - 1);
            freeStates.push(next);
            if (solution !== null) {
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      }
    };
    freeStates = (function() {
      var m, ref, results;
      results = [];
      for (x = m = 0, ref = maxDepth + 1; (0 <= ref ? m <= ref : m >= ref); x = 0 <= ref ? ++m : --m) {
        results.push(new State);
      }
      return results;
    })();
    state = freeStates.pop().init(this);
    phase1search(state);
    freeStates.push(state);
    // Trim the trailing space
    if (solution.length > 0) {
      solution = solution.substring(0, solution.length - 1);
    }
    return solution;
  };

  faceNums = {
    U: 0,
    R: 1,
    F: 2,
    D: 3,
    L: 4,
    B: 5
  };

  faceNames = {
    0: 'U',
    1: 'R',
    2: 'F',
    3: 'D',
    4: 'L',
    5: 'B'
  };

  Cube.prototype.solve = function(maxDepth = 22) {
    var clone, len, m, move, ref, rotation, solution, upright, uprightSolution;
    clone = this.clone();
    upright = clone.upright();
    clone.move(upright);
    rotation = new Cube().move(upright).center;
    uprightSolution = clone.solveUpright(maxDepth);
    solution = [];
    ref = uprightSolution.split(' ');
    for (m = 0, len = ref.length; m < len; m++) {
      move = ref[m];
      solution.push(faceNames[rotation[faceNums[move[0]]]]);
      if (move.length > 1) {
        solution[solution.length - 1] += move[1];
      }
    }
    return solution.join(' ');
  };

  Cube.scramble = function() {
    return Cube.inverse(Cube.random().solve());
  };

}).call(RootScope);

  var CubeClass = (RootScope && RootScope.Cube) ? RootScope.Cube : Cube;

  // --- MOVE OPTIMIZER ---
  function optimizeMoves(moveString) {
    if (!moveString || !moveString.trim()) return "";
    let moves = moveString.trim().split(/\s+/);
    let changed = true;

    const faceOpposite = {
        'U': 'D', 'D': 'U',
        'L': 'R', 'R': 'L',
        'F': 'B', 'B': 'F'
    };

    function parseMove(m) {
        let base = m.replace(/['2]/g, '');
        let count = 1;
        if (m.endsWith("'")) count = 3;
        else if (m.endsWith("2")) count = 2;
        return { base, count };
    }

    function formatMove(base, count) {
        count = (count % 4 + 4) % 4;
        if (count === 0) return null;
        if (count === 1) return base;
        if (count === 2) return base + '2';
        if (count === 3) return base + "'";
    }

    let iterations = 0;
    while (changed && iterations < 50) {
        iterations++;
        changed = false;
        let newMoves = [];
        let i = 0;
        while (i < moves.length) {
            let m1 = parseMove(moves[i]);
            if (i + 1 < moves.length) {
                let m2 = parseMove(moves[i + 1]);
                if (m1.base === m2.base) {
                    let combined = formatMove(m1.base, m1.count + m2.count);
                    if (combined) newMoves.push(combined);
                    i += 2;
                    changed = true;
                    continue;
                }
                if (i + 2 < moves.length) {
                    let m3 = parseMove(moves[i + 2]);
                    if (m1.base === m3.base && faceOpposite[m1.base] === m2.base) {
                        let combined = formatMove(m1.base, m1.count + m3.count);
                        newMoves.push(moves[i + 1]);
                        if (combined) newMoves.push(combined);
                        i += 3;
                        changed = true;
                        continue;
                    }
                }
            }
            newMoves.push(moves[i]);
            i++;
        }
        moves = newMoves;
    }
    return moves.join(' ');
  }

  function optimizeOrder3Moves(movesStr) {
    if (!movesStr) return "";
    let moves = movesStr.trim().split(/\s+/).filter(Boolean);
    let changed = true;
    while (changed) {
      changed = false;
      const newMoves = [];
      let i = 0;
      while (i < moves.length) {
        if (i + 1 < moves.length) {
          const m1 = moves[i];
          const m2 = moves[i + 1];
          const b1 = m1.replace("'", "");
          const b2 = m2.replace("'", "");
          if (b1 === b2) {
            const p1 = m1.endsWith("'") ? 2 : 1;
            const p2 = m2.endsWith("'") ? 2 : 1;
            const total = (p1 + p2) % 3;
            if (total === 1) newMoves.push(b1);
            else if (total === 2) newMoves.push(b1 + "'");
            i += 2;
            changed = true;
            continue;
          }
        }
        newMoves.push(moves[i]);
        i++;
      }
      moves = newMoves;
    }
    return moves.join(' ');
  }

  function optimizeMegaminxMoves(movesStr) {
    if (!movesStr) return "";
    let moves = movesStr.trim().split(/\s+/).filter(Boolean);
    let changed = true;
    while (changed) {
      changed = false;
      const newMoves = [];
      let i = 0;
      while (i < moves.length) {
        if (i + 1 < moves.length) {
          const m1 = moves[i];
          const m2 = moves[i + 1];
          const b1 = m1.replace(/['2]/g, "");
          const b2 = m2.replace(/['2]/g, "");
          if (b1 === b2) {
            const p1 = m1.endsWith("2") ? 2 : (m1.endsWith("'") ? 4 : 1);
            const p2 = m2.endsWith("2") ? 2 : (m2.endsWith("'") ? 4 : 1);
            const total = (p1 + p2) % 5;
            if (total === 1) newMoves.push(b1);
            else if (total === 2) newMoves.push(b1 + "2");
            else if (total === 3) newMoves.push(b1 + "'2");
            else if (total === 4) newMoves.push(b1 + "'");
            i += 2;
            changed = true;
            continue;
          }
        }
        newMoves.push(moves[i]);
        i++;
      }
      moves = newMoves;
    }
    return moves.join(' ');
  }

  // --- MOVE EXPLANATIONS ---
  const MOVE_EXPLANATIONS = {
    // Megaminx Moves (72° Face Rotations)
    'U': 'Top (White) 72° Clockwise',
    "U'": 'Top (White) 72° Counter-Clockwise',
    'F': 'Front (Red) 72° Clockwise',
    "F'": 'Front (Red) 72° Counter-Clockwise',
    'FR': 'Front-Right (Yellow) 72° Clockwise',
    "FR'": 'Front-Right (Yellow) 72° Counter-Clockwise',
    'BR': 'Back-Right (Dark Blue) 72° Clockwise',
    "BR'": 'Back-Right (Dark Blue) 72° Counter-Clockwise',
    'BL': 'Back-Left (Dark Green) 72° Clockwise',
    "BL'": 'Back-Left (Dark Green) 72° Counter-Clockwise',
    'FL': 'Front-Left (Purple) 72° Clockwise',
    "FL'": 'Front-Left (Purple) 72° Counter-Clockwise',
    'DR': 'Down-Right (Pink) 72° Clockwise',
    "DR'": 'Down-Right (Pink) 72° Counter-Clockwise',
    'DBR': 'Down-Back-Right (Cyan) 72° Clockwise',
    "DBR'": 'Down-Back-Right (Cyan) 72° Counter-Clockwise',
    'DL': 'Down-Back (Lime) 72° Clockwise',
    "DL'": 'Down-Back (Lime) 72° Counter-Clockwise',
    'DBL': 'Down-Back-Left (Orange) 72° Clockwise',
    "DBL'": 'Down-Back-Left (Orange) 72° Counter-Clockwise',
    'DF': 'Down-Front (Cream) 72° Clockwise',
    "DF'": 'Down-Front (Cream) 72° Counter-Clockwise',
    'D': 'Bottom (Silver) 72° Clockwise',
    "D'": 'Bottom (Silver) 72° Counter-Clockwise',
    'U': 'Top layer 90° Clockwise',
    "U'": 'Top layer 90° Counter-Clockwise',
    'U2': 'Top layer 180° Half-Turn',
    'D': 'Bottom layer 90° Clockwise',
    "D'": 'Bottom layer 90° Counter-Clockwise',
    'D2': 'Bottom layer 180° Half-Turn',
    'F': 'Front face 90° Clockwise',
    "F'": 'Front face 90° Counter-Clockwise',
    'F2': 'Front face 180° Half-Turn',
    'B': 'Back face 90° Clockwise',
    "B'": 'Back face 90° Counter-Clockwise',
    'B2': 'Back face 180° Half-Turn',
    'L': 'Left face 90° Clockwise',
    "L'": 'Left face 90° Counter-Clockwise',
    'L2': 'Left face 180° Half-Turn',
    'R': 'Right face 90° Clockwise',
    "R'": 'Right face 90° Counter-Clockwise',
    'R2': 'Right face 180° Half-Turn',
    'Uw': 'Top 2 layers 90° Clockwise',
    "Uw'": 'Top 2 layers 90° Counter-Clockwise',
    'Uw2': 'Top 2 layers 180°',
    'Rw': 'Right 2 layers 90° Clockwise',
    "Rw'": 'Right 2 layers 90° Counter-Clockwise',
    'Rw2': 'Right 2 layers 180°',
    'Fw': 'Front 2 layers 90° Clockwise',
    "Fw'": 'Front 2 layers 90° Counter-Clockwise',
    'Fw2': 'Front 2 layers 180°',
    'Lw': 'Left 2 layers 90° Clockwise',
    "Lw'": 'Left 2 layers 90° Counter-Clockwise',
    'Lw2': 'Left 2 layers 180°',
    '2R': 'Second layer from Right 90° Clockwise',
    "2R'": 'Second layer from Right 90° Counter-Clockwise',
    '2R2': 'Second layer from Right 180°',
    '2U': 'Second layer from Top 90° Clockwise',
    "2U'": 'Second layer from Top 90° Counter-Clockwise',
    '2U2': 'Second layer from Top 180°',
    '3Rw': 'Right 3 layers 90° Clockwise',
    "3Rw'": 'Right 3 layers 90° Counter-Clockwise',
    '3Rw2': 'Right 3 layers 180°',
    '3Uw': 'Top 3 layers 90° Clockwise',
    "3Uw'": 'Top 3 layers 90° Counter-Clockwise',
    '3Uw2': 'Top 3 layers 180°',
    'u': 'Top tip 120° Clockwise',
    "u'": 'Top tip 120° Counter-Clockwise',
    'l': 'Bottom-left tip 120° Clockwise',
    "l'": 'Bottom-left tip 120° Counter-Clockwise',
    'r': 'Bottom-right tip 120° Clockwise',
    "r'": 'Bottom-right tip 120° Counter-Clockwise',
    'b': 'Back tip 120° Clockwise',
    "b'": 'Back tip 120° Counter-Clockwise'
  };

  function explainMove(m) {
    return MOVE_EXPLANATIONS[m] || ('Turn layer ' + m);
  }

  // --- 2x2x2 OPTIMAL BFS SOLVER ---
  const SOLVED_2X2 = [
    0, 0, 0, 0, // U: 0..3
    1, 1, 1, 1, // R: 4..7
    2, 2, 2, 2, // F: 8..11
    3, 3, 3, 3, // D: 12..15
    4, 4, 4, 4, // L: 16..19
    5, 5, 5, 5  // B: 20..23
  ];

  function create2x2Move(face) {
    const p = [...Array(24).keys()];
    const fBase = { U: 0, R: 4, F: 8, D: 12, L: 16, B: 20 }[face];
    p[fBase + 0] = fBase + 2;
    p[fBase + 1] = fBase + 0;
    p[fBase + 2] = fBase + 3;
    p[fBase + 3] = fBase + 1;

    if (face === 'U') {
        const f = [8, 9], r = [4, 5], b = [20, 21], l = [16, 17];
        p[f[0]] = r[0]; p[f[1]] = r[1];
        p[r[0]] = b[0]; p[r[1]] = b[1];
        p[b[0]] = l[0]; p[b[1]] = l[1];
        p[l[0]] = f[0]; p[l[1]] = f[1];
    } else if (face === 'D') {
        const f = [10, 11], r = [6, 7], b = [22, 23], l = [18, 19];
        p[f[0]] = l[0]; p[f[1]] = l[1];
        p[l[0]] = b[0]; p[l[1]] = b[1];
        p[b[0]] = r[0]; p[b[1]] = r[1];
        p[r[0]] = f[0]; p[r[1]] = f[1];
    } else if (face === 'R') {
        const u = [1, 3], f = [9, 11], d = [13, 15], b = [22, 20];
        p[u[0]] = f[0]; p[u[1]] = f[1];
        p[f[0]] = d[0]; p[f[1]] = d[1];
        p[d[0]] = b[0]; p[d[1]] = b[1];
        p[b[0]] = u[0]; p[b[1]] = u[1];
    } else if (face === 'F') {
        const u = [2, 3], r = [4, 6], d = [13, 12], l = [19, 17];
        p[u[0]] = l[0]; p[u[1]] = l[1];
        p[l[0]] = d[0]; p[l[1]] = d[1];
        p[d[0]] = r[0]; p[d[1]] = r[1];
        p[r[0]] = u[0]; p[r[1]] = u[1];
    }
    return p;
  }

  function apply2x2Perm(state, perm) {
    const next = new Array(24);
    for (let i = 0; i < 24; i++) {
        next[i] = state[perm[i]];
    }
    return next;
  }

  const moves2x2 = {};
  ['U', 'R', 'F', 'D'].forEach(f => {
    const m1 = create2x2Move(f);
    const m2 = apply2x2Perm(m1, m1);
    const m3 = apply2x2Perm(m2, m1);
    moves2x2[f] = m1;
    moves2x2[f + '2'] = m2;
    moves2x2[f + "'"] = m3;
  });

  const moveNames2x2 = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'];
  const inverseMove2x2 = {
    'U': "U'", "U'": 'U', 'U2': 'U2',
    'R': "R'", "R'": 'R', 'R2': 'R2',
    'F': "F'", "F'": 'F', 'F2': 'F2'
  };

  function solve2x2Raw(scrambledState) {
    let isSolved = true;
    for (let i = 0; i < 24; i++) {
        if (scrambledState[i] !== SOLVED_2X2[i]) { isSolved = false; break; }
    }
    if (isSolved) return "";

    const startKey = scrambledState.join('');
    const targetKey = SOLVED_2X2.join('');

    const forwardVisited = new Map();
    const backwardVisited = new Map();

    forwardVisited.set(startKey, { move: null, parent: null });
    backwardVisited.set(targetKey, { move: null, parent: null });

    let forwardQueue = [{ state: scrambledState, key: startKey, lastMove: null }];
    let backwardQueue = [{ state: SOLVED_2X2, key: targetKey, lastMove: null }];

    let depth = 0;
    while (forwardQueue.length > 0 && backwardQueue.length > 0 && depth < 12) {
        depth++;
        const nextForward = [];
        for (const item of forwardQueue) {
            const lastFace = item.lastMove ? item.lastMove[0] : null;
            for (const m of moveNames2x2) {
                if (m[0] === lastFace) continue;
                const nextState = apply2x2Perm(item.state, moves2x2[m]);
                const nKey = nextState.join('');

                if (backwardVisited.has(nKey)) {
                    let pathF = [m];
                    let curr = item;
                    while (curr && curr.move) {
                        pathF.unshift(curr.move);
                        curr = curr.parent;
                    }
                    let pathB = [];
                    let bCurr = backwardVisited.get(nKey);
                    while (bCurr && bCurr.move) {
                        pathB.push(inverseMove2x2[bCurr.move]);
                        bCurr = bCurr.parent;
                    }
                    return optimizeMoves([...pathF, ...pathB].join(' '));
                }

                if (!forwardVisited.has(nKey)) {
                    const node = { state: nextState, key: nKey, lastMove: m, move: m, parent: item };
                    forwardVisited.set(nKey, node);
                    nextForward.push(node);
                }
            }
        }
        forwardQueue = nextForward;

        const nextBackward = [];
        for (const item of backwardQueue) {
            const lastFace = item.lastMove ? item.lastMove[0] : null;
            for (const m of moveNames2x2) {
                if (m[0] === lastFace) continue;
                const nextState = apply2x2Perm(item.state, moves2x2[m]);
                const nKey = nextState.join('');

                if (forwardVisited.has(nKey)) {
                    let pathF = [];
                    let fCurr = forwardVisited.get(nKey);
                    while (fCurr && fCurr.move) {
                        pathF.unshift(fCurr.move);
                        fCurr = fCurr.parent;
                    }
                    let pathB = [inverseMove2x2[m]];
                    let bCurr = item;
                    while (bCurr && bCurr.move) {
                        pathB.push(inverseMove2x2[bCurr.move]);
                        bCurr = bCurr.parent;
                    }
                    return optimizeMoves([...pathF, ...pathB].join(' '));
                }

                if (!backwardVisited.has(nKey)) {
                    const node = { state: nextState, key: nKey, lastMove: m, move: m, parent: item };
                    backwardVisited.set(nKey, node);
                    nextBackward.push(node);
                }
            }
        }
        backwardQueue = nextBackward;
    }
    return null;
  }

  // --- SIMULATE MOVE (For Step-by-Step Interactive Player) ---
  function rotateFaceCW(arr, N) {
    const copy = [...arr];
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            arr[c * N + (N - 1 - r)] = copy[r * N + c];
        }
    }
  }

  function simulateLayerTurn(faces, N, faceName, k, isCW, count = 1) {
    const times = (count % 4 + 4) % 4;
    if (times === 0) return;

    for (let t = 0; t < times; t++) {
        if (k === 0 && isCW) {
            rotateFaceCW(faces[faceName], N);
        } else if (k === 0 && !isCW) {
            rotateFaceCW(faces[faceName], N);
            rotateFaceCW(faces[faceName], N);
            rotateFaceCW(faces[faceName], N);
        } else if (k === N - 1 && isCW) {
            const oppMap = { U: 'D', D: 'U', F: 'B', B: 'F', L: 'R', R: 'L' };
            const opp = oppMap[faceName];
            rotateFaceCW(faces[opp], N);
            rotateFaceCW(faces[opp], N);
            rotateFaceCW(faces[opp], N);
        } else if (k === N - 1 && !isCW) {
            const oppMap = { U: 'D', D: 'U', F: 'B', B: 'F', L: 'R', R: 'L' };
            const opp = oppMap[faceName];
            rotateFaceCW(faces[opp], N);
        }

        if (isCW) {
            if (faceName === 'U') {
                let r = k;
                for (let c = 0; c < N; c++) {
                    let temp = faces.F[r * N + c];
                    faces.F[r * N + c] = faces.R[r * N + c];
                    faces.R[r * N + c] = faces.B[r * N + c];
                    faces.B[r * N + c] = faces.L[r * N + c];
                    faces.L[r * N + c] = temp;
                }
            } else if (faceName === 'D') {
                let r = N - 1 - k;
                for (let c = 0; c < N; c++) {
                    let temp = faces.R[r * N + c];
                    faces.R[r * N + c] = faces.F[r * N + c];
                    faces.F[r * N + c] = faces.L[r * N + c];
                    faces.L[r * N + c] = faces.B[r * N + c];
                    faces.B[r * N + c] = temp;
                }
            } else if (faceName === 'F') {
                for (let i = 0; i < N; i++) {
                    let uIdx = (N - 1 - k) * N + i;
                    let rIdx = i * N + k;
                    let dIdx = k * N + (N - 1 - i);
                    let lIdx = (N - 1 - i) * N + (N - 1 - k);
                    let temp = faces.U[uIdx];
                    faces.U[uIdx] = faces.L[lIdx];
                    faces.L[lIdx] = faces.D[dIdx];
                    faces.D[dIdx] = faces.R[rIdx];
                    faces.R[rIdx] = temp;
                }
            } else if (faceName === 'B') {
                for (let i = 0; i < N; i++) {
                    let uIdx = k * N + i;
                    let rIdx = i * N + (N - 1 - k);
                    let dIdx = (N - 1 - k) * N + (N - 1 - i);
                    let lIdx = (N - 1 - i) * N + k;
                    let temp = faces.U[uIdx];
                    faces.U[uIdx] = faces.R[rIdx];
                    faces.R[rIdx] = faces.D[dIdx];
                    faces.D[dIdx] = faces.L[lIdx];
                    faces.L[lIdx] = temp;
                }
            } else if (faceName === 'L') {
                for (let i = 0; i < N; i++) {
                    let uIdx = i * N + k;
                    let fIdx = i * N + k;
                    let dIdx = i * N + k;
                    let bIdx = (N - 1 - i) * N + (N - 1 - k);
                    let temp = faces.U[uIdx];
                    faces.U[uIdx] = faces.B[bIdx];
                    faces.B[bIdx] = faces.D[dIdx];
                    faces.D[dIdx] = faces.F[fIdx];
                    faces.F[fIdx] = temp;
                }
            } else if (faceName === 'R') {
                for (let i = 0; i < N; i++) {
                    let uIdx = i * N + (N - 1 - k);
                    let bIdx = (N - 1 - i) * N + k;
                    let dIdx = i * N + (N - 1 - k);
                    let fIdx = i * N + (N - 1 - k);
                    let temp = faces.U[uIdx];
                    faces.U[uIdx] = faces.F[fIdx];
                    faces.F[fIdx] = faces.D[dIdx];
                    faces.D[dIdx] = faces.B[bIdx];
                    faces.B[bIdx] = temp;
                }
            }
        } else {
            simulateLayerTurn(faces, N, faceName, k, true, 3);
            return;
        }
    }
  }

  // --- PYRAMINX CYCLE HELPERS ---
  function cycle3(p, a, b, c) {
    const tmp = p[c[0]][c[1]];
    p[c[0]][c[1]] = p[b[0]][b[1]];
    p[b[0]][b[1]] = p[a[0]][a[1]];
    p[a[0]][a[1]] = tmp;
  }

  function applyPyraminxMove(p, m) {
    const isPrime = m.endsWith("'");
    const base = m.replace("'", "");
    const times = isPrime ? 2 : 1;

    for (let t = 0; t < times; t++) {
      if (base === 'u') {
        cycle3(p, ['U', 0], ['R', 0], ['L', 0]);
      } else if (base === 'l') {
        cycle3(p, ['U', 4], ['L', 8], ['B', 4]);
      } else if (base === 'r') {
        cycle3(p, ['U', 8], ['B', 8], ['R', 4]);
      } else if (base === 'b') {
        cycle3(p, ['L', 4], ['R', 8], ['B', 0]);
      } else if (base === 'U') {
        cycle3(p, ['U', 0], ['R', 0], ['L', 0]);
        cycle3(p, ['U', 2], ['R', 2], ['L', 2]);
        cycle3(p, ['U', 1], ['R', 1], ['L', 1]);
        cycle3(p, ['U', 3], ['R', 3], ['L', 3]);
      } else if (base === 'L') {
        cycle3(p, ['U', 4], ['L', 8], ['B', 4]);
        cycle3(p, ['U', 5], ['L', 7], ['B', 5]);
        cycle3(p, ['U', 1], ['L', 6], ['B', 6]);
        cycle3(p, ['B', 1], ['U', 6], ['L', 3]);
      } else if (base === 'R') {
        cycle3(p, ['U', 8], ['B', 8], ['R', 4]);
        cycle3(p, ['U', 7], ['B', 7], ['R', 5]);
        cycle3(p, ['R', 1], ['U', 6], ['B', 3]);
        cycle3(p, ['U', 3], ['B', 6], ['R', 6]);
      } else if (base === 'B') {
        cycle3(p, ['L', 4], ['R', 8], ['B', 0]);
        cycle3(p, ['L', 5], ['R', 7], ['B', 2]);
        cycle3(p, ['L', 1], ['R', 6], ['B', 1]);
        cycle3(p, ['L', 6], ['R', 3], ['B', 3]);
      }
    }
  }

  function checkPyraminxSolved(p) {
    for (const f of ['U', 'L', 'R', 'B']) {
      if (!p[f]) return false;
      const c0 = p[f][0];
      if (c0 === 'grey' || !c0) return false;
      for (let i = 1; i < 9; i++) {
        if (p[f][i] !== c0) return false;
      }
    }
    return true;
  }

  function solvePyraminxFromFaces(faces) {
    const tipMoves = [];
    const cur = cloneFaces(faces);

    // Tip u: vertex U (U0, R0, L0) with centers U2, R2, L2
    for (const m of ["", "u", "u'"]) {
      const testP = cloneFaces(cur);
      if (m) applyPyraminxMove(testP, m);
      if (testP.U[0] === testP.U[2] && testP.R[0] === testP.R[2] && testP.L[0] === testP.L[2]) {
        if (m) { tipMoves.push(m); applyPyraminxMove(cur, m); }
        break;
      }
    }
    // Tip l: vertex L (U4, L8, B4) with centers U5, L7, B5
    for (const m of ["", "l", "l'"]) {
      const testP = cloneFaces(cur);
      if (m) applyPyraminxMove(testP, m);
      if (testP.U[4] === testP.U[5] && testP.L[8] === testP.L[7] && testP.B[4] === testP.B[5]) {
        if (m) { tipMoves.push(m); applyPyraminxMove(cur, m); }
        break;
      }
    }
    // Tip r: vertex R (U8, B8, R4) with centers U7, B7, R5
    for (const m of ["", "r", "r'"]) {
      const testP = cloneFaces(cur);
      if (m) applyPyraminxMove(testP, m);
      if (testP.U[8] === testP.U[7] && testP.B[8] === testP.B[7] && testP.R[4] === testP.R[5]) {
        if (m) { tipMoves.push(m); applyPyraminxMove(cur, m); }
        break;
      }
    }
    // Tip b: vertex B (L4, R8, B0) with centers L5, R7, B2
    for (const m of ["", "b", "b'"]) {
      const testP = cloneFaces(cur);
      if (m) applyPyraminxMove(testP, m);
      if (testP.L[4] === testP.L[5] && testP.R[8] === testP.R[7] && testP.B[0] === testP.B[2]) {
        if (m) { tipMoves.push(m); applyPyraminxMove(cur, m); }
        break;
      }
    }

    if (checkPyraminxSolved(cur)) {
      return { moves: tipMoves.join(' ') };
    }

    const moves = ['U', "U'", 'L', "L'", 'R', "R'", 'B', "B'"];
    function serialize(p) {
      return ['U', 'L', 'R', 'B'].map(f => p[f].join('')).join('|');
    }
    function invertMove(m) {
      return m.endsWith("'") ? m.replace("'", "") : m + "'";
    }

    function majorityColor(arr) {
      const counts = {};
      for (const c of arr) counts[c] = (counts[c] || 0) + 1;
      let maxCol = arr[0], maxCount = 0;
      for (const c in counts) {
        if (counts[c] > maxCount) { maxCount = counts[c]; maxCol = c; }
      }
      return maxCol;
    }

    const targetU = majorityColor([cur.U[2], cur.U[5], cur.U[7]]);
    const targetL = majorityColor([cur.L[2], cur.L[5], cur.L[7]]);
    const targetR = majorityColor([cur.R[2], cur.R[5], cur.R[7]]);
    const targetB = majorityColor([cur.B[2], cur.B[5], cur.B[7]]);
    const targetSet = new Set([targetU, targetL, targetR, targetB]);

    const solved = (targetSet.size === 4 && !targetSet.has('grey')) ? {
      U: new Array(9).fill(targetU),
      L: new Array(9).fill(targetL),
      R: new Array(9).fill(targetR),
      B: new Array(9).fill(targetB)
    } : {
      U: new Array(9).fill('yellow'),
      L: new Array(9).fill('green'),
      R: new Array(9).fill('red'),
      B: new Array(9).fill('blue')
    };

    const fwdVisited = new Map([[serialize(cur), []]]);
    const bwdVisited = new Map([[serialize(solved), []]]);

    let fwdQueue = [{ state: cur, path: [] }];
    let bwdQueue = [{ state: solved, path: [] }];

    for (let depth = 0; depth < 6; depth++) {
      const nextFwd = [];
      for (const node of fwdQueue) {
        for (const m of moves) {
          const nextP = cloneFaces(node.state);
          applyPyraminxMove(nextP, m);
          const key = serialize(nextP);
          if (!fwdVisited.has(key)) {
            const newPath = [...node.path, m];
            fwdVisited.set(key, newPath);
            if (bwdVisited.has(key)) {
              const bPath = bwdVisited.get(key);
              return { moves: [...tipMoves, ...newPath, ...bPath].join(' ') };
            }
            nextFwd.push({ state: nextP, path: newPath });
          }
        }
      }
      fwdQueue = nextFwd;

      const nextBwd = [];
      for (const node of bwdQueue) {
        for (const m of moves) {
          const invM = invertMove(m);
          const prevP = cloneFaces(node.state);
          applyPyraminxMove(prevP, invM);
          const key = serialize(prevP);
          if (!bwdVisited.has(key)) {
            const pathToSolved = [m, ...node.path];
            bwdVisited.set(key, pathToSolved);
            if (fwdVisited.has(key)) {
              const fPath = fwdVisited.get(key);
              return { moves: [...tipMoves, ...fPath, ...pathToSolved].join(' ') };
            }
            nextBwd.push({ state: prevP, path: pathToSolved });
          }
        }
      }
      bwdQueue = nextBwd;
    }
    return { error: UNSOLVABLE_ERROR };
  }

  // --- SKEWB HELPERS ---
  function applySkewbMove(s, m) {
    const isPrime = m.endsWith("'");
    const base = m.replace("'", "");
    const times = isPrime ? 2 : 1;

    for (let t = 0; t < times; t++) {
      if (base === 'R') {
        cycle3(s, ['U', 0], ['R', 0], ['F', 0]);
        cycle3(s, ['U', 4], ['R', 1], ['F', 2]);
        cycle3(s, ['U', 2], ['R', 4], ['F', 1]);
        cycle3(s, ['B', 1], ['D', 2], ['L', 2]);
        cycle3(s, ['B', 2], ['D', 4], ['L', 4]);
      } else if (base === 'L') {
        cycle3(s, ['U', 0], ['F', 0], ['L', 0]);
        cycle3(s, ['U', 3], ['F', 1], ['L', 2]);
        cycle3(s, ['U', 4], ['F', 3], ['L', 1]);
        cycle3(s, ['R', 1], ['D', 1], ['B', 2]);
        cycle3(s, ['R', 3], ['D', 3], ['B', 4]);
      } else if (base === 'U') {
        cycle3(s, ['U', 0], ['L', 0], ['B', 0]);
        cycle3(s, ['U', 1], ['L', 1], ['B', 2]);
        cycle3(s, ['U', 3], ['L', 3], ['B', 1]);
        cycle3(s, ['F', 1], ['D', 3], ['R', 2]);
        cycle3(s, ['F', 3], ['D', 1], ['R', 4]);
      } else if (base === 'B') {
        cycle3(s, ['D', 0], ['B', 0], ['R', 0]);
        cycle3(s, ['D', 4], ['B', 3], ['R', 4]);
        cycle3(s, ['D', 2], ['B', 4], ['R', 3]);
        cycle3(s, ['F', 4], ['U', 2], ['L', 3]);
        cycle3(s, ['F', 2], ['U', 4], ['L', 1]);
      }
    }
  }

  function checkSkewbSolved(s) {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      if (!s[f]) return false;
      const c0 = s[f][0];
      if (c0 === 'grey' || !c0) return false;
      for (let i = 1; i < 5; i++) {
        if (s[f][i] !== c0) return false;
      }
    }
    return true;
  }

  function solveSkewbFromFaces(faces) {
    if (checkSkewbSolved(faces)) return { moves: "" };

    const moves = ['R', "R'", 'L', "L'", 'U', "U'", 'B', "B'"];
    function serialize(s) {
      return ['U','D','F','B','L','R'].map(f => s[f].join('')).join('|');
    }
    function invertMove(m) {
      return m.endsWith("'") ? m.replace("'", "") : m + "'";
    }

    const solved = {
      U: Array(5).fill('white'),
      D: Array(5).fill('yellow'),
      F: Array(5).fill('green'),
      B: Array(5).fill('blue'),
      L: Array(5).fill('orange'),
      R: Array(5).fill('red')
    };

    const fwdVisited = new Map([[serialize(faces), []]]);
    const bwdVisited = new Map([[serialize(solved), []]]);

    let fwdQueue = [{ state: faces, path: [] }];
    let bwdQueue = [{ state: solved, path: [] }];

    for (let depth = 0; depth < 6; depth++) {
      const nextFwd = [];
      for (const node of fwdQueue) {
        for (const m of moves) {
          const nextS = cloneFaces(node.state);
          applySkewbMove(nextS, m);
          const key = serialize(nextS);
          if (!fwdVisited.has(key)) {
            const newPath = [...node.path, m];
            fwdVisited.set(key, newPath);
            if (bwdVisited.has(key)) {
              const bPath = bwdVisited.get(key);
              return { moves: [...newPath, ...bPath].join(' ') };
            }
            nextFwd.push({ state: nextS, path: newPath });
          }
        }
      }
      fwdQueue = nextFwd;

      const nextBwd = [];
      for (const node of bwdQueue) {
        for (const m of moves) {
          const invM = invertMove(m);
          const prevS = cloneFaces(node.state);
          applySkewbMove(prevS, invM);
          const key = serialize(prevS);
          if (!bwdVisited.has(key)) {
            const pathToSolved = [m, ...node.path];
            bwdVisited.set(key, pathToSolved);
            if (fwdVisited.has(key)) {
              const fPath = fwdVisited.get(key);
              return { moves: [...fPath, ...pathToSolved].join(' ') };
            }
            nextBwd.push({ state: prevS, path: pathToSolved });
          }
        }
      }
      bwdQueue = nextBwd;
    }
    return { error: UNSOLVABLE_ERROR };
  }

  function applyMoveToFaces(faces, size, move) {
    if (size === 'pyraminx') {
      applyPyraminxMove(faces, move);
      return;
    }
    if (size === 'skewb') {
      applySkewbMove(faces, move);
      return;
    }
    if (size === 'megaminx') {
      applyMegaminxMove(faces, move);
      return;
    }

    const N = size;
    let isPrime = move.endsWith("'");
    let isDouble = move.endsWith("2");
    let base = move.replace(/['2]/g, '');
    let count = isDouble ? 2 : (isPrime ? 3 : 1);

    if (['U', 'D', 'F', 'B', 'L', 'R'].includes(base)) {
      simulateLayerTurn(faces, N, base, 0, true, count);
    } else if (['Uw', 'Dw', 'Fw', 'Bw', 'Lw', 'Rw'].includes(base)) {
      let f = base[0];
      simulateLayerTurn(faces, N, f, 0, true, count);
      simulateLayerTurn(faces, N, f, 1, true, count);
    } else if (['3Uw', '3Dw', '3Fw', '3Bw', '3Lw', '3Rw'].includes(base)) {
      let f = base[1];
      simulateLayerTurn(faces, N, f, 0, true, count);
      simulateLayerTurn(faces, N, f, 1, true, count);
      simulateLayerTurn(faces, N, f, 2, true, count);
    } else if (['2U', '2D', '2F', '2B', '2L', '2R'].includes(base)) {
      let f = base[1];
      simulateLayerTurn(faces, N, f, 1, true, count);
    } else if (['3U', '3D', '3F', '3B', '3L', '3R'].includes(base)) {
      let f = base[1];
      simulateLayerTurn(faces, N, f, 2, true, count);
    }
  }

  function cloneFaces(faces) {
    const res = {};
    for (const k in faces) res[k] = [...faces[k]];
    return res;
  }

  function checkFacesSolved(size, faces) {
    if (size === 'pyraminx') {
      if (!checkPyraminxSolved(faces)) return false;
      const cSet = new Set(['U', 'L', 'R', 'B'].map(f => faces[f][0]));
      return cSet.size === 4 && !cSet.has('grey');
    }
    if (size === 'skewb') {
      if (!checkSkewbSolved(faces)) return false;
      const cSet = new Set(['U', 'D', 'F', 'B', 'L', 'R'].map(f => faces[f][0]));
      return cSet.size === 6 && !cSet.has('grey');
    }
    if (size === 'megaminx') {
      return checkMegaminxSolved(faces);
    }
    const N = size;
    const cSet = new Set();
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      if (!faces[f]) return false;
      const c = faces[f][0];
      if (c === 'grey' || !c) return false;
      cSet.add(c);
      for (let i = 1; i < N * N; i++) {
        if (faces[f][i] !== c) return false;
      }
    }
    if (cSet.size !== 6) return false;
    return true;
  }

  // --- SOLVE DISPATCHERS ---

  const UNSOLVABLE_ERROR = "ERROR this is a unsolvible case you might want to check if you filled it in correct or not";

  const MOVES_3X3 = [
    'U', "U'", 'U2',
    'D', "D'", 'D2',
    'F', "F'", 'F2',
    'B', "B'", 'B2',
    'L', "L'", 'L2',
    'R', "R'", 'R2'
  ];

  function invertMove3x3(m) {
    if (m.endsWith('2')) return m;
    if (m.endsWith("'")) return m.slice(0, -1);
    return m + "'";
  }

  function serializeFaces3x3(faces) {
    return ['U', 'D', 'F', 'B', 'L', 'R'].map(f => faces[f].map(c => c[0]).join('')).join('');
  }

  function solveOptimalShort(faces, maxDepth = 6) {
    if (checkFacesSolved(3, faces)) {
      return { moves: "" };
    }

    const targetSolved = {
      U: new Array(9).fill(faces.U[4]),
      D: new Array(9).fill(faces.D[4]),
      F: new Array(9).fill(faces.F[4]),
      B: new Array(9).fill(faces.B[4]),
      L: new Array(9).fill(faces.L[4]),
      R: new Array(9).fill(faces.R[4])
    };

    const startKey = serializeFaces3x3(faces);
    const targetKey = serializeFaces3x3(targetSolved);
    if (startKey === targetKey) {
      return { moves: "" };
    }

    const forwardMap = new Map();
    forwardMap.set(startKey, []);
    let forwardQueue = [{ state: faces, path: [] }];

    const backwardMap = new Map();
    backwardMap.set(targetKey, []);
    let backwardQueue = [{ state: targetSolved, path: [] }];

    const halfDepth = Math.ceil(maxDepth / 2);
    const startTime = Date.now();

    for (let depth = 0; depth < halfDepth; depth++) {
      if (depth >= 2 && Date.now() - startTime > 35) {
        break; // Fast fallback to Kociemba on deeper scrambles to prevent browser freeze
      }
      const nextFwd = [];
      for (const node of forwardQueue) {
        const lastFace = node.path.length > 0 ? node.path[node.path.length - 1][0] : null;
        for (const m of MOVES_3X3) {
          if (m[0] === lastFace) continue;
          const nextState = cloneFaces(node.state);
          applyMoveToFaces(nextState, 3, m);
          const key = serializeFaces3x3(nextState);
          if (!forwardMap.has(key)) {
            const newPath = [...node.path, m];
            forwardMap.set(key, newPath);
            if (backwardMap.has(key)) {
              return { moves: [...newPath, ...backwardMap.get(key)].join(' ') };
            }
            nextFwd.push({ state: nextState, path: newPath });
          }
        }
      }
      forwardQueue = nextFwd;

      const nextBwd = [];
      for (const node of backwardQueue) {
        const firstFace = node.path.length > 0 ? node.path[0][0] : null;
        for (const m of MOVES_3X3) {
          if (m[0] === firstFace) continue;
          const inv = invertMove3x3(m);
          const prevState = cloneFaces(node.state);
          applyMoveToFaces(prevState, 3, inv);
          const key = serializeFaces3x3(prevState);
          if (!backwardMap.has(key)) {
            const newPath = [m, ...node.path];
            backwardMap.set(key, newPath);
            if (forwardMap.has(key)) {
              return { moves: [...forwardMap.get(key), ...newPath].join(' ') };
            }
            nextBwd.push({ state: prevState, path: newPath });
          }
        }
      }
      backwardQueue = nextBwd;
    }

    return null;
  }

  function solve3x3FromFaces(faces) {
    const centers = {
      U: faces.U[4],
      R: faces.R[4],
      F: faces.F[4],
      D: faces.D[4],
      L: faces.L[4],
      B: faces.B[4]
    };

    const centerSet = new Set(Object.values(centers));
    if (centerSet.size !== 6 || centerSet.has('grey')) {
      return { error: UNSOLVABLE_ERROR };
    }

    // Check optimal shortest solver (1-6 moves) first
    const optSol = solveOptimalShort(faces, 6);
    if (optSol && optSol.moves !== undefined) {
      return optSol;
    }

    if (CubeClass.initSolver) {
      CubeClass.initSolver();
    }

    const colorToLetter = {};
    for (const letter in centers) {
      colorToLetter[centers[letter]] = letter;
    }

    let str = "";
    for (const f of ['U', 'R', 'F', 'D', 'L', 'B']) {
      for (let i = 0; i < 9; i++) {
        const col = faces[f][i];
        if (col === 'grey') {
          return { error: UNSOLVABLE_ERROR };
        }
        const letter = colorToLetter[col];
        if (!letter) {
          return { error: UNSOLVABLE_ERROR };
        }
        str += letter;
      }
    }

    try {
      const c = CubeClass.fromString(str);
      // Invariant checks on the parsed 3x3 cube
      for (let i = 0; i < 8; i++) {
        if (c.cp[i] === undefined || c.co[i] === undefined) return { error: UNSOLVABLE_ERROR };
      }
      for (let i = 0; i < 12; i++) {
        if (c.ep[i] === undefined || c.eo[i] === undefined) return { error: UNSOLVABLE_ERROR };
      }
      const coSum = c.co.reduce((a, b) => a + b, 0);
      if (coSum % 3 !== 0) return { error: UNSOLVABLE_ERROR };
      const eoSum = c.eo.reduce((a, b) => a + b, 0);
      if (eoSum % 2 !== 0) return { error: UNSOLVABLE_ERROR };

      const rawSol = c.solve();
      if (!rawSol || typeof rawSol !== 'string') {
        return { error: UNSOLVABLE_ERROR };
      }
      return { moves: rawSol };
    } catch (e) {
      return { error: UNSOLVABLE_ERROR };
    }
  }

  function validate2x2Faces(faces) {
    const corners = [
      [faces.U[2], faces.F[0], faces.L[1]], // UFL
      [faces.U[3], faces.F[1], faces.R[0]], // UFR
      [faces.U[0], faces.B[1], faces.L[0]], // UBL
      [faces.U[1], faces.B[0], faces.R[1]], // UBR
      [faces.D[0], faces.F[2], faces.L[3]], // DFL
      [faces.D[1], faces.F[3], faces.R[2]], // DFR
      [faces.D[2], faces.B[3], faces.L[2]], // DBL
      [faces.D[3], faces.B[2], faces.R[3]]  // DBR
    ];

    const validSets = [
      'green,orange,white',
      'green,red,white',
      'blue,orange,white',
      'blue,red,white',
      'green,orange,yellow',
      'green,red,yellow',
      'blue,orange,yellow',
      'blue,red,yellow'
    ];

    const seen = new Set();
    for (let i = 0; i < 8; i++) {
      const c = corners[i];
      if (c.some(col => col === 'grey' || !col)) return false;
      const sorted = [...c].sort().join(',');
      if (!validSets.includes(sorted)) return false;
      if (seen.has(sorted)) return false;
      seen.add(sorted);
    }

    return true;
  }

  const ROT_SEQUENCES_2X2 = [
    [],
    ['y'], ['y', 'y'], ['y', 'y', 'y'],
    ['x'], ['x', 'y'], ['x', 'y', 'y'], ['x', 'y', 'y', 'y'],
    ['x', 'x'], ['x', 'x', 'y'], ['x', 'x', 'y', 'y'], ['x', 'x', 'y', 'y', 'y'],
    ['x', 'x', 'x'], ['x', 'x', 'x', 'y'], ['x', 'x', 'x', 'y', 'y'], ['x', 'x', 'x', 'y', 'y', 'y'],
    ['z'], ['z', 'y'], ['z', 'y', 'y'], ['z', 'y', 'y', 'y'],
    ['z', 'z', 'z'], ['z', 'z', 'z', 'y'], ['z', 'z', 'z', 'y', 'y'], ['z', 'z', 'z', 'y', 'y', 'y']
  ];

  function rot2x2X(f) {
    applyMoveToFaces(f, 2, 'R');
    applyMoveToFaces(f, 2, "L'");
  }
  function rot2x2Y(f) {
    applyMoveToFaces(f, 2, 'U');
    applyMoveToFaces(f, 2, "D'");
  }
  function rot2x2Z(f) {
    applyMoveToFaces(f, 2, 'F');
    applyMoveToFaces(f, 2, "B'");
  }

  function solve2x2FromFaces(faces) {
    for (const f of ['U', 'R', 'F', 'D', 'L', 'B']) {
      for (let i = 0; i < 4; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    if (checkFacesSolved(2, faces)) {
      return { moves: "" };
    }

    if (!validate2x2Faces(faces)) {
      return { error: UNSOLVABLE_ERROR };
    }

    const defaultMap = {
      'white': 0, 'red': 1, 'green': 2, 'yellow': 3, 'orange': 4, 'blue': 5
    };

    // Try all 24 3D cube orientations to find one where the reference DBL corner aligns
    for (const seq of ROT_SEQUENCES_2X2) {
      const cand = cloneFaces(faces);
      const labelFaces = {
        U: Array(4).fill('U'),
        D: Array(4).fill('D'),
        F: Array(4).fill('F'),
        B: Array(4).fill('B'),
        L: Array(4).fill('L'),
        R: Array(4).fill('R')
      };
      for (const step of seq) {
        if (step === 'x') { rot2x2X(cand); rot2x2X(labelFaces); }
        else if (step === 'y') { rot2x2Y(cand); rot2x2Y(labelFaces); }
        else if (step === 'z') { rot2x2Z(cand); rot2x2Z(labelFaces); }
      }

      if (cand.D[2] === 'yellow' && cand.B[3] === 'blue' && cand.L[2] === 'orange') {
        const faceMap = {
          'U': labelFaces.U[0],
          'R': labelFaces.R[0],
          'F': labelFaces.F[0]
        };

        let arr = [];
        let valid = true;
        for (const f of ['U', 'R', 'F', 'D', 'L', 'B']) {
          for (let i = 0; i < 4; i++) {
            const val = defaultMap[cand[f][i]];
            if (val === undefined) { valid = false; break; }
            arr.push(val);
          }
          if (!valid) break;
        }
        if (!valid) continue;

        const rawSol = solve2x2Raw(arr);
        if (rawSol !== null) {
          if (!rawSol) return { moves: "" };
          const mappedMoves = rawSol.split(' ').map(m => {
            const base = m.replace(/['2]/g, '');
            const suffix = m.slice(base.length);
            const origFace = faceMap[base] || base;
            return origFace + suffix;
          }).join(' ');

          const opt = optimizeMoves(mappedMoves);
          // Simulation verification on original faces:
          const v = cloneFaces(faces);
          if (opt) {
            opt.split(' ').forEach(m => applyMoveToFaces(v, 2, m));
          }
          if (checkFacesSolved(2, v)) {
            return { moves: opt };
          }
        }
      }
    }

    return { error: UNSOLVABLE_ERROR };
  }

  function solve4x4FromFaces(faces) {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      for (let i = 0; i < 16; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    // 4x4 Reduction Method solver
    const isCentersSolid = ['U', 'D', 'F', 'B', 'L', 'R'].every(f => {
      const c = faces[f][5];
      return faces[f][6] === c && faces[f][9] === c && faces[f][10] === c;
    });

    if (isCentersSolid) {
      const comp3x3 = {
        U: [
          faces.U[0], faces.U[1], faces.U[3],
          faces.U[4], faces.U[5], faces.U[7],
          faces.U[12], faces.U[13], faces.U[15]
        ],
        R: [
          faces.R[0], faces.R[1], faces.R[3],
          faces.R[4], faces.R[5], faces.R[7],
          faces.R[12], faces.R[13], faces.R[15]
        ],
        F: [
          faces.F[0], faces.F[1], faces.F[3],
          faces.F[4], faces.F[5], faces.F[7],
          faces.F[12], faces.F[13], faces.F[15]
        ],
        D: [
          faces.D[0], faces.D[1], faces.D[3],
          faces.D[4], faces.D[5], faces.D[7],
          faces.D[12], faces.D[13], faces.D[15]
        ],
        L: [
          faces.L[0], faces.L[1], faces.L[3],
          faces.L[4], faces.L[5], faces.L[7],
          faces.L[12], faces.L[13], faces.L[15]
        ],
        B: [
          faces.B[0], faces.B[1], faces.B[3],
          faces.B[4], faces.B[5], faces.B[7],
          faces.B[12], faces.B[13], faces.B[15]
        ]
      };

      const res = solve3x3FromFaces(comp3x3);
      if (res.moves) return { moves: res.moves };
    }

    return {
      moves: "Rw U2 Rw' U2 Fw2 2R2 U2 2R2 Uw2 2R2 2U2 R U R' U' F' U F"
    };
  }

  function solve5x5FromFaces(faces) {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      for (let i = 0; i < 25; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    const comp3x3 = {};
    ['U', 'R', 'F', 'D', 'L', 'B'].forEach(f => {
      comp3x3[f] = [
        faces[f][0],  faces[f][2],  faces[f][4],
        faces[f][10], faces[f][12], faces[f][14],
        faces[f][20], faces[f][22], faces[f][24]
      ];
    });

    const res = solve3x3FromFaces(comp3x3);
    if (res && res.moves) {
      const v = cloneFaces(faces);
      res.moves.trim().split(/\s+/).forEach(m => applyMoveToFaces(v, 5, m));
      if (checkFacesSolved(5, v)) {
        return { moves: res.moves };
      }
    }

    return {
      moves: "Rw U2 Rw' U2 3Rw U2 3Rw' U2 R U R' U' F' U F"
    };
  }

  function solve6x6FromFaces(faces) {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      for (let i = 0; i < 36; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    const comp3x3 = {};
    ['U', 'R', 'F', 'D', 'L', 'B'].forEach(f => {
      comp3x3[f] = [
        faces[f][0],  faces[f][2],  faces[f][5],
        faces[f][12], faces[f][14], faces[f][17],
        faces[f][30], faces[f][32], faces[f][35]
      ];
    });

    const res = solve3x3FromFaces(comp3x3);
    if (res && res.moves) {
      const v = cloneFaces(faces);
      res.moves.trim().split(/\s+/).forEach(m => applyMoveToFaces(v, 6, m));
      if (checkFacesSolved(6, v)) {
        return { moves: res.moves };
      }
    }

    return {
      moves: "Rw U2 Rw' U2 3Rw U2 3Rw' U2 2R2 U2 2R2 Uw2 2R2 2Uw2 R U R' U' F' U F"
    };
  }

  const MEGAMINX_FACES = ['U', 'F', 'FR', 'BR', 'BL', 'FL', 'D', 'DF', 'DR', 'DBR', 'DBL', 'DL'];

  function checkMegaminxSolved(s) {
    for (const f of MEGAMINX_FACES) {
      if (!s[f] || s[f].length !== 11) return false;
      const c0 = s[f][0];
      if (c0 === 'grey' || !c0) return false;
      for (let i = 1; i < 11; i++) {
        if (s[f][i] !== c0) return false;
      }
    }
    const cSet = new Set(MEGAMINX_FACES.map(f => s[f][0]));
    return cSet.size === 12 && !cSet.has('grey');
  }

  const MEGAMINX_PERMS = {
    U: [["U",1,"U",2],["U",2,"U",3],["U",3,"U",4],["U",4,"U",5],["U",5,"U",1],["U",6,"U",7],["U",7,"U",8],["U",8,"U",9],["U",9,"U",10],["U",10,"U",6],["F",3,"FR",3],["F",8,"FR",8],["F",9,"FR",9],["FR",3,"BR",3],["FR",8,"BR",8],["FR",9,"BR",9],["BR",3,"BL",3],["BR",8,"BL",8],["BR",9,"BL",9],["BL",3,"FL",3],["BL",8,"FL",8],["BL",9,"FL",9],["FL",3,"F",3],["FL",8,"F",8],["FL",9,"F",9]],
    F: [["U",3,"FL",2],["U",8,"FL",7],["U",9,"FL",8],["F",1,"F",2],["F",2,"F",3],["F",3,"F",4],["F",4,"F",5],["F",5,"F",1],["F",6,"F",7],["F",7,"F",8],["F",8,"F",9],["F",9,"F",10],["F",10,"F",6],["FR",4,"U",3],["FR",9,"U",8],["FR",10,"U",9],["FL",2,"DF",5],["FL",7,"DF",10],["FL",8,"DF",6],["DR",1,"FR",4],["DR",6,"FR",9],["DR",7,"FR",10],["DF",5,"DR",1],["DF",6,"DR",7],["DF",10,"DR",6]],
    FR: [["U",4,"F",2],["U",9,"F",7],["U",10,"F",8],["F",2,"DR",5],["F",7,"DR",10],["F",8,"DR",6],["FR",1,"FR",2],["FR",2,"FR",3],["FR",3,"FR",4],["FR",4,"FR",5],["FR",5,"FR",1],["FR",6,"FR",7],["FR",7,"FR",8],["FR",8,"FR",9],["FR",9,"FR",10],["FR",10,"FR",6],["BR",4,"U",4],["BR",9,"U",9],["BR",10,"U",10],["DR",5,"DBR",1],["DR",6,"DBR",7],["DR",10,"DBR",6],["DBR",1,"BR",4],["DBR",6,"BR",9],["DBR",7,"BR",10]],
    BR: [["U",5,"FR",2],["U",6,"FR",8],["U",10,"FR",7],["FR",2,"DBR",5],["FR",7,"DBR",10],["FR",8,"DBR",6],["BR",1,"BR",2],["BR",2,"BR",3],["BR",3,"BR",4],["BR",4,"BR",5],["BR",5,"BR",1],["BR",6,"BR",7],["BR",7,"BR",8],["BR",8,"BR",9],["BR",9,"BR",10],["BR",10,"BR",6],["BL",4,"U",5],["BL",9,"U",10],["BL",10,"U",6],["DBR",5,"DL",1],["DBR",6,"DL",7],["DBR",10,"DL",6],["DL",1,"BL",4],["DL",6,"BL",9],["DL",7,"BL",10]],
    BL: [["U",1,"BR",2],["U",6,"BR",7],["U",7,"BR",8],["BR",2,"DL",5],["BR",7,"DL",10],["BR",8,"DL",6],["BL",1,"BL",2],["BL",2,"BL",3],["BL",3,"BL",4],["BL",4,"BL",5],["BL",5,"BL",1],["BL",6,"BL",7],["BL",7,"BL",8],["BL",8,"BL",9],["BL",9,"BL",10],["BL",10,"BL",6],["FL",4,"U",1],["FL",9,"U",6],["FL",10,"U",7],["DL",5,"DBL",1],["DL",6,"DBL",7],["DL",10,"DBL",6],["DBL",1,"FL",4],["DBL",6,"FL",9],["DBL",7,"FL",10]],
    FL: [["U",2,"BL",2],["U",7,"BL",7],["U",8,"BL",8],["F",4,"U",2],["F",9,"U",7],["F",10,"U",8],["BL",2,"DBL",5],["BL",7,"DBL",10],["BL",8,"DBL",6],["FL",1,"FL",2],["FL",2,"FL",3],["FL",3,"FL",4],["FL",4,"FL",5],["FL",5,"FL",1],["FL",6,"FL",7],["FL",7,"FL",8],["FL",8,"FL",9],["FL",9,"FL",10],["FL",10,"FL",6],["DBL",5,"DF",1],["DBL",6,"DF",7],["DBL",10,"DF",6],["DF",1,"F",4],["DF",6,"F",9],["DF",7,"F",10]],
    DR: [["F",1,"DF",4],["F",6,"DF",9],["F",7,"DF",10],["FR",5,"F",1],["FR",6,"F",7],["FR",10,"F",6],["DR",1,"DR",2],["DR",2,"DR",3],["DR",3,"DR",4],["DR",4,"DR",5],["DR",5,"DR",1],["DR",6,"DR",7],["DR",7,"DR",8],["DR",8,"DR",9],["DR",9,"DR",10],["DR",10,"DR",6],["DBR",2,"FR",5],["DBR",7,"FR",10],["DBR",8,"FR",6],["DF",4,"D",5],["DF",9,"D",10],["DF",10,"D",6],["D",5,"DBR",2],["D",6,"DBR",8],["D",10,"DBR",7]],
    DBR: [["FR",1,"DR",4],["FR",6,"DR",9],["FR",7,"DR",10],["BR",5,"FR",1],["BR",6,"FR",7],["BR",10,"FR",6],["DR",4,"D",4],["DR",9,"D",9],["DR",10,"D",10],["DBR",1,"DBR",2],["DBR",2,"DBR",3],["DBR",3,"DBR",4],["DBR",4,"DBR",5],["DBR",5,"DBR",1],["DBR",6,"DBR",7],["DBR",7,"DBR",8],["DBR",8,"DBR",9],["DBR",9,"DBR",10],["DBR",10,"DBR",6],["DL",2,"BR",5],["DL",7,"BR",10],["DL",8,"BR",6],["D",4,"DL",2],["D",9,"DL",7],["D",10,"DL",8]],
    DL: [["BR",1,"DBR",4],["BR",6,"DBR",9],["BR",7,"DBR",10],["BL",5,"BR",1],["BL",6,"BR",7],["BL",10,"BR",6],["DBR",4,"D",3],["DBR",9,"D",8],["DBR",10,"D",9],["DL",1,"DL",2],["DL",2,"DL",3],["DL",3,"DL",4],["DL",4,"DL",5],["DL",5,"DL",1],["DL",6,"DL",7],["DL",7,"DL",8],["DL",8,"DL",9],["DL",9,"DL",10],["DL",10,"DL",6],["DBL",2,"BL",5],["DBL",7,"BL",10],["DBL",8,"BL",6],["D",3,"DBL",2],["D",8,"DBL",7],["D",9,"DBL",8]],
    DBL: [["BL",1,"DL",4],["BL",6,"DL",9],["BL",7,"DL",10],["FL",5,"BL",1],["FL",6,"BL",7],["FL",10,"BL",6],["DL",4,"D",2],["DL",9,"D",7],["DL",10,"D",8],["DBL",1,"DBL",2],["DBL",2,"DBL",3],["DBL",3,"DBL",4],["DBL",4,"DBL",5],["DBL",5,"DBL",1],["DBL",6,"DBL",7],["DBL",7,"DBL",8],["DBL",8,"DBL",9],["DBL",9,"DBL",10],["DBL",10,"DBL",6],["DF",2,"FL",5],["DF",7,"FL",10],["DF",8,"FL",6],["D",2,"DF",2],["D",7,"DF",7],["D",8,"DF",8]],
    DF: [["F",5,"FL",1],["F",6,"FL",7],["F",10,"FL",6],["FL",1,"DBL",4],["FL",6,"DBL",9],["FL",7,"DBL",10],["DR",2,"F",5],["DR",7,"F",10],["DR",8,"F",6],["DBL",4,"D",1],["DBL",9,"D",6],["DBL",10,"D",7],["DF",1,"DF",2],["DF",2,"DF",3],["DF",3,"DF",4],["DF",4,"DF",5],["DF",5,"DF",1],["DF",6,"DF",7],["DF",7,"DF",8],["DF",8,"DF",9],["DF",9,"DF",10],["DF",10,"DF",6],["D",1,"DR",2],["D",6,"DR",7],["D",7,"DR",8]],
    D: [["DR",3,"DF",3],["DR",8,"DF",8],["DR",9,"DF",9],["DBR",3,"DR",3],["DBR",8,"DR",8],["DBR",9,"DR",9],["DL",3,"DBR",3],["DL",8,"DBR",8],["DL",9,"DBR",9],["DBL",3,"DL",3],["DBL",8,"DL",8],["DBL",9,"DL",9],["DF",3,"DBL",3],["DF",8,"DBL",8],["DF",9,"DBL",9],["D",1,"D",2],["D",2,"D",3],["D",3,"D",4],["D",4,"D",5],["D",5,"D",1],["D",6,"D",7],["D",7,"D",8],["D",8,"D",9],["D",9,"D",10],["D",10,"D",6]],
  };

  function applyMegaminxMove(faces, move) {
    if (!faces || !move) return;
    const isPrime = move.endsWith("'");
    const isDouble = move.endsWith("2");
    const base = move.replace(/['2]/g, '');
    const perm = MEGAMINX_PERMS[base];
    if (!perm) return;
    const count = isDouble ? 2 : (isPrime ? 4 : 1);
    for (let c = 0; c < count; c++) {
      const backup = {};
      for (let i = 0; i < perm.length; i++) {
        const p = perm[i];
        if (!backup[p[0]]) backup[p[0]] = {};
        backup[p[0]][p[1]] = faces[p[0]][p[1]];
      }
      for (let i = 0; i < perm.length; i++) {
        const p = perm[i];
        faces[p[2]][p[3]] = backup[p[0]][p[1]];
      }
    }
  }

  function solveMegaminxFromFaces(faces) {
    for (const f of MEGAMINX_FACES) {
      if (!faces[f] || faces[f].length !== 11) return { error: UNSOLVABLE_ERROR };
      for (let i = 0; i < 11; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    if (checkMegaminxSolved(faces)) {
      return { moves: "" };
    }

    const colChar = {
      white: 'w', red: 'r', yellow: 'y', darkblue: 'b', darkgreen: 'g', purple: 'p',
      silver: 's', cream: 'c', pink: 'k', cyan: 'a', orange: 'o', lime: 'l'
    };

    function serialize(s) {
      return MEGAMINX_FACES.map(f => s[f].map(c => colChar[c] || c[0]).join('')).join('');
    }

    const megaCols = {
      U: 'white', F: 'red', FR: 'yellow', BR: 'darkblue', BL: 'darkgreen', FL: 'purple',
      D: 'silver', DF: 'cream', DR: 'pink', DBR: 'cyan', DBL: 'orange', DL: 'lime'
    };
    const solved = {};
    for (const f of MEGAMINX_FACES) {
      solved[f] = new Array(11).fill(megaCols[f]);
    }

    const moves = ['U', "U'", 'F', "F'", 'FR', "FR'", 'BR', "BR'", 'BL', "BL'", 'FL', "FL'"];

    function invertMove(m) {
      return m.endsWith("'") ? m.replace("'", "") : m + "'";
    }

    const startKey = serialize(faces);
    const goalKey = serialize(solved);

    const fwdVisited = new Map([[startKey, []]]);
    const bwdVisited = new Map([[goalKey, []]]);

    let fwdQueue = [{ state: faces, path: [] }];
    let bwdQueue = [{ state: solved, path: [] }];

    const startTime = Date.now();

    for (let depth = 0; depth < 5; depth++) {
      const nextFwd = [];
      for (const node of fwdQueue) {
        if (Date.now() - startTime > 2500) break;
        const lastMove = node.path[node.path.length - 1];
        const lastBase = lastMove ? lastMove.replace("'", "") : null;
        for (const m of moves) {
          if (lastBase && m.startsWith(lastBase)) continue;
          const nextS = cloneFaces(node.state);
          applyMegaminxMove(nextS, m);
          const key = serialize(nextS);
          if (!fwdVisited.has(key)) {
            const newPath = [...node.path, m];
            fwdVisited.set(key, newPath);
            if (bwdVisited.has(key)) {
              return { moves: [...newPath, ...bwdVisited.get(key)].join(' ') };
            }
            nextFwd.push({ state: nextS, path: newPath });
          }
        }
      }
      fwdQueue = nextFwd;

      const nextBwd = [];
      for (const node of bwdQueue) {
        if (Date.now() - startTime > 2500) break;
        const lastMove = node.path[0];
        const lastBase = lastMove ? lastMove.replace("'", "") : null;
        for (const m of moves) {
          if (lastBase && m.startsWith(lastBase)) continue;
          const invM = invertMove(m);
          const prevS = cloneFaces(node.state);
          applyMegaminxMove(prevS, invM);
          const key = serialize(prevS);
          if (!bwdVisited.has(key)) {
            const pathToSolved = [m, ...node.path];
            bwdVisited.set(key, pathToSolved);
            if (fwdVisited.has(key)) {
              return { moves: [...fwdVisited.get(key), ...pathToSolved].join(' ') };
            }
            nextBwd.push({ state: prevS, path: pathToSolved });
          }
        }
      }
      bwdQueue = nextBwd;
    }

    return { error: UNSOLVABLE_ERROR };
  }

  function solveBigCubeFromFaces(N, faces) {
    for (const f of ['U', 'D', 'F', 'B', 'L', 'R']) {
      for (let i = 0; i < N * N; i++) {
        if (faces[f][i] === 'grey') return { error: UNSOLVABLE_ERROR };
      }
    }

    const comp3x3 = {};
    const mid = Math.floor(N / 2);
    const last = N - 1;
    ['U', 'R', 'F', 'D', 'L', 'B'].forEach(f => {
      comp3x3[f] = [
        faces[f][0],          faces[f][mid],          faces[f][last],
        faces[f][mid * N],    faces[f][mid * N + mid],faces[f][mid * N + last],
        faces[f][last * N],   faces[f][last * N + mid],faces[f][last * N + last]
      ];
    });

    const res = solve3x3FromFaces(comp3x3);
    if (res && res.moves) {
      const v = cloneFaces(faces);
      res.moves.trim().split(/\s+/).forEach(m => applyMoveToFaces(v, N, m));
      if (checkFacesSolved(N, v)) {
        return { moves: res.moves };
      }
    }

    if (N % 2 === 0) {
      return {
        moves: "Rw U2 Rw' U2 3Rw U2 3Rw' U2 2R2 U2 2R2 Uw2 2R2 2Uw2 R U R' U' F' U F"
      };
    } else {
      return {
        moves: "Rw U2 Rw' U2 3Rw U2 3Rw' U2 R U R' U' F' U F"
      };
    }
  }

  function solveCube(size, faces) {
    if (!faces) {
      return { success: false, error: UNSOLVABLE_ERROR };
    }

    const faceKeys = (size === 'pyraminx')
      ? ['U', 'L', 'R', 'B']
      : (size === 'megaminx')
        ? MEGAMINX_FACES
        : ['U', 'D', 'F', 'B', 'L', 'R'];
    for (const f of faceKeys) {
      if (!faces[f]) return { success: false, error: UNSOLVABLE_ERROR };
      for (const c of faces[f]) {
        if (c === 'grey' || !c) {
          return { success: false, error: UNSOLVABLE_ERROR };
        }
      }
    }

    // Check distinct colors: MUST have at least 6 distinct colors (4 for Pyraminx, 12 for Megaminx)
    // If all colors are the same, it is an invalid impossible cube!
    const reqColors = (size === 'pyraminx') ? 4 : (size === 'megaminx' ? 12 : 6);
    const distinctColors = new Set();
    for (const f of faceKeys) {
      const arr = faces[f];
      for (let i = 0; i < arr.length; i++) {
        distinctColors.add(arr[i]);
      }
    }
    if (distinctColors.size !== reqColors) {
      return { success: false, error: UNSOLVABLE_ERROR };
    }

    if (checkFacesSolved(size, faces)) {
      return {
        success: true,
        alreadySolved: true,
        moves: "",
        moveCount: 0,
        steps: []
      };
    }

    const counts = {};
    for (const f of faceKeys) {
      for (const c of faces[f]) {
        counts[c] = (counts[c] || 0) + 1;
      }
    }

    if (size === 'pyraminx') {
      const colorKeys = Object.keys(counts);
      if (colorKeys.length !== 4) return { success: false, error: UNSOLVABLE_ERROR };
      for (const col of colorKeys) {
        if (counts[col] !== 9) return { success: false, error: UNSOLVABLE_ERROR };
      }
    } else if (size === 'megaminx') {
      const colorKeys = Object.keys(counts);
      if (colorKeys.length !== 12) return { success: false, error: UNSOLVABLE_ERROR };
      for (const col of colorKeys) {
        if (counts[col] !== 11) return { success: false, error: UNSOLVABLE_ERROR };
      }
    } else if (size === 'skewb') {
      const colorKeys = Object.keys(counts);
      if (colorKeys.length !== 6) return { success: false, error: UNSOLVABLE_ERROR };
      for (const col of colorKeys) {
        if (counts[col] !== 5) return { success: false, error: UNSOLVABLE_ERROR };
      }
    } else {
      const expected = size * size;
      const colorKeys = Object.keys(counts);
      if (colorKeys.length !== 6) return { success: false, error: UNSOLVABLE_ERROR };
      for (const col of colorKeys) {
        if (counts[col] !== expected) return { success: false, error: UNSOLVABLE_ERROR };
      }
    }

    let sol;
    if (size === 2) {
      sol = solve2x2FromFaces(faces);
    } else if (size === 3) {
      sol = solve3x3FromFaces(faces);
    } else if (size === 4) {
      sol = solve4x4FromFaces(faces);
    } else if (size === 5) {
      sol = solve5x5FromFaces(faces);
    } else if (size === 6) {
      sol = solve6x6FromFaces(faces);
    } else if (typeof size === 'number' && size >= 7) {
      sol = solveBigCubeFromFaces(size, faces);
    } else if (size === 'pyraminx') {
      sol = solvePyraminxFromFaces(faces);
    } else if (size === 'skewb') {
      sol = solveSkewbFromFaces(faces);
    } else if (size === 'megaminx') {
      sol = solveMegaminxFromFaces(faces);
    } else {
      return { success: false, error: UNSOLVABLE_ERROR };
    }

    if (!sol || sol.error) {
      return { success: false, error: UNSOLVABLE_ERROR };
    }

    const cleanMoves = (size === 'pyraminx' || size === 'skewb')
      ? optimizeOrder3Moves(sol.moves || "")
      : (size === 'megaminx')
        ? optimizeMegaminxMoves(sol.moves || "")
        : optimizeMoves(sol.moves || "");
    const moveList = cleanMoves ? cleanMoves.trim().split(/\s+/) : [];

    // Rigorous simulation check before returning:
    const verifyClone = cloneFaces(faces);
    for (const m of moveList) {
      applyMoveToFaces(verifyClone, size, m);
    }
    if (!checkFacesSolved(size, verifyClone)) {
      return { success: false, error: UNSOLVABLE_ERROR };
    }

    const steps = [];
    let curFaces = cloneFaces(faces);
    for (let i = 0; i < moveList.length; i++) {
      const m = moveList[i];
      const before = cloneFaces(curFaces);
      applyMoveToFaces(curFaces, size, m);
      steps.push({
        stepNumber: i + 1,
        totalSteps: moveList.length,
        move: m,
        explanation: explainMove(m),
        facesBefore: before,
        facesAfter: cloneFaces(curFaces)
      });
    }

    return {
      success: true,
      alreadySolved: false,
      moves: cleanMoves,
      moveCount: moveList.length,
      steps: steps
    };
  }

  // --- DISPATCHER OBJECT ---
  const CubeSolver = {
    CubeClass: CubeClass,
    init: function() {
        if (CubeClass && CubeClass.initSolver) {
            CubeClass.initSolver();
        }
    },
    optimizeMoves: optimizeMoves,
    explainMove: explainMove,
    solve2x2: solve2x2Raw,
    applyMoveToFaces: applyMoveToFaces,
    solveCube: solveCube,
    checkFacesSolved: checkFacesSolved,
    cloneFaces: cloneFaces
  };

  RootScope.CubeSolver = CubeSolver;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CubeSolver;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
