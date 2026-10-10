(function () {
  // Each solution is the correct top-to-bottom order; `indent` is shown once solved.
  var PUZZLES = [
    { title: '1. Basic page skeleton', hint: 'Build a minimal HTML document.', lines: [
      ['<!DOCTYPE html>', 0], ['<html>', 0], ['<head>', 1], ['<title>My Page</title>', 2],
      ['</head>', 1], ['<body>', 1], ['<p>Hello, world!</p>', 2], ['</body>', 1], ['</html>', 0]] },
    { title: '2. A bulleted list', hint: 'A heading followed by an unordered list.', lines: [
      ['<h2>Shopping List</h2>', 0], ['<ul>', 0], ['<li>Apples</li>', 1], ['<li>Bread</li>', 1],
      ['<li>Milk</li>', 1], ['</ul>', 0]] },
    { title: '3. Links and images', hint: 'A paragraph holding a link, then an image.', lines: [
      ['<p>', 0], ['Visit our', 1], ['<a href="https://techboxdomain.com">home page</a>', 1],
      ['for more.', 1], ['</p>', 0], ['<img src="logo.png" alt="TechBox logo">', 0]] },
    { title: '4. A simple table', hint: 'One header row and one data row.', lines: [
      ['<table>', 0], ['<tr>', 1], ['<th>Name</th>', 2], ['<th>Age</th>', 2], ['</tr>', 1],
      ['<tr>', 1], ['<td>Sam</td>', 2], ['<td>12</td>', 2], ['</tr>', 1], ['</table>', 0]] },
    { title: '5. A sign-up form', hint: 'A form with a labelled input and a submit button.', lines: [
      ['<form action="/signup" method="post">', 0], ['<label for="email">Email:</label>', 1],
      ['<input type="email" id="email" name="email">', 1], ['<button type="submit">Join</button>', 1],
      ['</form>', 0]] }
  ];

  var host = document.getElementById('puzzles');
  var solvedCount = 0;

  function shuffled(arr) {
    var a = arr.slice();
    do {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
    } while (a.every(function (x, i) { return x === arr[i]; }));
    return a;
  }

  function updateProgress() {
    document.getElementById('bar-fill').style.width = (solvedCount / PUZZLES.length * 100) + '%';
    document.getElementById('progress-text').textContent = solvedCount + ' / ' + PUZZLES.length + ' solved';
    document.getElementById('finish').hidden = solvedCount !== PUZZLES.length;
  }

  function build(p) {
    var card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = '<h2></h2><p></p><ul class="lines"></ul>' +
      '<div class="actions"><button class="check">Check</button>' +
      '<button class="shuffle">Shuffle</button><span class="msg" role="status"></span></div>';
    card.querySelector('h2').textContent = p.title;
    card.querySelector('p').textContent = p.hint;

    var list = card.querySelector('.lines');
    var msg = card.querySelector('.msg');
    var checkBtn = card.querySelector('.check');
    var shuffleBtn = card.querySelector('.shuffle');
    var solved = false;
    var dragged = null;

    function addLine(item) {
      var li = document.createElement('li');
      li.className = 'line';
      li.draggable = true;
      li.dataset.text = item[0];
      li.dataset.indent = item[1];
      var code = document.createElement('code');
      code.textContent = item[0];
      var up = document.createElement('button');
      up.textContent = '▲'; up.setAttribute('aria-label', 'Move up');
      var down = document.createElement('button');
      down.textContent = '▼'; down.setAttribute('aria-label', 'Move down');
      up.onclick = function () { if (li.previousElementSibling) list.insertBefore(li, li.previousElementSibling); };
      down.onclick = function () { if (li.nextElementSibling) list.insertBefore(li.nextElementSibling, li); };
      li.append(code, up, down);
      li.addEventListener('dragstart', function () { dragged = li; li.classList.add('dragging'); });
      li.addEventListener('dragend', function () {
        li.classList.remove('dragging');
        [].forEach.call(list.children, function (c) { c.classList.remove('over'); });
      });
      li.addEventListener('dragover', function (e) {
        if (!dragged || dragged === li) return;
        e.preventDefault(); li.classList.add('over');
      });
      li.addEventListener('dragleave', function () { li.classList.remove('over'); });
      li.addEventListener('drop', function (e) {
        e.preventDefault(); li.classList.remove('over');
        if (!dragged || dragged === li) return;
        var kids = [].slice.call(list.children);
        if (kids.indexOf(dragged) < kids.indexOf(li)) list.insertBefore(dragged, li.nextSibling);
        else list.insertBefore(dragged, li);
      });
      list.appendChild(li);
    }

    function fill() {
      list.innerHTML = '';
      shuffled(p.lines).forEach(addLine);
      msg.textContent = ''; msg.className = 'msg';
    }

    checkBtn.onclick = function () {
      if (solved) return;
      var kids = [].slice.call(list.children);
      var allRight = true;
      kids.forEach(function (li, i) {
        var ok = li.dataset.text === p.lines[i][0];
        li.classList.toggle('right', ok);
        li.classList.toggle('wrong', !ok);
        if (!ok) allRight = false;
      });
      if (!allRight) {
        msg.textContent = 'Not quite – red lines are in the wrong spot.';
        msg.className = 'msg bad';
        return;
      }
      solved = true; solvedCount++;
      kids.forEach(function (li, i) {
        li.draggable = false;
        li.classList.remove('right', 'wrong');
        li.firstChild.textContent = '    '.repeat(p.lines[i][1]) + p.lines[i][0];
      });
      card.classList.add('solved', 'locked');
      checkBtn.disabled = shuffleBtn.disabled = true;
      msg.textContent = '✔ Solved!'; msg.className = 'msg ok';
      updateProgress();
    };
    shuffleBtn.onclick = function () { if (!solved) fill(); };

    fill();
    return card;
  }

  PUZZLES.forEach(function (p) { host.appendChild(build(p)); });
  updateProgress();
})();
