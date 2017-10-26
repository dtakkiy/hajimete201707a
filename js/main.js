$(function() {
  'user.strict';

  setInputItem();

  /* GOボタンをクリック */
  $('.square_btn').click(function() {
      var distance = $('.distance').val();
      var type = $('.type').val();
      var start = $('.start').val();
      var goal = $('.goal').val();

      if (isEmpty(distance) || isEmpty(type) || isEmpty(start) || isEmpty(goal)) {
        alert('空の項目があるようです。\n入力を見直して下さい。');
        return;
      }

      if ( null != start.match(/^[a-zA-Z0-9]/) ) {
        alert('スタート地点の入力が正しくありません。\n見直してください。');
        return;
      }

      if ( null != goal.match(/^[a-zA-Z0-9]/) ) {
        alert('ゴール地点の入力が正しくありません。\n見直してください。');
        return;
      }

      localStorage.setItem("distance", distance); //距離(km)
      localStorage.setItem("start", start);       //開始地点
      localStorage.setItem("goal", goal);         //ゴール地点
      localStorage.setItem("type", type);         //海沿いなど

      location.href = "map.php";
  });

  /* 入力値が空か */
  function isEmpty(value) {
      return !value || value.length === 0;
  }

  /*　Input項目設定 */
  function setInputItem() {
    if ( localStorage.getItem('start') ) {
      $('#start').val(localStorage.getItem('start'));
    }
    if ( localStorage.getItem('goal') ) {
      $('#goal').val(localStorage.getItem('goal'));
    }
    return;
  }

});
